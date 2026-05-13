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

  // Add-ons line — only renders when at least one add-on was bought
  const addOnsLine = (sale.addOns && sale.addOns.length > 0)
    ? `Add-ons: ${sale.addOns.join(', ')}${sale.addOnsTotal ? ` (+€${sale.addOnsTotal.toFixed(2)})` : ''}`
    : '';

  // Start date — format the ISO date as "DD Month YYYY" or pass through "TBC"
  const startDateLine = (() => {
    if (!sale.startDate || sale.startDate === 'TBC') return 'Start date: TBC';
    const d = new Date(sale.startDate);
    if (Number.isNaN(d.getTime())) return `Start date: ${sale.startDate}`;
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `Start date: ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  })();

  return [
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
    startDateLine,
    `Payment: ${paymentLine}`,
    `Payment Method: Stripe`,
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

const ONTRAPORT_TERM_LABELS: Record<string, string> = {
  '492': 'Autumn (A26)',
  '494': 'Spring (S26)',
};

// f2290 PT Course Qualifications — labels copied verbatim from Ontraport meta
// so the Slack ding shows the real package name customers see in Ontraport.
const ONTRAPORT_QUALIFICATION_LABELS: Record<string, string> = {
  '495': '(Launchpad Bundle) Fitness Instructor & Personal Trainer',
  '496': 'Group Instructor & Personal Trainer',
  '497': 'The Cert (Fitness Instructor, Group Instructor, Personal Trainer)',
  '540': 'High Performance Bundle (Fitness Instructor, Personal Trainer, S&C)',
  '564': 'Launchpad & The Fitness Business Accelerator',
  '565': 'Leader & The Fitness Business Accelerator',
  '566': 'Group Instruction Only',
  '567': 'Personal Trainer Course Only',
  '568': 'Fitness Business Accelerator Only',
  '569': 'The Career (Fitness, Group, PT, Nutrition, Fitness Business Accelerator)',
  '570': 'Online Coaching Course (Fitness, PT, Nutrition, Advanced Nutrition, FBA)',
  '627': 'The Business (FI, GI, PT, Nutrition, FBA + AI & Programming Workshops + Brand Launch Photoshoot)',
};

// f1428 Choose your Course / Package — fallback when f2290 isn't set
const ONTRAPORT_PACKAGE_LABELS: Record<string, string> = {
  '20':  'Sports Massage — Dublin',
  '23':  'Personal Training only',
  '166': 'Fitness & Group Instruction Only',
  '231': 'Combination Course',
  '240': 'INTENSIVE',
  '262': 'Online Coaching',
};

// f1834 New IFT Choose your course — second fallback
const ONTRAPORT_COURSE_LABELS: Record<string, string> = {
  '308': 'Strength & Conditioning Course',
  '309': 'Personal Training Only Course',
  '310': 'Combination Course (Fitness, Group, PT)',
  '363': 'Group Instruction & PT Course',
  '369': 'Fitness & Group Instruction',
  '420': 'Pre & Post Natal',
  '441': 'Advanced Nutrition',
  '447': 'BUNDLE: Combo Course + Nutrition Course',
  '448': 'BUNDLE: Combo Course + PPN',
  '449': 'BUNDLE: Combo Course + S&C Course',
  '452': 'Pilates Course (EQF Level 4)',
  '459': 'BUNDLE: Combo Course + Pilates Course',
  '472': 'IFTG',
};

const ONTRAPORT_TAG_LABELS: Record<string, string> = {
  '50':   'Customers',
  '2336': 'Skool Enrolment',
  '2337': 'Skool Enrolment',
  '2495': 'Sale',
  '2505': 'S26 Combo Course Sale',
  '2526': 'Sale',
};

interface OntraportContactFields {
  firstname?: string;
  lastname?: string;
  email?: string;
  sms_number?: string;
  spent?: string;             // Total amount paid so far
  mrcAmount?: string;         // Most recent charge amount (typically the deposit)
  num_purchased?: string;
  date?: string;              // Contact creation date (unix)
  contact_cat?: string;       // */* delimited tag IDs
  f1428?: string;  // Package/course name
  f2293?: string;  // Course start date (unix)
  f2294?: string;  // Total price
  f2296?: string;  // Payment plan text (free-form, sometimes raw "500 + 383 * 6")
  f1612?: string;  // Payment plan text (mirror)
  f2334?: string;  // Deposit amount (older flow)
  f2604?: string;  // Deposit (newer flow)
  f2605?: string;  // Monthly
  f2606?: string;  // Months
  f2607?: string;  // First instalment date (free-form text)
  f2168?: string;  // Marketing Campaign
  f2169?: string;  // Ad Set
  f2170?: string;  // Ad Name
  f2289?: string;  // Term option ID
  f2290?: string;  // Qualifications option ID — fallback for course name
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

// ─── Helpers for tag-driven message rendering ────────────────────────

function formatPlanLine(c: OntraportContactFields, isFullPayment: boolean): string {
  if (isFullPayment) {
    return c.f2294 ? `Paid in Full — €${Number(c.f2294).toFixed(2)}` : 'Paid in Full';
  }
  // Prefer the structured fields written by the new checkout flow.
  const deposit = c.f2604 || c.f2334 || c.mrcAmount || c.spent;
  const monthly = c.f2605;
  const months = c.f2606;
  const total = c.f2294;
  if (deposit && monthly && months) {
    const totalPart = total ? ` (total €${Number(total).toFixed(2)})` : '';
    return `Payment Plan — €${Number(deposit).toFixed(2)} deposit + €${Number(monthly).toFixed(2)}/mo × ${months}${totalPart}`;
  }
  // Older records have a free-form text like "500 + 383 * 6" — try to parse.
  const raw = (c.f2296 || c.f1612 || '').trim();
  const m = raw.match(/^(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*[×x*]\s*(\d+)\s*$/);
  if (m) {
    const [, dep, mo, n] = m;
    const totalPart = total ? ` (total €${Number(total).toFixed(2)})` : '';
    return `Payment Plan — €${Number(dep).toFixed(2)} deposit + €${Number(mo).toFixed(2)}/mo × ${n}${totalPart}`;
  }
  if (raw) return `Payment Plan — ${raw}`;
  if (deposit && total) return `Payment Plan — €${Number(deposit).toFixed(2)} deposit, total €${Number(total).toFixed(2)}`;
  return 'Payment Plan';
}

// Course name priority — most specific English label first:
//   1. f2290 (PT Course Qualifications) — most specific, names like "The Cert"
//   2. f1834 (New IFT course) — bundle/combo level
//   3. f1428 (Choose your Course / Package) — coarse package category
// We never return a bare option ID. If nothing resolves we return ''.
function deriveCourseName(c: OntraportContactFields): string {
  const qual = c.f2290 && c.f2290 !== '0' ? ONTRAPORT_QUALIFICATION_LABELS[c.f2290] : undefined;
  if (qual) return qual;
  const course = c.f1834 && c.f1834 !== '0' ? ONTRAPORT_COURSE_LABELS[c.f1834] : undefined;
  if (course) return course;
  const pkg = c.f1428 && c.f1428 !== '0' ? ONTRAPORT_PACKAGE_LABELS[c.f1428] : undefined;
  if (pkg) return pkg;
  return '';
}

function deriveTags(c: OntraportContactFields): string[] {
  const raw = c.contact_cat || '';
  const ids = raw.split('*/*').map(s => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const label = ONTRAPORT_TAG_LABELS[id];
    if (!label || seen.has(label)) continue;
    seen.add(label);
    out.push(label);
  }
  return out;
}

function formatStartDate(unix?: string): string {
  if (!unix) return '';
  const n = Number(unix);
  if (!n || Number.isNaN(n)) return '';
  const d = new Date(n * 1000);
  if (Number.isNaN(d.getTime())) return '';
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export async function notifySaleFromOntraportContact(
  contactId: string | number,
): Promise<{ ok: boolean; reason?: string }> {
  const c = await fetchOntraportContact(contactId);
  if (!c) return { ok: false, reason: 'contact-fetch-failed' };

  const isFullPayment = c.f2456 === '541';
  const locationLabel = ONTRAPORT_LOCATION_LABELS[c.f2291 || ''] || c.f2291 || '';
  const timetableLabel = ONTRAPORT_TIMETABLE_LABELS[c.f2292 || ''] || c.f2292 || '';
  const termLabel = ONTRAPORT_TERM_LABELS[c.f2289 || ''] || (c.f2289 || '');
  const courseName = deriveCourseName(c);
  const planLine = formatPlanLine(c, isFullPayment);
  const startDate = formatStartDate(c.f2293);
  const tagLabels = deriveTags(c);
  const name = `${c.firstname || ''} ${c.lastname || ''}`.trim().toUpperCase();
  const totalPaid = c.spent ? `€${Number(c.spent).toFixed(2)}` : '';

  const text = [
    `Ding Ding Sale 🔔🔔🔔💶💶💶  (Ontraport tag-fired)`,
    `Customer enrolment confirmed`,
    `Contact ID: ${contactId}`,
    `Name: ${name}`,
    `Email: ${(c.email || '').toUpperCase()}`,
    `Number: ${c.sms_number || ''}`,
    courseName ? `Course: ${courseName}` : '',
    timetableLabel ? `Day: ${timetableLabel}` : '',
    locationLabel ? `Location: ${locationLabel}` : '',
    termLabel ? `Term: ${termLabel}` : '',
    startDate ? `Start date: ${startDate}` : '',
    `Payment: ${planLine}`,
    `Payment Method: ${c.f2537 === '577' ? 'Stripe' : (c.f2537 || 'Stripe')}`,
    totalPaid ? `Paid so far: ${totalPaid}` : '',
    `Marketing Campaign: ${c.f2168 || 'N/A'}`,
    `Ad Set: ${c.f2169 || 'N/A'}`,
    `Ad Name: ${c.f2170 || 'N/A'}`,
    tagLabels.length ? `Tags: ${tagLabels.join(', ')}` : '',
    ``,
    `Ontraport: https://app.ontraport.com/#!/contacts/view?id=${contactId}`,
    `Onboarding: https://ptcheckout.imageft.ie/onboarding/${contactId}`,
  ].filter(line => line !== '').join('\n');

  return postToSlack(text, `tag-fired sale for ${name || contactId}`);
}
