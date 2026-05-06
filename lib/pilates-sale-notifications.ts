// ─── Sale Notifications ─────────────────────────────────────────────
// Sends "Ding Ding 🔔 Sale!" notifications to Slack #sales and sales@imageft.ie
// Called ONLY after a successful payment in the checkout flow

import { sendWhatsAppMessage } from './aisensy';

interface SaleDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  packageName: string;
  packagePrice: number;
  effectiveTotal: number;
  depositAmount: number;
  monthlyPayment: number;
  months: number;
  isFullPayment: boolean;
  location: string;
  timetable: string;
  startDate: string;
  term: string;
  year: string;
  addOns: string[];
  addOnsTotal: number;
  couponCode?: string;
  discount?: number;
  contactId: string;
  invoiceId?: string | number;
  adSource1?: string;
  adSource2?: string;
  adSource3?: string;
  tags?: string[];
}

// ─── Format sale message — IFT Sales Bot format ──────────────────────
function formatSaleMessage(sale: SaleDetails): { text: string; slackBlocks: object[] } {
  // Term label e.g. "Spring 2026 (S26)" or "Autumn 2026 (A26)"
  const termPrefix = sale.term.startsWith('S') ? 'Spring' : 'Autumn';
  const termYear = `20${sale.term.slice(1)}`;
  const termLabel = `${termPrefix} ${termYear} (${sale.term})`;

  // Payment line
  const paymentLine = sale.isFullPayment
    ? `Paid in Full — €${sale.effectiveTotal.toFixed(2)}`
    : `Payment Plan — €${sale.depositAmount.toFixed(2)} deposit + €${sale.monthlyPayment.toFixed(2)}/mo x ${sale.months} month${sale.months !== 1 ? 's' : ''} (total €${sale.effectiveTotal.toFixed(2)})`;

  const couponLine = sale.couponCode
    ? `Coupon: ${sale.couponCode} (-€${(sale.discount ?? 0).toLocaleString()})\n` : '';

  const campaignLine = sale.adSource1 || 'N/A';
  const adSetLine    = sale.adSource2 || 'N/A';
  const adNameLine   = sale.adSource3 || 'N/A';
  const tagsLine     = sale.tags?.join(', ') || 'Customers';

  const name  = `${sale.firstName} ${sale.lastName}`.toUpperCase();
  const email = sale.email.toUpperCase();

  // Add-ons line — only renders when at least one add-on was bought
  const addOnsLine = (sale.addOns && sale.addOns.length > 0)
    ? `Add-ons: ${sale.addOns.join(', ')}${sale.addOnsTotal ? ` (+€${sale.addOnsTotal.toFixed(2)})` : ''}`
    : '';

  const text = [
    `Ding Ding Sale 🔔🔔🔔💶💶💶`,
    `Someone just enrolled`,
    `Contact ID: ${sale.contactId}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Number: ${sale.phone}`,
    `Course: ${sale.packageName}`,
    addOnsLine,
    `Day: ${sale.timetable || ''}`,
    `Location: ${sale.location || ''}`,
    `Term: ${termLabel}`,
    `Payment: ${paymentLine}`,
    couponLine,
    `Marketing Campaign: ${campaignLine}`,
    `Ad Set: ${adSetLine}`,
    `Ad Name: ${adNameLine}`,
    `Tags: ${tagsLine}`,
    ``,
    `Ontraport: https://app.ontraport.com/#!/contacts/view?id=${sale.contactId}`,
    `Onboarding: https://pilatescheckout.imageft.ie/onboarding/${sale.contactId}`,
  ].filter(line => line !== undefined && line !== null && line !== '').join('\n');

  const slackBlocks: object[] = [];

  return { text, slackBlocks };
}

// ─── Send Slack Notification ────────────────────────────────────────
export async function sendSlackSaleNotification(sale: SaleDetails): Promise<void> {
  const webhookUrl = (process.env.SLACK_SALES_WEBHOOK_URL || '').trim();

  if (!webhookUrl) {
    console.warn('[Slack] SLACK_SALES_WEBHOOK_URL not configured — skipping notification');
    return;
  }

  try {
    const { text } = formatSaleMessage(sale);

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ text, username: 'IFT Sales Bot', icon_emoji: ':bellhop_bell:' }),
    });

    if (res.ok) {
      console.log(`[Slack] Sale notification sent for ${sale.firstName} ${sale.lastName}`);
    } else {
      console.error(`[Slack] Failed to send: ${res.status} ${await res.text()}`);
    }
  } catch (error) {
    console.error('[Slack] Error sending notification:', error);
  }
}

// ─── Send Email Notification to sales@imageft.ie ─────────────────────
// Uses Ontraport's API to add a note to the contact AND send a one-off email
export async function sendEmailSaleNotification(sale: SaleDetails): Promise<void> {
  const ontraportApiKey = process.env.ONTRAPORT_API_KEY;
  const ontraportAppId = process.env.ONTRAPORT_APP_ID;

  if (!ontraportApiKey || !ontraportAppId) {
    console.warn('[Email] Ontraport not configured — skipping email');
    return;
  }

  const headers = {
    'Api-Key': ontraportApiKey,
    'Api-Appid': ontraportAppId,
    'Content-Type': 'application/json',
  };

  try {
    const { text } = formatSaleMessage(sale);

    // Add a note to the contact with sale details (visible in Ontraport contact record)
    await fetch('https://api.ontraport.com/1/Messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contact_id: sale.contactId,
        type: 'Task',
        subject: `SALE: ${sale.packageName} - EUR${sale.effectiveTotal}`,
        message: text,
      }),
    });

    // Send email via Ontraport's single email endpoint
    // This sends FROM the contact TO the configured notification address
    const emailRes = await fetch('https://api.ontraport.com/1/message', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contact_id: Number(sale.contactId),
        id: 0, // ad-hoc message (not a saved template)
        subject: `DING DING -- New Sale: ${sale.firstName} ${sale.lastName} -- ${sale.packageName}`,
        message: `<pre style="font-family: -apple-system, sans-serif; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
        send_to: 'sales@imageft.ie',
      }),
    });

    if (emailRes.ok) {
      console.log(`[Email] Sale notification sent to sales@imageft.ie for ${sale.firstName}`);
    } else {
      const errText = await emailRes.text();
      console.error(`[Email] Ontraport email failed: ${emailRes.status} ${errText}`);

      // Fallback: send via Slack as well (Slack already handles the #sales channel)
      console.log('[Email] Falling back to Slack-only notification');
    }
  } catch (error) {
    console.error('[Email] Error sending notification:', error);
  }
}

// ─── Send Onboarding Reminder via AiSensy WhatsApp ──────────────────
// Call this when a student hasn't completed onboarding within X hours/days
export async function sendOnboardingReminder(
  phone: string,
  firstName: string,
  packageName: string,
  onboardingUrl: string,
): Promise<void> {
  try {
    await sendWhatsAppMessage({
      destination: phone,
      userName: firstName,
      campaignName: 'onboarding_reminder',
      templateParams: [firstName, packageName, onboardingUrl],
      source: 'ift-onboarding-reminder',
    });
    console.log(`[AiSensy] Onboarding reminder sent to ${phone} for ${firstName}`);
  } catch (error) {
    console.error('[AiSensy] Error sending onboarding reminder:', error);
  }
}

// ─── Combined: Send all sale notifications ──────────────────────────
export async function notifySale(sale: SaleDetails): Promise<void> {
  // Fire all notifications in parallel — don't block the checkout response
  await Promise.allSettled([
    sendSlackSaleNotification(sale),
    sendEmailSaleNotification(sale),
  ]);
}
