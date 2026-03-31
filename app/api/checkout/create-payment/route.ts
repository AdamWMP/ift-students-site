import { NextRequest, NextResponse } from 'next/server';

// ─── Types ─────────────────────────────────────────────────────────────
interface CheckoutRequest {
  packageId: string;
  packageName: string;
  packagePrice: number;
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
  '8-week-intensive':     '505',
  '16-week-evening-sat':  '597',
  '16-week-saturday':     '504',
  'online-self-paced':    '544',
};

const PACKAGE_TO_ONTRAPORT_COURSE: Record<string, string> = {
  'pro-coach':             '97',
  'complete-coach':        '97',
  'fitness-business-coach':'97',
};

const PACKAGE_TO_ONTRAPORT_QUALIFICATIONS: Record<string, string> = {
  'pro-coach':             '497',
  'complete-coach':        '569',
  'fitness-business-coach':'627',
};

const TIMETABLE_TO_SKOOL_TAG: Record<string, string> = {
  '8-week-intensive':    '2337',
  '16-week-evening-sat': '2337',
  '16-week-saturday':    '2336',
};

const COMBO_COURSE_SALE_TAGS: Record<string, string> = {
  'S26': '2505',
};

const PAYMENT_METHOD_STRIPE = '577';

// ─── Ontraport Gateway ───────────────────────────────────────────────
// Gateway 6: Image Education Ltd 2025 (production Stripe gateway)
const ONTRAPORT_GATEWAY_ID = '6';

// Ontraport product ID
const DEPOSIT_PRODUCT_ID = '97';

// ─── Ontraport API helper ────────────────────────────────────────────
function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
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

    // Validate required fields
    if (!packageId || !firstName || !lastName || !email || !phone || !location || !timetable) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvc) {
      return NextResponse.json({ error: 'Card details are required' }, { status: 400 });
    }
    if (depositAmount < 500) {
      return NextResponse.json({ error: 'Minimum deposit is €500' }, { status: 400 });
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

    // ── Step 1: Create/update Ontraport contact (basic info only) ─────
    const contactBody: Record<string, string> = {
      firstname: firstName,
      lastname: lastName,
      email,
      sms_number: phone,
      f1834: courseOptionId,
      f2291: locationOptionId,
      f2292: timetableOptionId,
      f2293: startDate ? String(Math.floor(new Date(startDate).getTime() / 1000)) : '',
      f1428: packageName,
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
    const offerProducts = [];

    if (isFullPayment) {
      offerProducts.push({
        id: DEPOSIT_PRODUCT_ID,
        type: '',
        quantity: 1,
        total: String(packagePrice.toFixed(2)),
        price: [{
          price: String(packagePrice.toFixed(2)),
          payment_count: 1,
          unit: 'month',
        }],
      });
    } else {
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
      const trialDays = Math.max(1, Math.ceil((next30th.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      offerProducts.push({
        id: DEPOSIT_PRODUCT_ID,
        type: 'payment_plan',
        quantity: 1,
        total: String(packagePrice.toFixed(2)),
        price: [{
          price: String(monthlyPayment.toFixed(2)),
          payment_count: months,
          unit: 'month',
        }],
        trial: {
          price: String(depositAmount.toFixed(2)),
          payment_count: trialDays,
          unit: 'day',
        },
      });
    }

    const offer = {
      products: offerProducts,
      subTotal: String(depositAmount.toFixed(2)),
      grandTotal: String(depositAmount.toFixed(2)),
      hasTaxes: false,
      hasShipping: false,
      delay: 0,
      invoice_template: 2,
      send_recurring_invoice: true,
    };

    // Process payment — raw card details sent to Ontraport
    // Ontraport processes through their Stripe gateway (Gateway 6)
    // Card is saved in Ontraport's Credit Card Details automatically
    const transactionBody = {
      contact_id: Number(contactId),
      chargeNow: 'chargeNow',
      gateway_id: ONTRAPORT_GATEWAY_ID,
      offer: offer,
      payer: {
        ccnumber: cardNumber.replace(/\s/g, ''),
        code: cardCvc,
        expire_month: cardExpMonth,
        expire_year: cardExpYear,
      },
    };

    console.log(`[Checkout] Processing payment for ${email}: €${depositAmount} via Ontraport gateway ${ONTRAPORT_GATEWAY_ID}`);

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

    console.log('[Checkout] processManual response:', JSON.stringify(txnResult).slice(0, 500));

    // Check for payment failure — return error WITHOUT setting tags/plan
    const chargeResult = txnResult.chargeResult as Record<string, unknown> | undefined;
    if (chargeResult && chargeResult.result_code !== 1) {
      console.error('[Checkout] Payment charge failed:', chargeResult);
      return NextResponse.json(
        { error: (chargeResult.message as string) || 'Payment was declined. Please check your card details and try again.' },
        { status: 500 }
      );
    }
    if (txnResult.code !== undefined && txnResult.code !== 0) {
      console.error('[Checkout] Payment processing failed:', txnResult);
      const errorMsg = (txnResult.data as string) || (txnResult.message as string) || 'Payment processing failed';
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    // ════════════════════════════════════════════════════════════════════
    // ✅ PAYMENT SUCCESSFUL — now set tags, payment plan fields, etc.
    // ════════════════════════════════════════════════════════════════════

    console.log(`[Checkout] ✅ Payment successful for ${email}!`);

    // ── Step 3: Add tags (only after successful payment) ────────────────
    const tagIds: string[] = ['50']; // "Customers"
    const comboSaleTagId = COMBO_COURSE_SALE_TAGS[termCode];
    if (comboSaleTagId) tagIds.push(comboSaleTagId);
    const skoolTagId = TIMETABLE_TO_SKOOL_TAG[timetable];
    if (skoolTagId) tagIds.push(skoolTagId);

    await fetch('https://api.ontraport.com/1/Contacts/tag', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({ ids: String(contactId), add_list: tagIds.join(',') }),
    });
    console.log(`[Checkout] Tags added: ${tagIds.join(', ')}`);

    // ── Step 4: Update contact with full payment plan details ───────────
    const updateBody: Record<string, string> = {
      id: contactId,
      f2288: '586',
      f2289: termOptionId,
      f2290: qualificationsOptionId,
      f2294: String(packagePrice),
      f2296: paymentPlanText,
      f2456: isFullPayment ? '541' : '542',
      f2537: PAYMENT_METHOD_STRIPE,
      f1544: String(packagePrice),
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

    await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify(updateBody),
    });

    const txnData = (txnResult.data || {}) as Record<string, unknown>;
    const invoiceId = txnData.invoice_id || txnData.id || txnResult.invoice_id;
    console.log(`[Checkout] ✅ Checkout complete! Invoice: ${invoiceId}, Contact: ${contactId}`);

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
