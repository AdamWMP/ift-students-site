// ─── Sale Notifications — IFT Sales Bot ─────────────────────────────
// Sends "Ding Ding Sale" notifications to Slack #sales (via SLACK_SALES_WEBHOOK_URL)
// and a copy to sales@imageft.ie via Ontraport. Called ONLY after a
// successful payment in the checkout flow.
//
// Exports:
//   notifySale       → PT packages (pro-coach, complete-coach, fitness-business-coach)
//   notifyAddonSale  → S&C, NutriCert, Pre & Post Natal, AI Workshops, etc.
//
// Env required:
//   SLACK_SALES_WEBHOOK_URL  → the #sales Slack incoming webhook
//   ONTRAPORT_API_KEY / ONTRAPORT_APP_ID  → to email sales@imageft.ie

// ─── Shared Slack poster ─────────────────────────────────────────────
export async function postToSlack(text: string, context: string): Promise<{ ok: boolean; reason?: string }> {
  const webhookUrl = (process.env.SLACK_SALES_WEBHOOK_URL || '').trim();
  if (!webhookUrl) {
    console.error(`[Slack-FAIL] SLACK_SALES_WEBHOOK_URL not configured — ${context} silently dropped. Set it on Vercel.`);
    return { ok: false, reason: 'missing-webhook-url' };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ text, username: 'IFT Sales Bot', icon_emoji: ':bellhop_bell:' }),
    });
    if (res.ok) {
      console.log(`[Slack] ${context} notification sent`);
      return { ok: true };
    }
    const body = await res.text();
    console.error(`[Slack-FAIL] ${context} HTTP ${res.status}: ${body}`);
    return { ok: false, reason: `http-${res.status}` };
  } catch (error) {
    console.error(`[Slack-FAIL] Error sending ${context}:`, error);
    return { ok: false, reason: 'exception' };
  }
}

// ─── PT / Package sale notifications ─────────────────────────────────
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
  addOns?: string[];
  addOnsTotal?: number;
  couponCode?: string;
  discount?: number;
  contactId: string | number;
  invoiceId?: string | number;
  adSource1?: string;
  adSource2?: string;
  adSource3?: string;
  tags?: string[];
}

function formatSaleMessage(sale: SaleDetails): string {
  const termPrefix = sale.term.startsWith('S') ? 'Spring' : 'Autumn';
  const termYear = `20${sale.term.slice(1)}`;
  const termLabel = `${termPrefix} ${termYear} (${sale.term})`;

  const paymentLine = sale.isFullPayment
    ? `Paid in Full — €${sale.effectiveTotal.toFixed(2)}`
    : `Payment Plan — €${sale.depositAmount.toFixed(2)} deposit + €${sale.monthlyPayment.toFixed(2)}/mo x ${sale.months} month${sale.months !== 1 ? 's' : ''} (total €${sale.effectiveTotal.toFixed(2)})`;

  const couponLine = sale.couponCode
    ? `Coupon: ${sale.couponCode} (-€${(sale.discount ?? 0).toLocaleString()})` : '';

  const campaignLine = sale.adSource1 || 'N/A';
  const adSetLine    = sale.adSource2 || 'N/A';
  const adNameLine   = sale.adSource3 || 'N/A';
  const tagsLine     = sale.tags?.join(', ') || 'Customers';

  const name  = `${sale.firstName} ${sale.lastName}`.toUpperCase();
  const email = sale.email.toUpperCase();

  return [
    `Ding Ding Sale 🔔🔔🔔💶💶💶`,
    `Someone just enrolled`,
    `Contact ID: ${sale.contactId}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Number: ${sale.phone}`,
    `Course: ${sale.packageName}`,
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
    `Onboarding: https://ptcheckout.imageft.ie/onboarding/${sale.contactId}`,
  ].filter(line => line !== undefined && line !== null && line !== '').join('\n');
}

async function sendEmailSaleNotification(sale: SaleDetails, text: string): Promise<void> {
  const ontraportApiKey = process.env.ONTRAPORT_API_KEY;
  const ontraportAppId = process.env.ONTRAPORT_APP_ID;
  if (!ontraportApiKey || !ontraportAppId) return;

  const headers = {
    'Api-Key': ontraportApiKey,
    'Api-Appid': ontraportAppId,
    'Content-Type': 'application/json',
  };

  try {
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

    await fetch('https://api.ontraport.com/1/message', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contact_id: Number(sale.contactId),
        id: 0,
        subject: `DING DING -- New Sale: ${sale.firstName} ${sale.lastName} -- ${sale.packageName}`,
        message: `<pre style="font-family: -apple-system, sans-serif; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
        send_to: 'sales@imageft.ie',
      }),
    });
  } catch (error) {
    console.error('[Email] Error sending sales@imageft.ie notification:', error);
  }
}

export async function notifySale(sale: SaleDetails): Promise<void> {
  const text = formatSaleMessage(sale);
  await Promise.allSettled([
    postToSlack(text, `sale for ${sale.firstName} ${sale.lastName}`),
    sendEmailSaleNotification(sale, text),
  ]);
}

// ─── Addon / Workshop / Short-course sale notifications ─────────────
interface AddonSaleDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseName: string;
  effectivePrice: number;
  depositAmount: number;
  monthlyPayment: number;
  months: number;
  isFullPayment: boolean;
  locationLabel?: string;
  timetableLabel?: string;
  couponCode?: string;
  discount?: number;
  contactId: string | number;
  invoiceId?: string | number;
  marketingCampaign?: string;
  adSet?: string;
  adName?: string;
}

export async function notifyAddonSale(sale: AddonSaleDetails): Promise<void> {
  const paymentPlan = sale.isFullPayment
    ? `Paid in Full — €${sale.effectivePrice.toLocaleString()}`
    : `€${sale.depositAmount} deposit + €${sale.monthlyPayment.toFixed(2)} x ${sale.months} month${sale.months !== 1 ? 's' : ''}`;

  const text = [
    `Ding Ding Sale :bellhop_bell::bellhop_bell::bellhop_bell::euro::euro::euro:`,
    `Someone just purchased a course`,
    `Contact ID: ${sale.contactId}`,
    `Name: ${sale.firstName} ${sale.lastName}`,
    `Email: ${sale.email}`,
    `Number: ${sale.phone}`,
    `Course: ${sale.courseName}`,
    `Day: ${sale.timetableLabel || ''}`,
    `Location: ${sale.locationLabel || ''}`,
    `Spent: €${sale.depositAmount.toFixed(2)}`,
    !sale.isFullPayment ? `Payment Plan: ${paymentPlan}` : '',
    sale.couponCode ? `Coupon: ${sale.couponCode} (-€${sale.discount?.toLocaleString()})` : '',
    ``,
    `Marketing Campaign: ${sale.marketingCampaign || 'N/A'}`,
    `Ad Set: ${sale.adSet || 'N/A'}`,
    `Ad Name: ${sale.adName || 'N/A'}`,
    ``,
    `Ontraport: https://app.ontraport.com/#!/contacts/view?id=${sale.contactId}`,
    `Onboarding: https://ptcheckout.imageft.ie/onboarding/${sale.contactId}`,
  ].filter(line => line !== undefined && line !== null && line !== '').join('\n');

  await postToSlack(text, `addon sale for ${sale.firstName} ${sale.lastName} — ${sale.courseName}`);
}

// ─── Tag-driven backup notification ──────────────────────────────────
// Fires when Ontraport's "Customers" tag is added to a contact (via webhook
// from an Ontraport automation rule). Re-fetches the contact and posts a
// rich Ding Ding message so a sale is NEVER silently missed in Slack.
//
// This intentionally complements (does not replace) the inline ding fired
// from create-*-payment routes — both paths are wanted for redundancy.

const ONTRAPORT_LOCATION_LABELS: Record<string, string> = {
  '500': 'Galway',
  '501': 'Cork',
  '502': 'Dublin (Tallaght)',
  '503': 'Dublin (Swords)',
  '498': 'Wexford',
  '499': 'Limerick',
  '544': 'Online',
  '563': 'Belfast',
};

const ONTRAPORT_TIMETABLE_LABELS: Record<string, string> = {
  '504': '16 Week Saturday',
  '505': '8 Week Intensive',
  '544': 'Online (Self-Paced)',
  '597': '16 Week Evening + Saturday',
};

interface OntraportContactFields {
  firstname?: string;
  lastname?: string;
  email?: string;
  sms_number?: string;
  f1428?: string;  // Package/course name
  f2294?: string;  // Price
  f2296?: string;  // Payment plan text
  f1612?: string;  // Payment plan text (mirror)
  f2604?: string;  // Deposit
  f2605?: string;  // Monthly
  f2606?: string;  // Months
  f2607?: string;  // First instalment date
  f2168?: string;  // Marketing Campaign
  f2169?: string;  // Ad Set
  f2170?: string;  // Ad Name
  f2289?: string;  // Term option ID
  f2291?: string;  // Location option ID
  f2292?: string;  // Timetable option ID
  f2456?: string;  // PT Course Fees status (541=paid, 542=plan)
  [k: string]: string | undefined;
}

async function fetchOntraportContact(contactId: string | number): Promise<OntraportContactFields | null> {
  const apiKey = process.env.ONTRAPORT_API_KEY;
  const appId = process.env.ONTRAPORT_APP_ID;
  if (!apiKey || !appId) {
    console.error('[TagWebhook] Ontraport credentials missing — cannot fetch contact');
    return null;
  }
  try {
    const res = await fetch(
      `https://api.ontraport.com/1/Contact?id=${encodeURIComponent(String(contactId))}`,
      {
        method: 'GET',
        headers: {
          'Api-Key': apiKey,
          'Api-Appid': appId,
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await res.json() as { data?: OntraportContactFields };
    return json.data || null;
  } catch (e) {
    console.error('[TagWebhook] Failed to fetch Ontraport contact:', e);
    return null;
  }
}

export async function notifySaleFromOntraportContact(
  contactId: string | number,
): Promise<{ ok: boolean; reason?: string }> {
  const c = await fetchOntraportContact(contactId);
  if (!c) return { ok: false, reason: 'contact-fetch-failed' };

  const isFullPayment = c.f2456 === '541';
  const locationLabel = ONTRAPORT_LOCATION_LABELS[c.f2291 || ''] || c.f2291 || '';
  const timetableLabel = ONTRAPORT_TIMETABLE_LABELS[c.f2292 || ''] || c.f2292 || '';
  const paymentLine = c.f2296 || c.f1612 || (isFullPayment ? 'Paid in Full' : 'Payment Plan');
  const name = `${c.firstname || ''} ${c.lastname || ''}`.trim().toUpperCase();

  const text = [
    `Ding Ding Sale 🔔🔔🔔💶💶💶  (Ontraport tag-fired)`,
    `Customer enrolment confirmed`,
    `Contact ID: ${contactId}`,
    `Name: ${name}`,
    `Email: ${(c.email || '').toUpperCase()}`,
    `Number: ${c.sms_number || ''}`,
    `Course: ${c.f1428 || ''}`,
    timetableLabel ? `Day: ${timetableLabel}` : '',
    locationLabel ? `Location: ${locationLabel}` : '',
    `Payment: ${paymentLine}`,
    !isFullPayment && c.f2604 ? `Deposit: €${c.f2604}` : '',
    !isFullPayment && c.f2605 && c.f2606 ? `Plan: €${c.f2605}/mo × ${c.f2606} months` : '',
    !isFullPayment && c.f2607 ? `First instalment: ${c.f2607}` : '',
    `Marketing Campaign: ${c.f2168 || 'N/A'}`,
    `Ad Set: ${c.f2169 || 'N/A'}`,
    `Ad Name: ${c.f2170 || 'N/A'}`,
    ``,
    `Ontraport: https://app.ontraport.com/#!/contacts/view?id=${contactId}`,
    `Onboarding: https://ptcheckout.imageft.ie/onboarding/${contactId}`,
  ].filter(line => line !== '').join('\n');

  return postToSlack(text, `tag-fired sale for ${name || contactId}`);
}
