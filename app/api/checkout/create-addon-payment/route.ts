import { NextRequest, NextResponse } from 'next/server';
import {
  ADDON_COURSES,
  ONTRAPORT_LOCATION_IDS,
  ONTRAPORT_TERM_IDS,
  ONTRAPORT_ENROLLED_ID,
  getCurrentTermId,
} from '@/lib/addon-course-config';

const PAYMENT_METHOD_STRIPE = '577';
const CUSTOMERS_TAG_ID = '50';
const ONTRAPORT_GATEWAY_ID = '6';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      courseId,
      // Intake / location (from shared config)
      location,
      startDate,
      term,
      // Payment
      depositAmount,
      months,
      monthlyPayment,
      discountedPrice,
      couponCode,
      couponId,
      // Contact
      firstName,
      lastName,
      email,
      phone,
      // Card
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
    } = body;

    const course = ADDON_COURSES[courseId as keyof typeof ADDON_COURSES];
    if (!course) {
      return NextResponse.json({ error: 'Invalid course selected' }, { status: 400 });
    }
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvc) {
      return NextResponse.json({ error: 'Card details are required' }, { status: 400 });
    }
    if (depositAmount < course.minDeposit) {
      return NextResponse.json({ error: `Minimum deposit is €${course.minDeposit}` }, { status: 400 });
    }

    const ONTRAPORT_API_KEY = process.env.ONTRAPORT_API_KEY;
    const ONTRAPORT_APP_ID = process.env.ONTRAPORT_APP_ID;
    if (!ONTRAPORT_API_KEY || !ONTRAPORT_APP_ID) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    // ── Resolve effective price (after any coupon discount) ───────────
    const effectivePrice: number =
      typeof discountedPrice === 'number' && discountedPrice > 0 && discountedPrice <= course.price
        ? discountedPrice
        : course.price;

    const isFullPayment = depositAmount >= effectivePrice;

    const paymentPlanText = isFullPayment
      ? `Paid in Full — €${effectivePrice}${couponCode ? ` (coupon: ${couponCode})` : ''}`
      : `€${depositAmount} deposit + €${monthlyPayment.toFixed(2)}/mo x ${months} months (billed 30th)${couponCode ? ` (coupon: ${couponCode})` : ''}`;

    // ── Resolve Ontraport field values ────────────────────────────────
    const locationOptionId = ONTRAPORT_LOCATION_IDS[location] || ONTRAPORT_LOCATION_IDS.online;

    // Term: use what the client sent, or derive from current month
    const termOptionId =
      term && ONTRAPORT_TERM_IDS[term as keyof typeof ONTRAPORT_TERM_IDS]
        ? ONTRAPORT_TERM_IDS[term as keyof typeof ONTRAPORT_TERM_IDS]
        : getCurrentTermId();

    // Start date as Unix timestamp for Ontraport (f2293)
    const startDateUnix = startDate
      ? String(Math.floor(new Date(startDate + 'T00:00:00').getTime() / 1000))
      : String(Math.floor(Date.now() / 1000));

    // ── Step 1: Create/update Ontraport contact ───────────────────────
    const contactBody: Record<string, string> = {
      firstname: firstName,
      lastname: lastName,
      email,
      sms_number: phone,
      f1834: course.courseOptionId,   // Course dropdown
      f1428: course.fullName,         // Package/course name
      f2291: locationOptionId,        // Location
      f2293: startDateUnix,           // Course start date
    };

    const contactRes = await fetch('https://api.ontraport.com/1/Contacts/saveorupdate', {
      method: 'POST',
      headers: ontraportHeaders(),
      body: JSON.stringify(contactBody),
    });

    let contactResult: Record<string, unknown>;
    try {
      contactResult = await contactRes.json();
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
      const retryRes = await fetch('https://api.ontraport.com/1/Contacts/saveorupdate', {
        method: 'POST',
        headers: ontraportHeaders(),
        body: JSON.stringify(contactBody),
      });
      contactResult = await retryRes.json();
    }

    if (contactResult.code !== 0) {
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }

    const contactData = contactResult.data as any;
    const contactId = contactData?.attrs?.id || contactData?.id || contactData?.[0]?.id;
    if (!contactId) {
      return NextResponse.json({ error: 'Failed to get contact ID' }, { status: 500 });
    }

    console.log(`[AddonCheckout] Contact synced: ${email} → ID ${contactId}`);

    // ── Step 2: Build offer & process payment ─────────────────────────
    const offerProducts = [];

    if (isFullPayment) {
      offerProducts.push({
        id: course.productId,
        type: '',
        quantity: 1,
        total: String(effectivePrice.toFixed(2)),
        price: [{
          price: String(effectivePrice.toFixed(2)),
          payment_count: 1,
          unit: 'month',
        }],
        ...(couponId ? { coupon_id: String(couponId) } : {}),
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
        id: course.productId,
        type: 'payment_plan',
        quantity: 1,
        total: String(effectivePrice.toFixed(2)),
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
        ...(couponId ? { coupon_id: String(couponId) } : {}),
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

    const transactionBody = {
      contact_id: Number(contactId),
      chargeNow: 'chargeNow',
      gateway_id: ONTRAPORT_GATEWAY_ID,
      offer,
      payer: {
        ccnumber: cardNumber.replace(/\s/g, ''),
        code: cardCvc,
        expire_month: cardExpMonth,
        expire_year: cardExpYear,
      },
    };

    console.log(`[AddonCheckout] Processing €${depositAmount} for ${email} — ${course.name}`);

    const txnRes = await fetch('https://api.ontraport.com/1/transaction/processManual', {
      method: 'POST',
      headers: ontraportHeaders(),
      body: JSON.stringify(transactionBody),
    });

    let txnResult: Record<string, unknown>;
    try {
      txnResult = await txnRes.json();
    } catch {
      return NextResponse.json({ error: 'Payment processing failed. Please try again.' }, { status: 500 });
    }

    console.log('[AddonCheckout] processManual response:', JSON.stringify(txnResult).slice(0, 300));

    const chargeResult = txnResult.chargeResult as Record<string, unknown> | undefined;
    if (chargeResult && chargeResult.result_code !== 1) {
      return NextResponse.json(
        { error: (chargeResult.message as string) || 'Payment was declined. Please check your card details and try again.' },
        { status: 500 }
      );
    }
    if (txnResult.code !== undefined && txnResult.code !== 0) {
      const errorMsg = (txnResult.data as string) || (txnResult.message as string) || 'Payment processing failed';
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    // ════════════════════════════════════════════════════════════════
    // ✅ PAYMENT SUCCESSFUL
    // ════════════════════════════════════════════════════════════════
    console.log(`[AddonCheckout] ✅ Payment successful for ${email} — ${course.name}`);

    // ── Step 3: Add tags ──────────────────────────────────────────────
    const tagIds = [CUSTOMERS_TAG_ID, course.saleTagId];
    await fetch('https://api.ontraport.com/1/Contacts/tag', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({ ids: String(contactId), add_list: tagIds.join(',') }),
    });
    console.log(`[AddonCheckout] Tags added: ${tagIds.join(', ')}`);

    // ── Step 4: Update contact with full payment & enrolment details ──
    const updateBody: Record<string, string> = {
      id: contactId,
      // Enrolment status & term (for CRM traceability)
      f2288: ONTRAPORT_ENROLLED_ID,  // Enrolled
      f2289: termOptionId,           // Term (A26/S26)
      // Payment details
      f2294: String(effectivePrice),
      f2296: paymentPlanText,
      f2456: isFullPayment ? '541' : '542',
      f2537: PAYMENT_METHOD_STRIPE,
      f1544: String(effectivePrice),
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
      updateBody.f2607 = `${firstInstalment.getDate()} ${MONTHS[firstInstalment.getMonth()]} ${firstInstalment.getFullYear()}`;
    }

    await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify(updateBody),
    });

    const txnData = (txnResult.data || {}) as Record<string, unknown>;
    const invoiceId = txnData.invoice_id || txnData.id || txnResult.invoice_id;

    return NextResponse.json({ success: true, invoiceId, contactId });
  } catch (error) {
    console.error('[AddonCheckout] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
