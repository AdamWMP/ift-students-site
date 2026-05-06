import { NextRequest, NextResponse } from 'next/server';
import { notifySale } from '@/lib/pilates-sale-notifications';
import { sendCapiEvent, newEventId } from '@/lib/meta/capi';
import { addOns as ALL_PILATES_ADDONS } from '@/lib/pilates-course-data';

const parseCookie = (header: string | null, name: string): string | undefined => {
  if (!header) return undefined;
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

// ─── Types ─────────────────────────────────────────────────────────────
interface CheckoutRequest {
  packageId: string;
  packageName: string;
  packagePrice: number;
  addOns?: string[];
  addOnsTotal?: number;
  totalPrice?: number;
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
  reformerLocation: string;
  reformerTimetable: string;
  reformerStartDate: string;
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
  coupon?: {
    id: string;
    code: string;
    discountType: 'flat' | 'percent';
    discountValue: number;
    originalPrice: number;
    discount: number;
  } | null;
}

// ─── Ontraport Dropdown Mappings (PILATES) ────────────────────────────
// f2303: Pilates Course Location (mat courses)
// f2303: Pilates Course Location (mat courses)
const LOCATION_TO_ONTRAPORT: Record<string, string> = {
  'dublin-swords':   '516',
  'dublin-tallaght': '515',
  'cork':            '514',
  'galway':          '513',
  'online':          '634',
};

// f2593: Reformer Course Location (reformer-specific field)
// Options: 622=Swords, 621=Tallaght, 620=Cork
// TODO: Add "Co. Kerry", "Co. Derry", "Co. Clare" in Ontraport admin (Administration → Custom Objects → Contacts → f2593)
// then paste the returned option IDs below
const REFORMER_LOCATION_TO_ONTRAPORT: Record<string, string> = {
  'dublin-swords':   '622',
  'dublin-tallaght': '621',
  'cork':            '620',
  'kerry':           '632',  // Kerry
  'derry':           '631',  // Derry
  'clare':           '630',  // Clare
};

// f2304: Pilates Course Timetable (mat)
const TIMETABLE_TO_ONTRAPORT: Record<string, string> = {
  'every-second-saturday': '517',
  '3-weekend-intensive':   '601',
  'online-evenings':       '598',
};

// f2594: Reformer Course Timetable
const REFORMER_TIMETABLE_TO_ONTRAPORT: Record<string, string> = {
  'reformer-3-weekend': '623',  // Bi Weekly Sat & Sun
};

// Human-readable labels for the Slack notification (mirror Ontraport dropdowns)
const TIMETABLE_TO_LABEL: Record<string, string> = {
  'every-second-saturday': 'Every Second Saturday',
  '3-weekend-intensive':   '3 Weekend Intensive',
  'online-evenings':       'Online Evenings',
};

const REFORMER_TIMETABLE_TO_LABEL: Record<string, string> = {
  'reformer-3-weekend': 'Bi-Weekly Saturday & Sunday',
};

const LOCATION_TO_LABEL: Record<string, string> = {
  'dublin-swords':   'Dublin (Swords)',
  'dublin-tallaght': 'Dublin (Tallaght)',
  'cork':            'Cork',
  'galway':          'Galway',
  'online':          'Online',
};

const REFORMER_LOCATION_TO_LABEL: Record<string, string> = {
  'dublin-swords':   'Dublin (Swords)',
  'dublin-tallaght': 'Dublin (Tallaght)',
  'cork':            'Cork',
  'kerry':           'Co. Kerry',
  'derry':           'Co. Derry',
  'clare':           'Co. Clare',
};

// f1834: "New IFT Choose your course" dropdown option IDs
const PACKAGE_TO_ONTRAPORT_COURSE: Record<string, string> = {
  'pilates-cert':    '452',  // Pilates Course (EQF Level 4)
  'pilates-career':  '452',  // Pilates Course (EQF Level 4)
  'pilates-studio':  '452',  // Pilates Course (EQF Level 4)
  'reformer-only':   '',     // TODO: add "Reformer Pilates Course" option to f1834 in Ontraport admin → paste ID here
};

// f2302: Pilates Course Qualifications
const PACKAGE_TO_ONTRAPORT_QUALIFICATIONS: Record<string, string> = {
  'pilates-cert':    '512',  // Pilates Instructor EQF Level 4
  'pilates-career':  '624',  // Complete Pilates Coach Course (Mat + Reformer)
  'pilates-studio':  '624',  // Complete Pilates Coach Course (Mat + Reformer)
  'reformer-only':   '599',  // Reformer Pilates Instructor Course
};

// Pilates Course Sale tags by term
const PILATES_SALE_TAGS: Record<string, string> = {
  'S26': '2521',  // S26 Pilates Course Sale
  'A26': '',      // TODO: create A26 Pilates Course Sale tag
};

// Reformer Pilates Course Sale tags by term (added for Career/Studio packages)
const REFORMER_SALE_TAGS: Record<string, string> = {
  'S26': '2516',  // S26 Reformer Pilates Course Sale
  'A26': '2525',  // A26 Reformer Pilates Course Sale
};

// Reformer Skool Enrolment tag — always added for any reformer package
const REFORMER_SKOOL_TAG = '2524'; // Reformer Pilates Skool Enrolment

// Pilates Course -> Add to Skool Course — added for ALL mat-inclusive packages (not reformer-only)
const PILATES_SKOOL_COURSE_TAG = '2327'; // Pilates Course -> Add to Skool Course

// Packages that include reformer qualification
const REFORMER_PACKAGES = new Set(['pilates-career', 'pilates-studio']);

const PAYMENT_METHOD_STRIPE = '577';

// ─── Ontraport Gateway ───────────────────────────────────────────────
// Gateway 6: Live Stripe — Image Education Ltd 2025
const ONTRAPORT_GATEWAY_ID = '6';

// Ontraport product IDs — Pilates specific (NOT PT products)
const PRODUCT_ID_PILATES  = '107'; // Pilates Course
const PRODUCT_ID_REFORMER = '116'; // Reformer Pilates Course

// Base prices used to split Career/Studio between mat + reformer products
const CERT_BASE_PRICE     = 1800;
const REFORMER_BASE_PRICE = 700;

// Invoice receipt template — set to "IFT Global Receipt" template ID
const INVOICE_TEMPLATE_ID = 5; // IFT Global Receipt

// ─── Stripe Test Cards (bypass Ontraport gateway for testing) ────────
const STRIPE_TEST_CARDS = new Set([
  '4242424242424242',  // Visa — succeeds
  '4000056655665556',  // Visa (debit) — succeeds
  '5555555555554444',  // Mastercard — succeeds
  '5200828282828210',  // Mastercard (debit) — succeeds
  '378282246310005',   // Amex — succeeds
  '6011111111111117',  // Discover — succeeds
  '4000000000000002',  // Visa — decline
  '4000000000009995',  // Visa — insufficient funds
  '4000000000009987',  // Visa — lost card
  '4000000000000069',  // Visa — expired card
  '4000000000000127',  // Visa — incorrect CVC
]);

// ─── Ontraport API helper ────────────────────────────────────────────
function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

// ─── Fetch marketing attribution fields from the contact ────────────
// f2168 = Marketing Campaign Name, f2169 = Ad Set, f2170 = Ad Name.
// Set earlier by the tracking flow (UTM → Ontraport) and read back
// post-charge so the Slack ding shows real ad data.
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

// ─── Send receipt email for a successful invoice ─────────────────────
// Ontraport's processManual does NOT automatically email the initial receipt.
// This explicitly triggers the IFT Global Receipt template for the invoice.
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

// ─── Void a failed invoice to keep Ontraport clean ───────────────────
async function voidInvoice(invoiceId: string | number) {
  try {
    await fetch('https://api.ontraport.com/1/transaction/void', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({ id: String(invoiceId) }),
    });
    console.log(`[Checkout] Voided declined invoice ${invoiceId}`);
  } catch (e) {
    console.error(`[Checkout] Failed to void invoice ${invoiceId}:`, e);
  }
}

// ─── Main Checkout Handler ───────────────────────────────────────────
// Flow:
//   1. Create/update Ontraport contact (basic info ONLY — no payment fields yet)
//   2. Process payment via Ontraport processManual with card details
//      → Ontraport charges via their Stripe gateway
//      → Card saved in Ontraport Credit Card Details
//   3. Check charge result:
//      → DECLINED: Void the invoice, return error, NO tags/fields set
//      → SUCCESS: Add tags, set all payment plan fields, course details
// ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    const {
      packageId,
      packageName,
      packagePrice,
      addOns: selectedAddOns,
      addOnsTotal = 0,
      totalPrice,
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
      reformerLocation,
      reformerTimetable,
      reformerStartDate,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      coupon,
    } = body;

    // Calculate effective total
    // NOTE: totalPrice from the frontend is already post-discount (combinedPrice - discount).
    // Subtracting discount again would double-apply it. Use totalPrice directly when provided.
    const discount = coupon?.discount || 0;
    const effectiveTotal = totalPrice !== undefined && totalPrice > 0
      ? totalPrice
      : (packagePrice + addOnsTotal) - discount;
    const effectiveDeposit = Math.min(depositAmount, effectiveTotal);

    // Validate required fields
    const isReformerOnlyValidation = packageId === 'reformer-only';
    if (!packageId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isReformerOnlyValidation && (!location || !timetable)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (isReformerOnlyValidation && (!reformerLocation || !reformerTimetable)) {
      return NextResponse.json({ error: 'Missing required reformer fields' }, { status: 400 });
    }
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvc) {
      return NextResponse.json({ error: 'Card details are required' }, { status: 400 });
    }
    if (effectiveDeposit < 1) {
      return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
    }

    const ONTRAPORT_API_KEY = process.env.ONTRAPORT_API_KEY;
    const ONTRAPORT_APP_ID = process.env.ONTRAPORT_APP_ID;

    if (!ONTRAPORT_API_KEY || !ONTRAPORT_APP_ID) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const isFullPayment = effectiveDeposit >= effectiveTotal;

    // Determine current term — Spring (Feb-Jul) or Autumn (Aug-Jan)
    // Same S/A logic as PT checkout
    const currentMonth = new Date().getMonth() + 1;
    const yearShort = String(new Date().getFullYear()).slice(-2);
    const termPrefix = (currentMonth >= 2 && currentMonth <= 7) ? 'S' : 'A';
    const termCode = `${termPrefix}${yearShort}`;
    // Pilates f2301: 511 = Spring, 509 = Autumn
    const termOptionId = (currentMonth >= 2 && currentMonth <= 7) ? '511' : '509';

    // Map frontend values to Ontraport option IDs
    const locationOptionId          = LOCATION_TO_ONTRAPORT[location] || '';
    const reformerLocationOptionId  = REFORMER_LOCATION_TO_ONTRAPORT[reformerLocation] || '';
    const timetableOptionId         = TIMETABLE_TO_ONTRAPORT[timetable] || '';
    const reformerTimetableOptionId = REFORMER_TIMETABLE_TO_ONTRAPORT[reformerTimetable] || '';
    const courseOptionId            = PACKAGE_TO_ONTRAPORT_COURSE[packageId] || '';
    const qualificationsOptionId    = PACKAGE_TO_ONTRAPORT_QUALIFICATIONS[packageId] || '';

    // Reformer term: 618 = Spring (Feb-Jul), 617 = Autumn (Aug-Jan)
    const reformerTermOptionId = (currentMonth >= 2 && currentMonth <= 7) ? '618' : '617';

    const paymentPlanText = isFullPayment
      ? `Paid in Full — €${effectiveTotal}`
      : `€${effectiveDeposit} deposit + €${monthlyPayment.toFixed(2)}/mo x ${months} months (billed 30th)`;

    // ── Step 1: Create/update Ontraport contact (MINIMAL info only) ─────
    // Only set name, email, phone — NO payment fields yet
    // Payment fields are set ONLY after successful charge (Step 3)
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

    // ── Step 2: Build offer & process payment via Ontraport ───────────
    //
    // Product ID mapping (Pilates — NOT PT):
    //   pilates-cert                → 107 (Pilates Course) only
    //   pilates-career/studio       → 107 (Pilates Course) + 116 (Reformer) split
    //   reformer-only               → 116 (Reformer Pilates Course) only
    //
    // Career/Studio split: mat (107) = CERT_BASE_PRICE, reformer (116) = remainder
    // Proportional to handle discounts: keep the same ratio as base prices.

    const includesReformer = REFORMER_PACKAGES.has(packageId);
    const isReformerOnly   = packageId === 'reformer-only';

    // Calculate per-product totals for career/studio (split proportionally)
    const certTotal     = includesReformer && !isReformerOnly
      ? parseFloat((effectiveTotal * (CERT_BASE_PRICE / (CERT_BASE_PRICE + REFORMER_BASE_PRICE))).toFixed(2))
      : 0;
    const reformerTotal = includesReformer && !isReformerOnly
      ? parseFloat((effectiveTotal - certTotal).toFixed(2))
      : 0;

    const offerProducts = [];

    if (isFullPayment) {
      // Full payment — single or dual charge based on package
      if (isReformerOnly) {
        // Reformer only — product 116 full price
        offerProducts.push({
          id: PRODUCT_ID_REFORMER,
          type: '',
          quantity: 1,
          total: String(effectiveTotal.toFixed(2)),
          price: [{ price: String(effectiveTotal.toFixed(2)), payment_count: 1, unit: 'month' }],
        });
      } else if (includesReformer) {
        // Career/Studio — product 107 (cert) + product 116 (reformer)
        offerProducts.push({
          id: PRODUCT_ID_PILATES,
          type: '',
          quantity: 1,
          total: String(certTotal.toFixed(2)),
          price: [{ price: String(certTotal.toFixed(2)), payment_count: 1, unit: 'month' }],
        });
        offerProducts.push({
          id: PRODUCT_ID_REFORMER,
          type: '',
          quantity: 1,
          total: String(reformerTotal.toFixed(2)),
          price: [{ price: String(reformerTotal.toFixed(2)), payment_count: 1, unit: 'month' }],
        });
      } else {
        // Cert only — product 107 full price
        offerProducts.push({
          id: PRODUCT_ID_PILATES,
          type: '',
          quantity: 1,
          total: String(effectiveTotal.toFixed(2)),
          price: [{ price: String(effectiveTotal.toFixed(2)), payment_count: 1, unit: 'month' }],
        });
      }
    } else {
      // Payment plan — DEPOSIT-ONLY products. The recurring plan is created
      // in a separate processManual call AFTER the deposit succeeds (Step 2B
      // below). This prevents Ontraport from leaving phantom subscriptions
      // when the deposit charge fails.
      const buildDepositProduct = (productId: string, depositShare: number) => ({
        id: productId,
        type: '',  // one-time line item
        quantity: 1,
        total: String(depositShare.toFixed(2)),
        price: [{
          price: String(depositShare.toFixed(2)),
          payment_count: 1,
          unit: 'month',
        }],
      });

      if (isReformerOnly) {
        offerProducts.push(buildDepositProduct(PRODUCT_ID_REFORMER, effectiveDeposit));
      } else if (includesReformer) {
        const ratio = CERT_BASE_PRICE / (CERT_BASE_PRICE + REFORMER_BASE_PRICE);
        const certDeposit     = parseFloat((effectiveDeposit * ratio).toFixed(2));
        const reformerDeposit = parseFloat((effectiveDeposit - certDeposit).toFixed(2));
        offerProducts.push(buildDepositProduct(PRODUCT_ID_PILATES,  certDeposit));
        offerProducts.push(buildDepositProduct(PRODUCT_ID_REFORMER, reformerDeposit));
      } else {
        offerProducts.push(buildDepositProduct(PRODUCT_ID_PILATES, effectiveDeposit));
      }
    }

    const offer: Record<string, unknown> = {
      products: offerProducts,
      subTotal: String(effectiveDeposit.toFixed(2)),
      grandTotal: String(effectiveDeposit.toFixed(2)),
      hasTaxes: false,
      hasShipping: false,
      delay: 0,
      send_recurring_invoice: true,   // always send receipt — full payments and plans
    };

    // Add invoice template if configured
    if (INVOICE_TEMPLATE_ID > 0) {
      offer.invoice_template = INVOICE_TEMPLATE_ID;
    }

    // ── Process payment via Ontraport gateway (dummy for testing) ──────
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    let invoiceId: string | number | undefined;

    {
      const transactionBody = {
        contact_id: Number(contactId),
        chargeNow: 'chargeNow',
        gateway_id: ONTRAPORT_GATEWAY_ID,
        offer: offer,
        payer: {
          ccnumber: cleanCardNumber,
          code: cardCvc,
          expire_month: cardExpMonth,
          expire_year: cardExpYear,
        },
      };

      console.log(`[Checkout] Processing LIVE payment for ${email}: €${effectiveDeposit} via Ontraport gateway ${ONTRAPORT_GATEWAY_ID}`);

      const txnRes = await fetch('https://api.ontraport.com/1/transaction/processManual', {
        method: 'POST',
        headers: ontraportHeaders(),
        body: JSON.stringify(transactionBody),
      });

      const txnText = await txnRes.text();
      let txnResult: Record<string, unknown>;
      try {
        txnResult = JSON.parse(txnText);
      } catch {
        console.error('[Checkout] processManual returned non-JSON:', txnText);
        return NextResponse.json(
          { error: 'Payment processing failed. Please try again.' },
          { status: 500 }
        );
      }

      console.log('[Checkout] processManual response:', JSON.stringify(txnResult).slice(0, 800));

      // ── Check for payment failure ─────────────────────────────────────
      const txnData = (txnResult.data || {}) as Record<string, unknown>;
      invoiceId = txnData.invoice_id || txnData.id || txnResult.invoice_id;

      const chargeResult = (txnResult.chargeResult || txnData.chargeResult) as Record<string, unknown> | undefined;
      const isDeclined = (
        (chargeResult && chargeResult.result_code !== 1) ||
        (txnData.status === '5') ||
        (txnData.status === '4') ||
        (txnResult.code !== undefined && txnResult.code !== 0 && !chargeResult)
      );

      if (isDeclined) {
        const errorMessage = (chargeResult?.message as string) ||
          (txnData.message as string) ||
          (txnResult.data as string) ||
          'Payment was declined. Please check your card details and try again.';

        console.error(`[Checkout] Payment DECLINED for ${email}: ${errorMessage}`);

        if (invoiceId) {
          await voidInvoice(invoiceId);
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: 402 }
        );
      }
    }

    // ════════════════════════════════════════════════════════════════════
    // ✅ DEPOSIT CHARGED — schedule the recurring plan (separate call)
    // ════════════════════════════════════════════════════════════════════

    console.log(`[Checkout] ✅ Deposit charged for ${email}! Invoice: ${invoiceId}`);

    // ── Step 2B: Schedule recurring plan ONLY after deposit success ─────
    // This is a deliberately-separate processManual call so a declined
    // deposit can never leave a phantom subscription behind. If this call
    // errors we DON'T roll back the deposit (the customer paid) — we log
    // loudly and continue tagging so support can finish the plan setup
    // manually in Ontraport.
    if (!isFullPayment) {
      const planNow = new Date();
      const planDay = planNow.getDate();
      let planMonth = planNow.getMonth();
      let planYear = planNow.getFullYear();
      if (planDay >= 15) {
        planMonth += 1;
        if (planMonth > 11) { planMonth = 0; planYear += 1; }
      }
      let planNext30th = new Date(planYear, planMonth, 30);
      if (planNext30th.getMonth() !== planMonth) {
        planNext30th = new Date(planYear, planMonth + 1, 0);
      }
      const daysUntilFirstCharge = Math.max(1, Math.ceil((planNext30th.getTime() - planNow.getTime()) / (1000 * 60 * 60 * 24)));

      const buildRecurringProduct = (productId: string, productTotal: number, monthlyShare: number) => ({
        id: productId,
        type: 'payment_plan',
        quantity: 1,
        total: String((monthlyShare * months).toFixed(2)),
        price: [{
          price: String(monthlyShare.toFixed(2)),
          payment_count: months,
          unit: 'month',
        }],
      });

      const planProducts: Record<string, unknown>[] = [];
      if (isReformerOnly) {
        planProducts.push(buildRecurringProduct(PRODUCT_ID_REFORMER, effectiveTotal, monthlyPayment));
      } else if (includesReformer) {
        const ratio = CERT_BASE_PRICE / (CERT_BASE_PRICE + REFORMER_BASE_PRICE);
        const certMonthly     = parseFloat((monthlyPayment * ratio).toFixed(2));
        const reformerMonthly = parseFloat((monthlyPayment - certMonthly).toFixed(2));
        planProducts.push(buildRecurringProduct(PRODUCT_ID_PILATES,  certTotal,     certMonthly));
        planProducts.push(buildRecurringProduct(PRODUCT_ID_REFORMER, reformerTotal, reformerMonthly));
      } else {
        planProducts.push(buildRecurringProduct(PRODUCT_ID_PILATES, effectiveTotal, monthlyPayment));
      }

      const planOffer: Record<string, unknown> = {
        products: planProducts,
        subTotal: '0.00',
        grandTotal: '0.00',
        hasTaxes: false,
        hasShipping: false,
        delay: daysUntilFirstCharge,  // schedule first charge for next 30th
        send_recurring_invoice: true,
      };
      if (INVOICE_TEMPLATE_ID > 0) {
        planOffer.invoice_template = INVOICE_TEMPLATE_ID;
      }

      const planTxnBody = {
        contact_id: Number(contactId),
        chargeNow: 'chargeLater',  // do NOT charge now — schedule per delay
        gateway_id: ONTRAPORT_GATEWAY_ID,
        offer: planOffer,
        payer: {
          ccnumber: cleanCardNumber,
          code: cardCvc,
          expire_month: cardExpMonth,
          expire_year: cardExpYear,
        },
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
        console.log('[Checkout] plan processManual response:', JSON.stringify(planResult).slice(0, 600));
        if (planResult.code !== undefined && planResult.code !== 0) {
          console.error(`[Checkout] ⚠️ Recurring plan creation FAILED for ${email} after deposit charged. Manual setup needed in Ontraport. Response:`, planResult);
        }
      } catch (e) {
        console.error(`[Checkout] ⚠️ Recurring plan request errored for ${email} after deposit charged:`, e);
      }
    }

    // ── Step 2b: Send IFT Global Receipt to customer ────────────────────
    if (invoiceId) {
      await sendInvoiceReceipt(invoiceId);
    }

    // ── Step 3: Add tags (only after successful payment) ────────────────
    const tagIds: string[] = ['50']; // "Customers"
    const tagLabels: string[] = ['Customers'];

    // Pilates Course Sale tag + Skool Course tag — NOT added for reformer-only bookings
    if (!isReformerOnly) {
      const pilatesSaleTagId = PILATES_SALE_TAGS[termCode];
      if (pilatesSaleTagId) { tagIds.push(pilatesSaleTagId); tagLabels.push(`${termCode} Pilates Course Sale`); }
      // Always add "Pilates Course -> Add to Skool Course" for mat-inclusive packages
      tagIds.push(PILATES_SKOOL_COURSE_TAG);
      tagLabels.push('Pilates Course -> Add to Skool Course');
    }

    // Reformer Course Sale tag + Skool Enrolment — Career, Studio, AND standalone Reformer-Only
    if (REFORMER_PACKAGES.has(packageId) || isReformerOnly) {
      const reformerTagId = REFORMER_SALE_TAGS[termCode];
      if (reformerTagId) { tagIds.push(reformerTagId); tagLabels.push(`${termCode} Reformer Pilates Course Sale`); }
      tagIds.push(REFORMER_SKOOL_TAG);
      tagLabels.push('Reformer Pilates Skool Enrolment');
    }

    await fetch('https://api.ontraport.com/1/Contacts/tag', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({ ids: String(contactId), add_list: tagIds.join(',') }),
    });
    console.log(`[Checkout] Tags added: ${tagIds.join(', ')}`);

    // ── Step 4: Update contact with ALL course + payment details ─────────
    // PILATES FIELDS — f2300-f2309 series for mat, f2590-f2599 for reformer
    // Resolve add-on IDs → records → names (server-side source of truth) so
    // the Ontraport contact + Slack ding both reflect what was actually
    // bought. Frontend sends just IDs.
    const selectedAddOnRecords = ALL_PILATES_ADDONS.filter((a) =>
      (selectedAddOns || []).includes(a.id),
    );
    const selectedAddOnNames = selectedAddOnRecords.map((a) => a.name);
    const packageNameWithAddOns = selectedAddOnNames.length
      ? `${packageName} + ${selectedAddOnNames.join(' + ')}`
      : packageName;

    const updateBody: Record<string, string> = {
      id: contactId,
      f1834: courseOptionId,                  // Shared course type dropdown
      f1428: packageNameWithAddOns,           // Package label (with add-ons appended)
      f2537: PAYMENT_METHOD_STRIPE,           // Payment method: Stripe
      f1544: String(effectiveTotal),          // Total course cost (already includes addOnsTotal)
    };

    if (!isReformerOnly) {
      // Mat Pilates fields (pilates-cert, pilates-career, pilates-studio)
      updateBody.f2300 = '587';                                                                          // Pilates Course Year: 2026
      updateBody.f2301 = termOptionId;                                                                   // Pilates Course Term
      updateBody.f2302 = qualificationsOptionId;                                                         // Pilates Course Qualifications
      updateBody.f2303 = locationOptionId;                                                               // Pilates Course Location
      updateBody.f2304 = timetableOptionId;                                                              // Pilates Course Timetable
      updateBody.f2305 = startDate ? String(Math.floor(new Date(startDate).getTime() / 1000)) : '';     // Pilates Course Start Date
      updateBody.f2306 = String(effectiveTotal);                                                         // Pilates Course Price
      updateBody.f2309 = paymentPlanText;                                                                // Pilates Course Payment Plan
    }

    if (isReformerOnly || REFORMER_PACKAGES.has(packageId)) {
      // Dedicated Reformer fields (f2590-f2599)
      const reformerPrice = isReformerOnly ? effectiveTotal : reformerTotal;
      updateBody.f2590 = '616';                                                                                                    // Reformer Course Year: 2026
      updateBody.f2591 = reformerTermOptionId;                                                                                     // Reformer Course Term
      updateBody.f2592 = '619';                                                                                                    // Reformer Course Qualification (CPD)
      updateBody.f2593 = reformerLocationOptionId;                                                                                 // Reformer Course Location
      updateBody.f2594 = reformerTimetableOptionId;                                                                                // Reformer Course Timetable
      updateBody.f2595 = reformerStartDate ? String(Math.floor(new Date(reformerStartDate).getTime() / 1000)) : '';               // Reformer Course Start Date
      updateBody.f2596 = String(reformerPrice);                                                                                    // Reformer Course Price
      updateBody.f2598 = paymentPlanText;                                                                                          // Reformer Payment Plan
      updateBody.f2599 = String(reformerPrice);                                                                                    // Reformer Course Spent
    }

    // Payment plan specific fields
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

      updateBody.f2604 = String(effectiveDeposit);                  // Deposit amount
      updateBody.f2605 = String(monthlyPayment.toFixed(2));         // Monthly payment amount
      updateBody.f2606 = String(months);                            // Payment months remaining
      updateBody.f2607 = String(Math.floor(firstInstalment.getTime() / 1000)); // First instalment date
    }

    await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify(updateBody),
    });

    console.log(`[Checkout] ✅ All contact fields updated for ${contactId}`);

    // ── Step 5: Send sale notifications (Slack + Email) ─────────────────
    // Fire-and-forget — don't block the checkout response
    const currentYear = String(new Date().getFullYear());
    // Resolve English labels so the Slack ding reads like Ontraport dropdowns
    const notifyLocation  = isReformerOnly
      ? (REFORMER_LOCATION_TO_LABEL[reformerLocation] || reformerLocation || 'Reformer')
      : (LOCATION_TO_LABEL[location] || location);
    const notifyTimetable = isReformerOnly
      ? (REFORMER_TIMETABLE_TO_LABEL[reformerTimetable] || reformerTimetable || 'Bi-Weekly Saturday & Sunday')
      : (TIMETABLE_TO_LABEL[timetable] || timetable);
    const notifyStartDate = isReformerOnly ? (reformerStartDate || 'TBC') : (startDate || 'TBC');

    // Fetch marketing attribution (f2168/f2169/f2170) set by the tracking flow
    const attribution = await fetchMarketingAttribution(contactId);

    await notifySale({
      firstName,
      lastName,
      email,
      phone,
      packageName: packageNameWithAddOns,
      packagePrice,
      effectiveTotal,
      depositAmount: effectiveDeposit,
      monthlyPayment,
      months,
      isFullPayment,
      location:  notifyLocation,
      timetable: notifyTimetable,
      startDate: notifyStartDate,
      term: termCode,
      year: currentYear,
      addOns: selectedAddOnNames,   // resolved names, not IDs
      addOnsTotal,
      couponCode: coupon?.code,
      discount: coupon?.discount,
      contactId,
      invoiceId,
      tags: tagLabels,
      adSource1: attribution.campaign,
      adSource2: attribution.adSet,
      adSource3: attribution.adName,
    }).catch(err => console.error('[Checkout] Notification error:', err));

    console.log(`[Checkout] ✅ Checkout complete! Invoice: ${invoiceId}, Contact: ${contactId}`);

    // Meta CAPI: fire server-side Purchase event
    const metaEventId = newEventId();
    const cookieHeader = request.headers.get('cookie');
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip');
    sendCapiEvent({
      eventName: 'Purchase',
      eventId: metaEventId,
      actionSource: 'website',
      eventSourceUrl: request.headers.get('referer') ?? undefined,
      userData: {
        email,
        phone,
        firstName,
        lastName,
        externalId: String(contactId),
        fbp: parseCookie(cookieHeader, '_fbp') ?? null,
        fbc: parseCookie(cookieHeader, '_fbc') ?? null,
        clientIp: clientIp ?? null,
        userAgent: request.headers.get('user-agent') ?? null,
      },
      customData: {
        currency: 'EUR',
        value: effectiveDeposit,
        content_ids: [packageId],
        content_name: packageName,
        content_category: 'pilates-course',
        content_type: 'product',
      },
    }).catch(err => console.error('[Meta CAPI] Purchase error:', err));

    return NextResponse.json({
      success: true,
      invoiceId,
      contactId,
      metaEventId,
    });
  } catch (error) {
    console.error('[Checkout] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
