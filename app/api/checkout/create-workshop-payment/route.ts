import { NextRequest, NextResponse } from 'next/server';

// ─── Workshop Config ────────────────────────────────────────────────────
const WORKSHOP_PRODUCT_ID = '118';
// ⚠️ TODO: Create "S26 AI For Coaches Webinar" tag in Ontraport → paste ID here
const AI_WEBINAR_TAG_ID = '';
const CUSTOMERS_TAG_ID = '50';
const WORKSHOP_AI_COACHES_FIELD = 'f2612';
const ONTRAPORT_GATEWAY_ID = '6';
const CHECKBOX_CHECKED = '1';

// Pricing
export const FULL_PRICE = 300;           // Pay in full — saves €199
export const PLAN_TOTAL = 499;           // Payment plan total
export const DEPOSIT_PRICE = 199;        // Deposit due today on payment plan
export const REMAINING_BALANCE = PLAN_TOTAL - DEPOSIT_PRICE; // €300 split over 1–2 months

export interface WorkshopCheckoutRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isFullPayment: boolean;
  planMonths: 1 | 2; // only used when isFullPayment = false
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
}

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: WorkshopCheckoutRequest = await request.json();
    const {
      firstName, lastName, email, phone,
      isFullPayment, planMonths,
      cardNumber, cardExpMonth, cardExpYear, cardCvc,
    } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvc) {
      return NextResponse.json({ error: 'Card details are required' }, { status: 400 });
    }
    if (!process.env.ONTRAPORT_API_KEY || !process.env.ONTRAPORT_APP_ID) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const months = planMonths || 1;
    const monthlyPayment = parseFloat((REMAINING_BALANCE / months).toFixed(2));
    const planTotal = PLAN_TOTAL; // €499 fixed total regardless of instalment split
    const chargeAmount = isFullPayment ? FULL_PRICE : DEPOSIT_PRICE;

    const sessionLabel = 'Phase 1 · Mon 18th May 7pm + Phase 2 · Sat 23rd May 11am — Online';

    const paymentPlanText = isFullPayment
      ? `Paid in Full — €${FULL_PRICE}`
      : `€${DEPOSIT_PRICE} deposit + €${monthlyPayment}/mo × ${months} month${months > 1 ? 's' : ''} (total €${planTotal})`;

    // ── Step 1: Create/update contact ────────────────────────────────
    const contactRes = await fetch('https://api.ontraport.com/1/Contacts/saveorupdate', {
      method: 'POST',
      headers: ontraportHeaders(),
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        email,
        sms_number: phone,
        f1428: 'AI For Coaches Webinar',
      }),
    });

    let contactResult: Record<string, unknown>;
    try {
      contactResult = await contactRes.json();
    } catch {
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }

    if (contactResult.code !== 0) {
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }

    const contactData = contactResult.data as any;
    const contactId = contactData?.attrs?.id || contactData?.id || contactData?.[0]?.id;
    if (!contactId) {
      return NextResponse.json({ error: 'Failed to get contact ID' }, { status: 500 });
    }
    console.log(`[Workshop] Contact: ${email} → ID ${contactId}`);

    // ── Step 2: Build offer ──────────────────────────────────────────
    let offerProducts: unknown[];

    if (isFullPayment) {
      offerProducts = [{
        id: WORKSHOP_PRODUCT_ID,
        type: '',
        quantity: 1,
        total: String(FULL_PRICE.toFixed(2)),
        price: [{ price: String(FULL_PRICE.toFixed(2)), payment_count: 1, unit: 'month' }],
      }];
    } else {
      const now = new Date();
      let targetMonth = now.getMonth();
      let targetYear = now.getFullYear();
      if (now.getDate() >= 15) {
        targetMonth += 1;
        if (targetMonth > 11) { targetMonth = 0; targetYear += 1; }
      }
      let next30th = new Date(targetYear, targetMonth, 30);
      if (next30th.getMonth() !== targetMonth) next30th = new Date(targetYear, targetMonth + 1, 0);
      const trialDays = Math.max(1, Math.ceil((next30th.getTime() - now.getTime()) / 86400000));

      offerProducts = [{
        id: WORKSHOP_PRODUCT_ID,
        type: 'payment_plan',
        quantity: 1,
        total: String(planTotal.toFixed(2)),
        price: [{ price: String(monthlyPayment.toFixed(2)), payment_count: months, unit: 'month' }],
        trial: { price: String(DEPOSIT_PRICE.toFixed(2)), payment_count: trialDays, unit: 'day' },
      }];
    }

    const offer = {
      products: offerProducts,
      subTotal: String(chargeAmount.toFixed(2)),
      grandTotal: String(chargeAmount.toFixed(2)),
      hasTaxes: false,
      hasShipping: false,
      delay: 0,
      invoice_template: 2,
      send_invoice: true,
      send_recurring_invoice: true,
    };

    // ── Step 3: Process payment ──────────────────────────────────────
    const txnRes = await fetch('https://api.ontraport.com/1/transaction/processManual', {
      method: 'POST',
      headers: ontraportHeaders(),
      body: JSON.stringify({
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
      }),
    });

    let txnResult: Record<string, unknown>;
    try {
      txnResult = await txnRes.json();
    } catch {
      return NextResponse.json({ error: 'Payment processing failed. Please try again.' }, { status: 500 });
    }

    const chargeResult = txnResult.chargeResult as Record<string, unknown> | undefined;
    if (chargeResult && chargeResult.result_code !== 1) {
      return NextResponse.json(
        { error: (chargeResult.message as string) || 'Payment was declined. Please check your card details.' },
        { status: 500 }
      );
    }
    if (txnResult.code !== undefined && txnResult.code !== 0) {
      const msg = (txnResult.data as string) || (txnResult.message as string) || 'Payment processing failed';
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // ════════ ✅ PAYMENT SUCCESSFUL ════════
    console.log(`[Workshop] ✅ Payment OK for ${email}`);

    // Tags
    const tagIds = [CUSTOMERS_TAG_ID];
    if (AI_WEBINAR_TAG_ID) tagIds.push(AI_WEBINAR_TAG_ID);
    await fetch('https://api.ontraport.com/1/Contacts/tag', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({ ids: String(contactId), add_list: tagIds.join(',') }),
    });

    // Tick AI for Coaches checkbox + log payment
    await fetch('https://api.ontraport.com/1/Contacts', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({
        id: contactId,
        [WORKSHOP_AI_COACHES_FIELD]: CHECKBOX_CHECKED,
        f1612: paymentPlanText,
      }),
    });

    // Slack
    const slackWebhookUrl = process.env.SLACK_SALES_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
    if (slackWebhookUrl) {
      const ontraportUrl = `https://app.ontraport.com/#!/contacts/view?id=${contactId}`;
      const slackText = [
        'Ding Ding 🤖🔔 AI Workshop Sale 💶',
        '',
        `Name: ${firstName.toUpperCase()} ${lastName.toUpperCase()}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Session: ${sessionLabel}`,
        `Payment: ${paymentPlanText}`,
        `Charged Today: €${chargeAmount}`,
        '',
        `Ontraport: ${ontraportUrl}`,
      ].join('\n');

      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: slackText }),
      }).catch((err) => console.error('[Workshop] Slack error:', err));
    }

    return NextResponse.json({ success: true, contactId, message: `Booking confirmed for ${sessionLabel}` });

  } catch (err) {
    console.error('[Workshop] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
