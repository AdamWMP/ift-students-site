import { NextRequest, NextResponse } from 'next/server';
import { notifySale } from '@/lib/sale-notifications';
import { addOns as ALL_ADDONS } from '@/lib/course-data';

// ─── Types ─────────────────────────────────────────────────────────────
interface CheckoutRequest {
  packageId: string;
  packageName: string;
  packagePrice: number;
  addOns?: string[];        // selected add-on IDs from the frontend
  addOnsTotal?: number;     // computed add-on price total from the frontend
  depositAmount: number;
  months: number;
  monthlyPayment: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timetable: string;
  startDate: string;
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
}

// ─── Ontraport Dropdown Mappings ───────────────────────────────────────
const LOCATION_TO_ONTRAPORT: Record<string, string> = {
  'swords':   '503',
  'tallaght': '502',
  'cork':     '501',
  'galway':   '500',
  'limerick': '499',
  'wexford':  '498',
  'belfast':  '563',
  'online':   '544',
};

const TIMETABLE_TO_ONTRAPORT: Record<string, string> = {
  '8-week-intensive':     '505',  // Thursday & Friday (8 Weeks)
  '16-week-evening-sat':  '597',  // Evening & Weekend - Mon + Wed + Sat (8 Weeks)
  '16-week-saturday':     '504',  // Saturday (16 Weeks)
  'pt-sun16':             '633',  // Sunday (16 Weeks)
  'online-self-paced':    '544',
};

// Human-readable timetable labels — mirror the Ontraport dropdown option labels
// so the Slack "Day" line reads in plain English instead of the slug.
const TIMETABLE_TO_LABEL: Record<string, string> = {
  '8-week-intensive':     '8 Week Intensive',
  '16-week-evening-sat':  '16 Week Evening + Saturday',
  '16-week-saturday':     '16 Week Saturday',
  'pt-sun16':             '16 Week Sunday',
  'online-self-paced':    'Online (Self-Paced)',
};

// Human-readable location labels
const LOCATION_TO_LABEL: Record<string, string> = {
  'swords':   'Dublin (Swords)',
  'tallaght': 'Dublin (Tallaght)',
  'cork':     'Cork',
  'galway':   'Galway',
  'limerick': 'Limerick',
  'wexford':  'Wexford',
  'belfast':  'Belfast',
  'online':   'Online',
};

// All PT-track packages share the same f1834 parent course (97). The
// distinguishing detail (which qualification(s) the customer is buying)
// lives in f2290 below.
const PACKAGE_TO_ONTRAPORT_COURSE: Record<string, string> = {
  'pro-coach':              '97',
  'complete-coach':         '97',
  'fitness-business-coach': '97',
  'pt-only':                '97',
  'group-instruction-only': '97',
  'launch-pad-bundle':      '97',
  'online-coaching-bundle': '97',
};

// f2290 (PT course qualifications) — Ontraport option IDs (resolved via API).
const PACKAGE_TO_ONTRAPORT_QUALIFICATIONS: Record<string, string> = {
  'pro-coach':              '497',  // The Cert (FI, GI, PT)
  'complete-coach':         '569',  // The Career (FI, GI, PT, Nutrition, FBA)
  'fitness-business-coach': '627',  // The Business (full + workshops + photoshoot)
  'pt-only':                '567',  // Personal Trainer Course Only
  'group-instruction-only': '566',  // Group Instruction Only
  'launch-pad-bundle':      '495',  // (Launchpad Bundle) Fitness Instructor & Personal Trainer
  'online-coaching-bundle': '570',  // Online Coaching Course (Fitness, PT, Nutrition, Advanced Nutrition, FBA)
};

// Self-paced packages: location + timetable + start date are forced server-side
// (defence-in-depth — UI also forces them)
const SELF_PACED_PACKAGE_IDS = new Set(['launch-pad-bundle', 'online-coaching-bundle']);

const TIMETABLE_TO_SKOOL_TAG: Record<string, string> = {
  '8-week-intensive':    '2337',
  '16-week-evening-sat': '2337',
  '16-week-saturday':    '2336',
};

const COMBO_COURSE_SALE_TAGS: Record<string, string> = {
  'S26': '2505',
  'A26': '2544',
};

// ─── Bundle tags + Ontraport "ticked" booleans ───────────────────────
// The Career (complete-coach): includes FBA inclusively → tag + tick FBA fields
// The Business (fitness-business-coach): includes everything Career has +
//   AI for Coaches, Programming for Success, Brand Launch Photoshoot
// All tick fields are written as the literal string "true" (Ontraport stores
// these as booleans; CSV export shows true/false).
const FBA_SALE_TAG_ID = '2325';
const AI_WORKSHOP_TAG_ID = '2359';
const PROGRAMMING_FOR_SUCCESS_TAG_ID = '2546';
const BRAND_LAUNCH_PHOTOSHOOT_TAG_ID = '2547';

// f2611 = Brand Launch Photoshoot ticked
// f2612 = AI for Coaches ticked
// f2613 = Programming for Success ticked
// f2614 = FBA Enrolled ticked
// f2615 = FBA Start Date (unix, default 7 Sep 2026 until ref doc lands)
const FBA_DEFAULT_START_DATE_UNIX = String(Math.floor(new Date('2026-09-07T00:00:00Z').getTime() / 1000));

// Packages that bundle FBA inclusively (auto-enrolled)
const PACKAGES_WITH_FBA = new Set(['complete-coach', 'fitness-business-coach']);
// Packages that bundle the three workshops/photoshoot inclusively
const PACKAGES_WITH_BUSINESS_BUNDLE = new Set(['fitness-business-coach']);

const PAYMENT_METHOD_STRIPE = '577';

// ─── Ontraport Gateway ───────────────────────────────────────────────
// Gateway 6: Image Education Ltd 2025 (production Stripe gateway)
const ONTRAPORT_GATEWAY_ID = '6';

// Ontraport product ID
const DEPOSIT_PRODUCT_ID = '97';

// Invoice receipt template — "IFT Global Receipt" (Ontraport → Invoices)
// Ontraport's processManual does NOT automatically email the initial receipt,
// so we explicitly call transaction/sendInvoice after a successful charge.
const INVOICE_TEMPLATE_ID = 5;

// ─── Ontraport API helper ────────────────────────────────────────────
function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

// ─── Fetch marketing attribution fields from the contact ────────────
// f2168 = Marketing Campaign Name
// f2169 = Marketing Ad Set
// f2170 = Marketing Ad Name
// These are set earlier by the tracking flow (UTM → Ontraport custom fields)
// and we read them back post-charge so the Slack ding shows real ad data.
async function fetchMarketingAttribution(contactId: string | number): Promise<{
  campaign: string;
  adSet: string;
  adName: string;
}> {
  try {
    const res = await fetch(
      `https://api.ontraport.com/1/Contact?id=${encodeURIComponent(String(contactId))}`,
      { method: 'GET', headers: ontraportHeaders() },
    );
    const json = await res.json() as Record<string, unknown>;
    const data = (json.data || {}) as Record<string, unknown>;
    return {
      campaign: (data.f2168 as string) || '',
      adSet:    (data.f2169 as string) || '',
      adName:   (data.f2170 as string) || '',
    };
  } catch (e) {
    console.error('[Checkout] Failed to fetch marketing attribution:', e);
    return { campaign: '', adSet: '', adName: '' };
  }
}

// ─── Send IFT Global Receipt for a successful invoice ────────────────
async function sendInvoiceReceipt(invoiceId: string | number) {
  try {
    const res = await fetch('https://api.ontraport.com/1/transaction/sendInvoice', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({
        id: String(invoiceId),
        invoice_template: INVOICE_TEMPLATE_ID,
      }),
    });
    const text = await res.text();
    console.log(`[Checkout] sendInvoice for ${invoiceId}:`, text.slice(0, 200));
  } catch (e) {
    console.error(`[Checkout] Failed to send invoice receipt for ${invoiceId}:`, e);
  }
}

// ─── Main Checkout Handler ───────────────────────────────────────────
// Flow:
//   1. Create/update Ontraport contact (basic info only)
//   2. Process payment via Ontraport processManual with card details
//      → Ontraport charges via their Stripe gateway
//      → Card saved in Ontraport Credit Card Details
//      → Payment plan managed in Ontraport Finance & Comms
//   3. ONLY on successful payment: add tags, set payment plan fields
// ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    const {
      packageId,
      packageName,
      packagePrice,
      addOns: selectedAddOnIds = [],
      addOnsTotal = 0,
      depositAmount,
      months,
      monthlyPayment,
      firstName,
      lastName,
      email,
      phone,
      location,
      timetable,
      startDate,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
    } = body;

    // Resolve add-on IDs → full add-on records (server-side source of truth)
    const selectedAddOns = ALL_ADDONS.filter((a) => selectedAddOnIds.includes(a.id));
    const selectedAddOnNames = selectedAddOns.map((a) => a.name);
    // Sanity check: re-compute total server-side; if frontend mismatched, log it
    const serverAddOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    if (selectedAddOnIds.length > 0 && Math.abs(serverAddOnsTotal - addOnsTotal) > 0.5) {
      console.warn(`[Checkout] addOnsTotal mismatch: frontend=${addOnsTotal} server=${serverAddOnsTotal} for ${email}`);
    }
    // packageName decorated with add-ons — used in Ontraport f1428 + Slack/email
    const packageNameWithAddOns = selectedAddOnNames.length
      ? `${packageName} + ${selectedAddOnNames.join(' + ')}`
      : packageName;
    // Total course value (used for f1544/f2294 + Slack effectiveTotal)
    const totalCourseValue = packagePrice + serverAddOnsTotal;

    // Validate required fields
    if (!packageId || !firstName || !lastName || !email || !phone || !location || !timetable) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvc) {
      return NextResponse.json({ error: 'Card details are required' }, { status: 400 });
    }
    if (depositAmount < 200) {
      return NextResponse.json({ error: 'Minimum deposit is €200' }, { status: 400 });
    }

    const ONTRAPORT_API_KEY = process.env.ONTRAPORT_API_KEY;
    const ONTRAPORT_APP_ID = process.env.ONTRAPORT_APP_ID;

    if (!ONTRAPORT_API_KEY || !ONTRAPORT_APP_ID) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const isFullPayment = depositAmount >= packagePrice;

    // Determine current term
    const currentMonth = new Date().getMonth() + 1;
    const yearShort = String(new Date().getFullYear()).slice(-2);
    const termPrefix = (currentMonth >= 2 && currentMonth <= 7) ? 'S' : 'A';
    const termCode = `${termPrefix}${yearShort}`;
    const termOptionId = (currentMonth >= 2 && currentMonth <= 7) ? '494' : '492';

    // Map frontend values to Ontraport option IDs
    const locationOptionId = LOCATION_TO_ONTRAPORT[location] || '';
    const timetableOptionId = TIMETABLE_TO_ONTRAPORT[timetable] || '';
    const courseOptionId = PACKAGE_TO_ONTRAPORT_COURSE[packageId] || '';
    const qualificationsOptionId = PACKAGE_TO_ONTRAPORT_QUALIFICATIONS[packageId] || '';

    const paymentPlanText = isFullPayment
      ? `Paid in Full — €${packagePrice}`
      : `€${depositAmount} deposit + €${monthlyPayment.toFixed(2)}/mo x ${months} months (billed 30th)`;

    // ── Step 1: Create/update Ontraport contact — IDENTITY ONLY ──────────
    // Defence-in-depth: course / location / timetable / start date / payment-plan
    // fields are deferred to Step 4 so a declined card can never leave a contact
    // record looking like an enrolled student. This is the order the business
    // requires — payment confirmed first, enrolment data + plan written second.
    const contactBody: Record<string, string> = {
      firstname: firstName,
      lastname: lastName,
      email,
      sms_number: phone,
    };

    const contactRes = await fetch('https://api.ontraport.com/1/Contacts/saveorupdate', {
      method: 'POST',
      headers: ontraportHeaders(),
      body: JSON.stringify(contactBody),
    });

    const contactText = await contactRes.text();
    let contactResult: Record<string, unknown>;
    try {
      contactResult = JSON.parse(contactText);
    } catch {
      console.error('[Checkout] Ontraport saveorupdate returned non-JSON:', contactText.slice(0, 200));
      await new Promise((r) => setTimeout(r, 1000));
      const retryRes = await fetch('https://api.ontraport.com/1/Contacts/saveorupdate', {
        method: 'POST',
        headers: ontraportHeaders(),
        body: JSON.stringify(contactBody),
      });
      contactResult = await retryRes.json();
    }

    if (contactResult.code !== 0) {
      console.error('Ontraport contact creation failed:', contactResult);
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }

    const contactData = contactResult.data as any;
    const contactId = contactData?.attrs?.id || contactData?.id || contactData?.[0]?.id;
    console.log(`[Checkout] Contact synced: ${email} → ID ${contactId}`);

    if (!contactId) {
      console.error('Ontraport contact ID not found in response:', JSON.stringify(contactResult).slice(0, 500));
      return NextResponse.json({ error: 'Failed to get contact ID' }, { status: 500 });
    }

    // ── Step 2A: Charge ONLY the deposit as a one-time transaction ─────────
    // Critical: previously we sent a single payment_plan offer with a trial
    // (deposit) + recurring (monthly) — Ontraport was creating the recurring
    // subscription EVEN WHEN the trial deposit charge failed. We confirmed
    // this in production (a single contact had three subscriptions created
    // alongside two declined invoices and one applied charge).
    //
    // The fix: charge the deposit as a plain one-time transaction first.
    // No recurring component is sent to Ontraport in this call, so a decline
    // here cannot leave a phantom subscription behind.
    const cardPayer = {
      ccnumber: cardNumber.replace(/\s/g, ''),
      code: cardCvc,
      expire_month: cardExpMonth,
      expire_year: cardExpYear,
    };

    const depositOffer = {
      products: [{
        id: DEPOSIT_PRODUCT_ID,
        type: '',
        quantity: 1,
        total: String(depositAmount.toFixed(2)),
        price: [{
          price: String(depositAmount.toFixed(2)),
          payment_count: 1,
          unit: 'month',
        }],
      }],
      subTotal: String(depositAmount.toFixed(2)),
      grandTotal: String(depositAmount.toFixed(2)),
      hasTaxes: false,
      hasShipping: false,
      delay: 0,
      invoice_template: INVOICE_TEMPLATE_ID,
      send_recurring_invoice: false,
    };

    const depositTxnBody = {
      contact_id: Number(contactId),
      chargeNow: 'chargeNow',
      gateway_id: ONTRAPORT_GATEWAY_ID,
      offer: depositOffer,
      payer: cardPayer,
    };

    console.log(`[Checkout] Charging deposit (one-time, no plan) for ${email}: €${depositAmount}`);

    const txnRes = await fetch('https://api.ontraport.com/1/transaction/processManual', {
      method: 'POST',
      headers: ontraportHeaders(),
      body: JSON.stringify(depositTxnBody),
    });

    const txnText = await txnRes.text();
    let txnResult: Record<string, unknown>;
    try {
      txnResult = JSON.parse(txnText);
    } catch {
      console.error('[Checkout] deposit processManual returned non-JSON:', txnText);
      return NextResponse.json(
        { error: 'Payment processing failed. Please try again.' },
        { status: 500 }
      );
    }

    console.log('[Checkout] deposit processManual response:', JSON.stringify(txnResult).slice(0, 500));

    // Check deposit result — if declined, abort. No plan was ever sent.
    const chargeResult = txnResult.chargeResult as Record<string, unknown> | undefined;
    if (chargeResult && chargeResult.result_code !== 1) {
      console.error('[Checkout] Deposit charge declined:', chargeResult);
      return NextResponse.json(
        { error: (chargeResult.message as string) || 'Payment was declined. Please check your card details and try again.' },
        { status: 500 }
      );
    }
    if (txnResult.code !== undefined && txnResult.code !== 0) {
      console.error('[Checkout] Deposit charge failed:', txnResult);
      const errorMsg = (txnResult.data as string) || (txnResult.message as string) || 'Payment processing failed';
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    // ── Step 2B: ONLY after deposit succeeded, schedule the recurring plan ─
    // This is a SEPARATE call. If it errors we don't roll back the deposit
    // (the customer has paid) — we log loudly and still proceed with tagging
    // so support can fix manually. But the typical case: deposit charged,
    // plan scheduled, both confirmed.
    if (!isFullPayment) {
      const now = new Date();
      const dayOfMonth = now.getDate();
      let targetMonth = now.getMonth();
      let targetYear = now.getFullYear();
      if (dayOfMonth >= 15) {
        targetMonth += 1;
        if (targetMonth > 11) { targetMonth = 0; targetYear += 1; }
      }
      let next30th = new Date(targetYear, targetMonth, 30);
      if (next30th.getMonth() !== targetMonth) {
        next30th = new Date(targetYear, targetMonth + 1, 0);
      }
      const daysUntilFirstCharge = Math.max(1, Math.ceil((next30th.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      const planOffer = {
        products: [{
          id: DEPOSIT_PRODUCT_ID,
          type: 'payment_plan',
          quantity: 1,
          total: String((monthlyPayment * months).toFixed(2)),
          price: [{
            price: String(monthlyPayment.toFixed(2)),
            payment_count: months,
            unit: 'month',
          }],
        }],
        subTotal: '0.00',
        grandTotal: '0.00',
        hasTaxes: false,
        hasShipping: false,
        delay: daysUntilFirstCharge,  // first recurring charge = next 30th
        invoice_template: INVOICE_TEMPLATE_ID,
        send_recurring_invoice: true,
      };

      const planTxnBody = {
        contact_id: Number(contactId),
        chargeNow: 'chargeLater',  // do NOT charge now — schedule first charge per delay
        gateway_id: ONTRAPORT_GATEWAY_ID,
        offer: planOffer,
        payer: cardPayer,  // card is now saved on contact, but pass for safety
      };

      console.log(`[Checkout] Scheduling recurring plan for ${email}: €${monthlyPayment} x ${months} months, first charge in ${daysUntilFirstCharge} day(s)`);

      try {
        const planRes = await fetch('https://api.ontraport.com/1/transaction/processManual', {
          method: 'POST',
          headers: ontraportHeaders(),
          body: JSON.stringify(planTxnBody),
        });
        const planText = await planRes.text();
        let planResult: Record<string, unknown> = {};
        try { planResult = JSON.parse(planText); } catch { /* keep raw */ }
        console.log('[Checkout] plan processManual response:', JSON.stringify(planResult).slice(0, 500));
        if (planResult.code !== undefined && planResult.code !== 0) {
          console.error(`[Checkout] ⚠️ Recurring plan creation failed for ${email} AFTER deposit was charged. Manual setup needed in Ontraport. Response:`, planResult);
          // Continue anyway — the deposit is paid, support will fix the plan
        }
      } catch (e) {
        console.error(`[Checkout] ⚠️ Recurring plan request errored for ${email} AFTER deposit was charged:`, e);
      }
    }

    // ════════════════════════════════════════════════════════════════════
    // ✅ PAYMENT SUCCESSFUL — now set tags, payment plan fields, etc.
    // ════════════════════════════════════════════════════════════════════

    console.log(`[Checkout] ✅ Payment successful for ${email}!`);

    // Extract invoice ID from the charge response for receipt + logs
    const txnData = (txnResult.data || {}) as Record<string, unknown>;
    const invoiceId = (txnData.invoice_id || txnData.id || txnResult.invoice_id) as string | number | undefined;

    // ── Send IFT Global Receipt to customer ─────────────────────────────
    if (invoiceId) {
      await sendInvoiceReceipt(invoiceId as string | number);
    }

    // ── Step 3: Add tags (only after successful payment) ────────────────
    const tagIds: string[] = ['50']; // "Customers"
    const tagLabels: string[] = ['Customers'];
    const comboSaleTagId = COMBO_COURSE_SALE_TAGS[termCode];
    if (comboSaleTagId) { tagIds.push(comboSaleTagId); tagLabels.push(`${termCode} Combo Course Sale`); }
    const skoolTagId = TIMETABLE_TO_SKOOL_TAG[timetable];
    if (skoolTagId) { tagIds.push(skoolTagId); tagLabels.push('Skool Enrolment'); }

    // ── Bundle tags ────────────────────────────────────────────────────
    // The Career (complete-coach) auto-includes FBA → tag FBA Sale
    // The Business (fitness-business-coach) auto-includes FBA + AI Workshop
    //   + Programming for Success + Brand Launch Photoshoot → tag all four
    if (PACKAGES_WITH_FBA.has(packageId)) {
      tagIds.push(FBA_SALE_TAG_ID);
      tagLabels.push('FBA Sale');
    }
    if (PACKAGES_WITH_BUSINESS_BUNDLE.has(packageId)) {
      tagIds.push(AI_WORKSHOP_TAG_ID);
      tagLabels.push('AI Workshop Sale');
      tagIds.push(PROGRAMMING_FOR_SUCCESS_TAG_ID);
      tagLabels.push('Programming for Success Sale');
      tagIds.push(BRAND_LAUNCH_PHOTOSHOOT_TAG_ID);
      tagLabels.push('Brand Launch Photoshoot Sale');
    }

    await fetch('https://api.ontraport.com/1/Contacts/tag', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({ ids: String(contactId), add_list: tagIds.join(',') }),
    });
    console.log(`[Checkout] Tags added: ${tagIds.join(', ')}`);

    // ── Step 4: Update contact with enrolment + full payment-plan details ───
    // Includes the course / location / timetable / start-date fields that were
    // intentionally NOT written pre-payment (Step 1). At this point we know the
    // charge has succeeded, so it's safe to mark the contact as enrolled and
    // record the recurring plan terms.
    const startDateUnix = startDate ? String(Math.floor(new Date(startDate).getTime() / 1000)) : '';
    const updateBody: Record<string, string> = {
      id: contactId,
      // Enrolment fields (deferred from pre-payment for defence-in-depth)
      f1834: courseOptionId,
      f2291: locationOptionId,
      f2292: timetableOptionId,
      f2293: startDateUnix,
      // f1428 includes any selected add-ons so the contact view shows the
      // full package the customer bought (e.g. "The Cert + Pre & Post Natal").
      f1428: packageNameWithAddOns,
      // Plan / qualification / accounting fields
      f2288: '586',
      f2289: termOptionId,
      f2290: qualificationsOptionId,
      // Totals reflect package + add-ons so Ontraport finance numbers match
      // what the customer actually paid for.
      f2294: String(totalCourseValue),
      f2296: paymentPlanText,
      f2456: isFullPayment ? '541' : '542',
      f2537: PAYMENT_METHOD_STRIPE,
      f1544: String(totalCourseValue),
      f1612: paymentPlanText,
    };

    if (!isFullPayment) {
      const now = new Date();
      const dayOfMonthNow = now.getDate();
      let instMonth = now.getMonth();
      let instYear = now.getFullYear();
      if (dayOfMonthNow >= 15) {
        instMonth += 1;
        if (instMonth > 11) { instMonth = 0; instYear += 1; }
      }
      let firstInstalment = new Date(instYear, instMonth, 30);
      if (firstInstalment.getMonth() !== instMonth) {
        firstInstalment = new Date(instYear, instMonth + 1, 0);
      }

      updateBody.f2604 = String(depositAmount);
      updateBody.f2605 = String(monthlyPayment);
      updateBody.f2606 = String(months);
      updateBody.f2607 = `${firstInstalment.getDate()} ${['January','February','March','April','May','June','July','August','September','October','November','December'][firstInstalment.getMonth()]} ${firstInstalment.getFullYear()}`;
    }

    // ── Bundle "ticks" on the Ontraport contact ────────────────────────
    // FBA Enrolled / FBA Start Date for The Career + The Business
    if (PACKAGES_WITH_FBA.has(packageId)) {
      updateBody.f2614 = 'true';
      updateBody.f2615 = FBA_DEFAULT_START_DATE_UNIX;
    }
    // Brand Launch Photoshoot / AI for Coaches / Programming for Success for The Business
    if (PACKAGES_WITH_BUSINESS_BUNDLE.has(packageId)) {
      updateBody.f2611 = 'true';
      updateBody.f2612 = 'true';
      updateBody.f2613 = 'true';
    }

    await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify(updateBody),
    });

    console.log(`[Checkout] ✅ Checkout complete! Invoice: ${invoiceId}, Contact: ${contactId}`);

    // ── Step 5: Fire Slack sales bot + sales@imageft.ie email ───────────
    // Fire-and-forget — don't block the checkout response
    const currentYear = String(new Date().getFullYear());
    // Fetch marketing attribution (f2168/f2169/f2170) so Slack shows the real
    // Campaign / Ad Set / Ad Name set on the contact by the tracking flow.
    const attribution = await fetchMarketingAttribution(contactId);

    notifySale({
      firstName,
      lastName,
      email,
      phone,
      packageName: packageNameWithAddOns,  // includes "+ AddOn Name" if any
      packagePrice,
      effectiveTotal: totalCourseValue,    // package + add-ons
      depositAmount,
      monthlyPayment,
      months,
      isFullPayment,
      location: LOCATION_TO_LABEL[location] || location,
      timetable: TIMETABLE_TO_LABEL[timetable] || timetable,
      startDate: startDate || 'TBC',
      term: termCode,
      year: currentYear,
      contactId: String(contactId),
      invoiceId,
      tags: tagLabels,
      addOns: selectedAddOnNames,
      addOnsTotal: serverAddOnsTotal,
      adSource1: attribution.campaign,
      adSource2: attribution.adSet,
      adSource3: attribution.adName,
    }).catch(err => console.error('[Checkout] Notification error:', err));

    return NextResponse.json({
      success: true,
      invoiceId,
      contactId,
    });
  } catch (error) {
    console.error('[Checkout] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
