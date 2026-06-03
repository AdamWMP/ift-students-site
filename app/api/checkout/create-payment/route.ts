import { NextRequest, NextResponse } from 'next/server';
import { notifySale } from '@/lib/sale-notifications';
import { addOns as ALL_ADDONS } from '@/lib/course-data';
import { buildAddonPatch } from '@/lib/ontraport/addon-patch';
import { sendReceipt } from '@/lib/receipts/send';
import { sendReceiptEmail } from '@/lib/receipts/email';
import type { ReceiptInput } from '@/lib/receipts/render';
import { PACKAGE_COMPONENTS } from '@/lib/receipts/render';

// ─── Types ─────────────────────────────────────────────────────────────
interface CohortSelection {
  locationId: string;       // Ontraport dropdown option ID (e.g. f2303 / f2593)
  timetableId: string;      // Ontraport dropdown option ID (e.g. f2304 / f2594)
  startDate: string;        // YYYY-MM-DD — converted to unix in the route
}

interface CheckoutRequest {
  packageId: string;
  packageName: string;
  packagePrice: number;
  addOns?: string[];        // selected add-on IDs from the frontend
  addOnsTotal?: number;     // upfront add-on total (sum of addon.price)
  addOnsTotalPlan?: number; // plan add-on total (sum of paymentPlanPrice ?? price)
  // True if the deposit slider hit max → student is paying the bundle
  // upfront and the upfront prices apply (e.g. Mat Pilates €1,800 not €2,000).
  // False = payment plan in effect; plan prices apply for dual-priced add-ons.
  isFullPayment?: boolean;
  // Cohort details for cohort-required add-ons (Mat / Reformer Pilates).
  // Keyed by addon id ('mat-pilates-cert', 'reformer-pilates-cpd'). Drives
  // the Ontraport f2302–f2306/f2309 (Mat) + f2592–f2596/f2598 (Reformer)
  // field writes so PT-side add-on bookings surface in Ontraport identically
  // to direct pilatescheckout.imageft.ie bookings.
  addonCohorts?: Record<string, CohortSelection>;
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
// Note: '16-week-evening-sat' is a legacy slug — the actual course duration
// is 8 weeks (Ontraport option 597 = "Evening & Weekend - Mon + Wed + Sat (8 Weeks)").
const TIMETABLE_TO_LABEL: Record<string, string> = {
  '8-week-intensive':     'Thursday & Friday (8 Weeks)',
  '16-week-evening-sat':  'Evening & Weekend — Mon + Wed + Sat (8 Weeks)',
  '16-week-saturday':     'Saturday (16 Weeks)',
  'pt-sun16':             'Sunday (16 Weeks)',
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

// f1834 "New IFT Choose your course" — Ontraport DROPDOWN option IDs.
// CRITICAL: must be valid option IDs from the dropdown. Sending an unknown
// value (e.g. the old code sent '97') causes Ontraport to silently store 0,
// which is the root cause of the 7 May 2026 lost-data incident.
// Resolved against live Ontraport meta on 29 Apr 2026:
//   308=S&C, 309=PT Only, 310=Combo (Fitness, Group, PT), 363=GI+PT,
//   369=FI+GI, 420=PPN, 441=Advanced Nutrition,
//   447=BUNDLE Combo + Nutrition, 448=BUNDLE Combo + PPN,
//   449=BUNDLE Combo + S&C, 452=Pilates, 459=BUNDLE Combo + Pilates, 472=IFTG
const PACKAGE_TO_ONTRAPORT_COURSE: Record<string, string> = {
  'pro-coach':              '310',  // The Cert  = Combination Course (FI, GI, PT)
  'complete-coach':         '447',  // The Career = BUNDLE Combo + Nutrition (FBA tracked via f2614)
  'fitness-business-coach': '447',  // The Business = BUNDLE Combo + Nutrition (workshops/photoshoot via f2611-2613 + tags)
  'pt-only':                '309',  // Personal Training Only
  'group-instruction-only': '369',  // Fitness & Group Instruction
  'launch-pad-bundle':      '472',  // IFTG
  'online-coaching-bundle': '472',  // IFTG
};

// f1428 "Choose your Course / Package" — Ontraport DROPDOWN. Was being sent
// free-text (e.g. "Pro Coach") which Ontraport silently rejected. Must be one
// of: 20=Sports Massage, 23=PT only, 166=FI+GI Only, 231=Combination Course,
// 240=INTENSIVE, 262=Online Coaching.
const PACKAGE_TO_ONTRAPORT_PACKAGE: Record<string, string> = {
  'pro-coach':              '231',  // Combination Course
  'complete-coach':         '231',  // Combination Course (+ extras tracked elsewhere)
  'fitness-business-coach': '231',
  'pt-only':                '23',   // Personal Training only
  'group-instruction-only': '166',  // Fitness & Group Instruction Only
  'launch-pad-bundle':      '262',  // Online Coaching
  'online-coaching-bundle': '262',  // Online Coaching
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

// ─── Failsafe pre-flight booking log ─────────────────────────────────
// Posts the full booking payload to Slack the moment a booking starts,
// BEFORE any Ontraport call. This is our last-resort record — even if
// Ontraport is offline, the contact update silently drops fields, or
// downstream code crashes, the customer's choices are captured in Slack.
// Card details are stripped (PCI). Falls back to console-only logging
// if no webhook is configured.
async function logRawBookingAttempt(payload: Record<string, unknown>): Promise<void> {
  const safe: Record<string, unknown> = { ...payload };
  delete safe.cardNumber;
  delete safe.cardExpMonth;
  delete safe.cardExpYear;
  delete safe.cardCvc;

  const stamp = new Date().toISOString();
  const line =
    `🗂 RAW BOOKING ATTEMPT (failsafe log)\n` +
    `Time: ${stamp}\n` +
    `Name: ${(safe.firstName as string) || ''} ${(safe.lastName as string) || ''}\n` +
    `Email: ${(safe.email as string) || ''}\n` +
    `Phone: ${(safe.phone as string) || ''}\n` +
    `Course: ${(safe.packageName as string) || (safe.packageId as string) || ''}\n` +
    `Location: ${(safe.location as string) || ''}\n` +
    `Timetable: ${(safe.timetable as string) || ''}\n` +
    `Start Date: ${(safe.startDate as string) || ''}\n` +
    `Total Price: €${(safe.packagePrice as number) ?? '?'}` +
      (safe.addOnsTotal ? ` + €${safe.addOnsTotal} add-ons` : '') + `\n` +
    `Deposit: €${(safe.depositAmount as number) ?? '?'}\n` +
    `Months: ${(safe.months as number) ?? '?'}\n` +
    `Monthly: €${(safe.monthlyPayment as number) ?? '?'}\n` +
    `Add-ons: ${Array.isArray(safe.addOns) && (safe.addOns as unknown[]).length ? (safe.addOns as unknown[]).join(', ') : 'none'}\n` +
    // Mat / Reformer add-ons need cohort details (location/timetable/start
    // date) for support to fulfil the booking if the downstream Ontraport
    // write silently drops. Without these in the failsafe log, a failed
    // Mat/Reformer booking is unrecoverable.
    (() => {
      const cohorts = safe.addonCohorts as Record<string, { locationId?: string; timetableId?: string; startDate?: string }> | undefined;
      if (!cohorts || Object.keys(cohorts).length === 0) return '';
      const rows = Object.entries(cohorts).map(([addonId, c]) =>
        `  - ${addonId}: loc=${c?.locationId || '?'} · tt=${c?.timetableId || '?'} · start=${c?.startDate || '?'}`
      ).join('\n');
      return `Add-on cohorts:\n${rows}\n`;
    })() +
    `\nFull payload (cards stripped):\n` +
    '```\n' + JSON.stringify(safe, null, 2) + '\n```';

  // Always log to server stdout — Vercel keeps these for 24h+
  console.log('[Checkout][RAW]', line);

  // Also fire to Slack so it's visible without log access
  const url = (process.env.SLACK_BOOKING_LOG_WEBHOOK_URL || process.env.SLACK_SALES_WEBHOOK_URL || '').trim();
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: line, username: 'IFT Booking Failsafe', icon_emoji: ':floppy_disk:' }),
    });
  } catch (e) {
    console.error('[Checkout] failsafe Slack log failed:', e);
  }
}

// ─── Send IFT Global Receipt for a successful invoice ────────────────
// CRITICAL: customers regularly contacted support unsure if their payment
// went through — this is the receipt they were waiting on. We:
//   1. Fire sendInvoice for the given invoiceId.
//   2. If it errors or returns code !== 0, retry once after 1s.
//   3. Log loudly so a missing receipt always shows in Vercel logs.
async function sendInvoiceReceipt(invoiceId: string | number): Promise<boolean> {
  const attempt = async (n: number): Promise<boolean> => {
    try {
      const res = await fetch('https://api.ontraport.com/1/transaction/sendInvoice', {
        method: 'PUT',
        headers: ontraportHeaders(),
        body: JSON.stringify({
          ids: [String(invoiceId)],
          invoice_template: INVOICE_TEMPLATE_ID,
        }),
      });
      const text = await res.text();
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(text); } catch { /* keep raw */ }
      const ok = res.ok && (parsed.code === undefined || parsed.code === 0);
      if (ok) {
        console.log(`[Checkout] ✅ IFT Global Receipt sent for invoice ${invoiceId} (attempt ${n})`);
        return true;
      }
      console.error(`[Receipt-FAIL] sendInvoice for ${invoiceId} attempt ${n} returned HTTP ${res.status} body: ${text.slice(0, 200)}`);
      return false;
    } catch (e) {
      console.error(`[Receipt-FAIL] sendInvoice for ${invoiceId} attempt ${n} threw:`, e);
      return false;
    }
  };

  if (await attempt(1)) return true;
  await new Promise((r) => setTimeout(r, 1000));
  if (await attempt(2)) return true;
  console.error(`[Receipt-FAIL] ❌ IFT Global Receipt FAILED to send for invoice ${invoiceId} after 2 attempts. Customer may not know their payment succeeded.`);
  return false;
}

// Look up the most recent invoice for a contact (fallback when the create
// transaction response didn't include an invoice ID — happens occasionally
// with Ontraport's processManual).
async function findLatestInvoiceForContact(contactId: string | number): Promise<string | undefined> {
  try {
    const apiKey = process.env.ONTRAPORT_API_KEY || '';
    const appId = process.env.ONTRAPORT_APP_ID || '';
    // Ontraport invoice objectID is 46. Filter by contact_id, sort newest first.
    const url = new URL('https://api.ontraport.com/1/objects');
    url.searchParams.set('objectID', '46');
    url.searchParams.set('range', '1');
    url.searchParams.set('sort', 'date');
    url.searchParams.set('sortDir', 'desc');
    url.searchParams.set('condition', JSON.stringify([
      { field: { field: 'contact_id' }, op: '=', value: { value: String(contactId) } },
    ]));
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Api-Key': apiKey, 'Api-Appid': appId },
    });
    const json = await res.json() as { data?: Array<Record<string, unknown>> };
    const rows = json.data || [];
    const id = rows[0]?.id as string | number | undefined;
    return id ? String(id) : undefined;
  } catch (e) {
    console.error('[Receipt] findLatestInvoiceForContact errored:', e);
    return undefined;
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

    // FAILSAFE: log raw booking attempt the moment it lands — fire-and-forget
    // so a slow Slack webhook doesn't block checkout, but await it so the
    // log is sent before we call Ontraport. If Slack is down, we still try.
    await logRawBookingAttempt(body as unknown as Record<string, unknown>);

    const {
      packageId,
      packageName,
      packagePrice,
      addOns: selectedAddOnIds = [],
      addOnsTotal = 0,
      addOnsTotalPlan = 0,
      isFullPayment: bodyIsFullPayment = false,
      addonCohorts = {},
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
    // Effective per-addon price depends on whether the bundle is being paid
    // upfront (use addon.price) or on a plan (use paymentPlanPrice if set).
    // This makes the €200 upfront discount on Mat Pilates flow through to
    // f2306 (Pilates Course Price), f2294 (Total Course Cost), and the
    // Stripe-charged amount.
    const effectiveAddonPrice = (a: typeof selectedAddOns[number]): number =>
      bodyIsFullPayment ? a.price : (a.paymentPlanPrice ?? a.price);
    // Upfront sum (validates frontend's addOnsTotal); plan sum (validates frontend's addOnsTotalPlan)
    const serverAddOnsTotalUpfront = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const serverAddOnsTotalPlan    = selectedAddOns.reduce((sum, a) => sum + (a.paymentPlanPrice ?? a.price), 0);
    // The "actual" total paid for add-ons depends on isFullPayment
    const serverAddOnsTotal = bodyIsFullPayment ? serverAddOnsTotalUpfront : serverAddOnsTotalPlan;
    const clientReportedTotal = bodyIsFullPayment ? addOnsTotal : addOnsTotalPlan;
    if (selectedAddOnIds.length > 0 && Math.abs(serverAddOnsTotal - clientReportedTotal) > 0.5) {
      console.warn(`[Checkout] addOnsTotal mismatch (isFullPayment=${bodyIsFullPayment}): frontend=${clientReportedTotal} server=${serverAddOnsTotal} for ${email}`);
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

    // ── Term classification (Spring vs Autumn) ───────────────────────────
    // Rule: Aug → end of Jan (following year) = Autumn, anything else = Spring.
    // Term tracks the COURSE START date (not the booking date) — so a course
    // starting October booked in May is an Autumn sale, not Spring.
    // Jan edge case: courses starting in January are part of the prior
    // calendar year's Autumn term (e.g. course start Jan 2027 → A26).
    const termSource = startDate ? new Date(startDate) : new Date();
    const termMonth = termSource.getMonth() + 1; // 1..12
    const termCalendarYear = termSource.getFullYear();
    // Spring covers Feb–July; everything else (Aug–Jan) is Autumn.
    const isSpring = termMonth >= 2 && termMonth <= 7;
    // For January Autumn entries, anchor to the previous calendar year.
    const termAnchorYear = isSpring
      ? termCalendarYear
      : (termMonth === 1 ? termCalendarYear - 1 : termCalendarYear);
    const yearShort = String(termAnchorYear).slice(-2);
    const termPrefix = isSpring ? 'S' : 'A';
    const termCode = `${termPrefix}${yearShort}`;
    // Ontraport f2289 dropdown option IDs: Spring = 494, Autumn = 492
    const termOptionId = isSpring ? '494' : '492';

    // Map frontend values to Ontraport option IDs
    const locationOptionId = LOCATION_TO_ONTRAPORT[location] || '';
    const timetableOptionId = TIMETABLE_TO_ONTRAPORT[timetable] || '';
    const courseOptionId = PACKAGE_TO_ONTRAPORT_COURSE[packageId] || '';
    const packageOptionId = PACKAGE_TO_ONTRAPORT_PACKAGE[packageId] || '';
    const qualificationsOptionId = PACKAGE_TO_ONTRAPORT_QUALIFICATIONS[packageId] || '';

    const paymentPlanText = isFullPayment
      ? `Paid in Full — €${packagePrice}`
      : `€${depositAmount} deposit + €${monthlyPayment.toFixed(2)}/mo x ${months} months (billed 30th)`;

    // ── Step 1: Create/update Ontraport contact ──────────────────────────
    // Identity + course-enrolment fields go in here. Step 4 (post-payment)
    // adds the payment-plan-specific fields (deposit / monthly / instalment
    // dates) and qualification dropdown. The actual recurring billing is
    // gated on payment success in Step 2B — so writing course/location
    // here is informational, not the same as enrolling them in a paid plan.
    // CRITICAL: course/location/timetable MUST go in this step. If they
    // were deferred to Step 4 and that PUT silently fails, we lose all
    // enrolment context (root cause of the 7 May 2026 lost-data incident).
    const startDateUnix = startDate ? String(Math.floor(new Date(startDate).getTime() / 1000)) : '';
    const contactBody: Record<string, string> = {
      firstname: firstName,
      lastname: lastName,
      email,
      sms_number: phone,
      f1834: courseOptionId,            // New IFT Choose your course (dropdown option ID)
      f2291: locationOptionId,          // PT Course Location dropdown
      f2292: timetableOptionId,         // PT Course Timetable dropdown
      f2293: startDateUnix,             // Course Start Date (unix seconds)
      f1428: packageOptionId,           // Choose your Course / Package (dropdown — NOT free-text)
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

      // Pattern: free trial of `daysUntilFirstCharge` days at €0.00, then
      // monthly recurring at `monthlyPayment`. This is the only Ontraport
      // billing pattern that reliably defers the first real charge to a
      // specific date — `delay` + `chargeLater` was observed firing the first
      // charge on the next billing-engine cron tick instead of the 30th.
      //
      // Using `donotCharge` ensures the trial €0 is never billed (it just
      // shifts the recurring start). The deposit was already charged in
      // Step 2A; this is purely scheduling.
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
          trial: {
            price: '0.00',
            payment_count: daysUntilFirstCharge,
            unit: 'day',
          },
        }],
        subTotal: '0.00',
        grandTotal: '0.00',
        hasTaxes: false,
        hasShipping: false,
        delay: 0,
        invoice_template: INVOICE_TEMPLATE_ID,
        send_recurring_invoice: true,
      };

      const planTxnBody = {
        contact_id: Number(contactId),
        // donotCharge: create the subscription but don't charge anything now.
        // The €0 trial means nothing is charged until daysUntilFirstCharge days
        // have elapsed, at which point monthly billing begins.
        chargeNow: 'donotCharge',
        gateway_id: ONTRAPORT_GATEWAY_ID,
        offer: planOffer,
        payer: cardPayer,
      };

      const firstChargeDate = next30th.toISOString().slice(0, 10);
      console.log(`[Checkout] Scheduling recurring plan for ${email}: €${monthlyPayment} x ${months} months, first charge on ${firstChargeDate} (${daysUntilFirstCharge} days from now, via €0 trial)`);

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
          console.error(`[Checkout] ⚠️ Recurring plan creation FAILED for ${email} after deposit was charged. Manual setup needed in Ontraport. Response:`, JSON.stringify(planResult).slice(0, 800));
          // Continue — deposit is paid; support will fix the plan
        } else {
          console.log(`[Checkout] ✅ Recurring plan scheduled for ${email}, first charge on ${firstChargeDate}`);
        }
      } catch (e) {
        console.error(`[Checkout] ⚠️ Recurring plan request ERRORED for ${email} AFTER deposit was charged:`, e);
      }
    }

    // ════════════════════════════════════════════════════════════════════
    // ✅ PAYMENT SUCCESSFUL — now set tags, payment plan fields, etc.
    // ════════════════════════════════════════════════════════════════════

    console.log(`[Checkout] ✅ Payment successful for ${email}!`);

    // Extract invoice ID from the charge response for receipt + logs
    const txnData = (txnResult.data || {}) as Record<string, unknown>;
    let invoiceId = (txnData.invoice_id || txnData.id || txnResult.invoice_id) as string | number | undefined;

    // Fallback: if processManual didn't surface an invoice ID (happens
    // occasionally), look up the contact's most recent invoice. The deposit
    // we just charged should always have produced an invoice.
    if (!invoiceId) {
      console.warn(`[Checkout] No invoiceId in deposit response for ${email}; looking up by contact_id ${contactId}`);
      invoiceId = await findLatestInvoiceForContact(contactId);
      if (invoiceId) {
        console.log(`[Checkout] Resolved invoice ${invoiceId} for ${email} via contact lookup`);
      } else {
        console.error(`[Receipt-FAIL] Could NOT resolve any invoice for ${email} (contact ${contactId}) — receipt cannot be sent.`);
      }
    }

    // (Receipt email — moved below, after updateBody is fully built.)

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

    // ── Unified bundle add-on tracker ──────────────────────────────────
    // Generates the Ontraport field patch + tag IDs for EVERY selected
    // add-on (NutriCert, PPN, S&C, AI Workshop, Programming, Brand Launch,
    // Mat Pilates, Reformer Pilates). Replaces the previous per-add-on
    // inline code paths. Source of truth: lib/ontraport/addon-patch.ts.
    //
    // Patch is applied to updateBody below (where the contact PUT happens).
    // Tags are pushed into tagIds here so they go out with the single
    // tag-add call at /Contacts/tag.
    const addonPatchResult = buildAddonPatch({
      selectedAddOns,
      isFullPayment: bodyIsFullPayment,
      addonCohorts,
      paymentPlanText,
    });
    for (let i = 0; i < addonPatchResult.tags.length; i++) {
      tagIds.push(addonPatchResult.tags[i]);
      tagLabels.push(addonPatchResult.tagLabels[i]);
    }
    if (addonPatchResult.notes.length) {
      console.log(`[Checkout] Bundle add-on patch built for ${email}:\n  ${addonPatchResult.notes.join('\n  ')}`);
    }

    await fetch('https://api.ontraport.com/1/Contacts/tag', {
      method: 'PUT',
      headers: ontraportHeaders(),
      body: JSON.stringify({ ids: String(contactId), add_list: tagIds.join(',') }),
    });
    console.log(`[Checkout] Tags added: ${tagIds.join(', ')}`);

    // ── Step 4: Update contact with payment-plan + qualification details ───
    // Course / location / timetable / start-date / packageName were already
    // written by Step 1's saveorupdate (single round-trip, more reliable).
    // This step only adds fields that depend on the charge actually clearing.
    const updateBody: Record<string, string> = {
      id: contactId,
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

    // ── Apply bundle add-on patch (writes per-addon fields to updateBody) ─
    // This replaces the previous per-addon inline writes. The patch covers:
    //   NutriCert (f2329/f2330/f2332), PPN (f2323/f2324/f2326),
    //   S&C (f2317/f2318/f2319/f2321), AI for Coaches (f2612),
    //   Programming for Success (f2613), Brand Launch (f2611),
    //   Mat Pilates (f2302/f2303/f2304/f2305/f2306/f2309),
    //   Reformer Pilates (f2592–f2596/f2598).
    // Everything sourced from lib/ontraport/addon-patch.ts.
    Object.assign(updateBody, addonPatchResult.patch);

    // CRITICAL: capture the response so we know if this PUT actually
    // landed. The 7 May 2026 incident (Emily Doyle, contact 107136) was
    // caused by a silently-dropped PUT here — Slack fired correctly from
    // the in-memory variables but the contact's course fields stayed
    // empty. We now log the response, retry once on failure, and log
    // loudly if it still fails so support can be alerted.
    try {
      const updRes = await fetch('https://api.ontraport.com/1/Contacts', {
        method: 'PUT',
        headers: ontraportHeaders(),
        body: JSON.stringify(updateBody),
      });
      const updText = await updRes.text();
      let updJson: Record<string, unknown> = {};
      try { updJson = JSON.parse(updText); } catch { /* keep raw text */ }
      if (updJson.code !== undefined && updJson.code !== 0) {
        console.error(`[Checkout] ⚠️ Step 4 contact update FAILED for ${email} (contact ${contactId}). Retrying once. Response:`, updText.slice(0, 600));
        await new Promise((r) => setTimeout(r, 1000));
        const retryRes = await fetch('https://api.ontraport.com/1/Contacts', {
          method: 'PUT',
          headers: ontraportHeaders(),
          body: JSON.stringify(updateBody),
        });
        const retryText = await retryRes.text();
        let retryJson: Record<string, unknown> = {};
        try { retryJson = JSON.parse(retryText); } catch { /* keep raw */ }
        if (retryJson.code !== undefined && retryJson.code !== 0) {
          console.error(`[Checkout] 🚨 Step 4 contact update STILL FAILED after retry for ${email} (contact ${contactId}). Manual fix required in Ontraport. Body sent:`, JSON.stringify(updateBody), 'Response:', retryText.slice(0, 600));
        } else {
          console.log(`[Checkout] Step 4 retry succeeded for ${email}`);
        }
      }
    } catch (e) {
      console.error(`[Checkout] 🚨 Step 4 contact update threw for ${email} (contact ${contactId}):`, e);
    }

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

    // ── Step 6: Booking receipt — Email + Slack log + WhatsApp ──────────
    // 1) Email the rendered HTML receipt to the customer (via /1/message —
    //    the proven-working Ontraport endpoint; sendInvoice has been 404'ing).
    // 2) Slack receipt audit trail (every receipt sent, with deep link).
    // 3) WhatsApp booking confirmation (AiSensy template, if configured).
    // All non-blocking — the booking flow doesn't fail if any of these does.
    // Look up "what's included" for the chosen package, and stringify the
    // add-on list so the receipt itemises everything the customer bought.
    const lookupComponents = (label: string): string[] => {
      if (PACKAGE_COMPONENTS[label]) return PACKAGE_COMPONENTS[label];
      for (const key of ['The Business', 'The Career', 'The Cert']) {
        if (label.includes(key) && PACKAGE_COMPONENTS[key]) return PACKAGE_COMPONENTS[key];
      }
      return [];
    };
    const addOnLines = selectedAddOns.map(a => {
      const price = effectiveAddonPrice(a);
      return `${a.name} (€${price.toLocaleString('en-IE')})`;
    });

    const receiptInput: ReceiptInput = {
      receiptNo: `IFT-${currentYear}-${contactId}`,
      contactId: String(contactId),
      issuedDate: new Date().toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
      firstName,
      lastName,
      email,
      phone,
      packageName,                              // just the package name (e.g. "The Career") — add-ons go in their own section below
      intakeDate: startDate
        ? new Date(startDate).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : 'TBC',
      location: LOCATION_TO_LABEL[location] || location,
      schedule: TIMETABLE_TO_LABEL[timetable] || timetable,
      courseTotal: totalCourseValue,
      paidToday: depositAmount,
      monthlyAmount: monthlyPayment,
      months,
      firstInstalment: updateBody.f2607 || '',
      isFullPayment,
      brand: 'ift',
      packageComponents: lookupComponents(packageName),
      addOns: addOnLines,
    };
    sendReceiptEmail(receiptInput).catch(err => console.error('[Checkout] Receipt email error:', err));
    sendReceipt({ ...receiptInput, ontraportInvoiceId: invoiceId })
      .catch(err => console.error('[Checkout] Receipt send error:', err));

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
