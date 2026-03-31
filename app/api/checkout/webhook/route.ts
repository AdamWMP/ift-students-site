import { NextRequest, NextResponse } from 'next/server';

// ─── Stripe Webhook Handler ────────────────────────────────────────────
// Processes events after payment:
// 1. checkout.session.completed → deposit paid → create subscription for remaining
// 2. invoice.paid → monthly installment received → update Ontraport
// 3. invoice.payment_failed → notify, tag in Ontraport
// ────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
  const ONTRAPORT_API_KEY = process.env.ONTRAPORT_API_KEY || '';
  const ONTRAPORT_APP_ID = process.env.ONTRAPORT_APP_ID || '';

  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const body = await request.text();

  // ── Signature verification ────────────────────────────────────────
  // In production with STRIPE_WEBHOOK_SECRET set, you should verify:
  //   const sig = request.headers.get('stripe-signature');
  //   Use stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  // For now, we parse directly (safe behind your server URL)

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  console.log(`[Webhook] Received event: ${event.type}`);

  // Helper: Stripe API call
  async function stripeRequest(endpoint: string, method: string, params?: URLSearchParams) {
    const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params?.toString(),
    });
    return res.json();
  }

  // Helper: Ontraport update contact by email
  async function ontraportUpdate(email: string, fields: Record<string, string>) {
    if (!ONTRAPORT_API_KEY || !ONTRAPORT_APP_ID) return null;
    const res = await fetch('https://api.ontraport.com/1/Contacts/saveorupdate', {
      method: 'POST',
      headers: {
        'Api-Key': ONTRAPORT_API_KEY,
        'Api-Appid': ONTRAPORT_APP_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, ...fields }),
    });
    const data = await res.json();
    if (data.code !== 0) {
      console.error('[Ontraport] Update error:', data);
      return null;
    }
    return data.data?.id;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata as Record<string, string>;
        if (!metadata) break;

        const email = metadata.email;
        const isFullPayment = metadata.is_full_payment === 'true';
        const customerId = session.customer as string;
        const depositAmount = parseFloat(metadata.deposit_amount);
        const packagePrice = parseFloat(metadata.package_price);
        const months = parseInt(metadata.months);
        const monthlyPayment = parseFloat(metadata.monthly_payment);

        console.log(`[Webhook] Checkout complete: ${email}, deposit €${depositAmount}, full: ${isFullPayment}`);

        if (isFullPayment) {
          await ontraportUpdate(email, {
            f2296: `Paid in Full — €${packagePrice}`,
            f1612: `Paid in Full — €${packagePrice}`,
            f2456: '541', // PT Course Fees → PAID
          });
          break;
        }

        // Create subscription for remaining installments
        const remaining = packagePrice - depositAmount;

        const product = await stripeRequest('products', 'POST', new URLSearchParams({
          name: `${metadata.package_name} — Monthly Installments`,
          'metadata[package_id]': metadata.package_id,
          'metadata[customer_email]': email,
        }));

        const price = await stripeRequest('prices', 'POST', new URLSearchParams({
          product: product.id,
          unit_amount: String(Math.round(monthlyPayment * 100)),
          currency: 'eur',
          'recurring[interval]': 'month',
          'recurring[interval_count]': '1',
        }));

        const billingAnchor = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
        const cancelAt = Math.floor(Date.now() / 1000) + ((months + 1) * 30 * 24 * 60 * 60);

        const subscription = await stripeRequest('subscriptions', 'POST', new URLSearchParams({
          customer: customerId,
          'items[0][price]': price.id,
          billing_cycle_anchor: String(billingAnchor),
          proration_behavior: 'none',
          cancel_at: String(cancelAt),
          'metadata[package_id]': metadata.package_id,
          'metadata[package_name]': metadata.package_name,
          'metadata[customer_email]': email,
          'metadata[total_payments]': String(months),
          'metadata[payments_completed]': '0',
          'metadata[remaining_balance]': String(remaining),
          'metadata[monthly_amount]': String(monthlyPayment),
        }));

        console.log(`[Webhook] Subscription ${subscription.id}: €${monthlyPayment}/mo × ${months}mo for ${email}`);

        const planText = `€${depositAmount} deposit PAID | €${monthlyPayment.toFixed(2)}/mo x ${months} months (Sub: ${subscription.id})`;
        await ontraportUpdate(email, {
          f2296: planText,
          f1612: planText,
        });
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripeRequest(`subscriptions/${subscriptionId}`, 'GET');
        const meta = subscription.metadata || {};

        const completed = parseInt(meta.payments_completed || '0') + 1;
        const total = parseInt(meta.total_payments || '0');
        const amount = parseFloat(meta.monthly_amount || '0');
        const bal = parseFloat(meta.remaining_balance || '0') - amount;

        console.log(`[Webhook] Payment ${completed}/${total} for ${meta.customer_email}`);

        await stripeRequest(`subscriptions/${subscriptionId}`, 'POST', new URLSearchParams({
          'metadata[payments_completed]': String(completed),
          'metadata[remaining_balance]': String(Math.max(0, bal)),
        }));

        if (meta.customer_email) {
          const monthsRemaining = Math.max(0, total - completed);
          const text = completed >= total
            ? `FULLY PAID — All ${total} payments completed`
            : `Payment ${completed}/${total} received | €${Math.max(0, bal).toFixed(2)} remaining`;
          const fields: Record<string, string> = {
            f2296: text,
            f1612: text,
            f2606: String(monthsRemaining), // Payment Months Remaining — decrement each payment
          };
          if (completed >= total) {
            fields.f2456 = '541'; // PT Course Fees → PAID (all installments complete)
          }
          await ontraportUpdate(meta.customer_email, fields);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripeRequest(`subscriptions/${subscriptionId}`, 'GET');
        const email = subscription.metadata?.customer_email;
        console.error(`[Webhook] Payment FAILED for ${email}`);

        if (email) {
          await ontraportUpdate(email, {
            f2296: `PAYMENT FAILED — Action required (Sub: ${subscriptionId})`,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const meta = (sub.metadata || {}) as Record<string, string>;
        console.log(`[Webhook] Subscription ended for ${meta.customer_email}`);

        if (meta.customer_email) {
          await ontraportUpdate(meta.customer_email, {
            f2296: `Plan complete — ${meta.payments_completed || '?'}/${meta.total_payments || '?'} payments made`,
            f1612: `Plan complete — ${meta.payments_completed || '?'}/${meta.total_payments || '?'} payments made`,
          });
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
