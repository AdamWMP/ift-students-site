/**
 * Receipt source-of-truth: Ontraport.
 *
 * SQLite-on-Vercel is unreliable for persistence, so instead of maintaining
 * a separate receipt log we query Ontraport directly — every paid booking
 * is already a contact there with all the fields we need:
 *
 *   id (= student no.) · firstname · lastname · email · sms_number
 *   f2290 PT qualification    f2302 Pilates qualification
 *   f2291 PT location         f2303 Pilates location
 *   f2292 PT timetable        f2304 Pilates timetable
 *   f2293 PT start date       f2305 Pilates start date  (unix)
 *   f2294 PT total            f2306 Pilates total
 *   f2604 Deposit             f2605 Monthly  f2606 Months  f2607 First instalment
 *
 * This file isolates the Ontraport coupling. The admin pages stay simple:
 *   listRecentReceipts({ search?, limit?, brand? })
 *   getReceiptByContactId(contactId)
 */

import type { ReceiptInput } from './render';
import { PACKAGE_COMPONENTS } from './render';

// Receipt no. format used at send time: "IFT-{year}-{contactId}". We use
// the same here so the list/detail URLs match what's posted in Slack.
export const RECEIPT_NO_FOR = (year: number | string, contactId: string | number) =>
  `IFT-${year}-${contactId}`;

export interface ReceiptListRow {
  receiptNo: string;
  contactId: string;
  brand: 'ift' | 'pilates';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  packageName: string;
  location: string;
  intakeDate: string;
  paidToday: number;
  courseTotal: number;
  remainingBalance: number;
  monthlyAmount: number;
  months: number;
  isFullPayment: boolean;
  modifiedAt: Date;
}

// ─── Ontraport dropdown reverse maps (option ID → label) ─────────────
// Sourced from get_object_meta(0) on 2026-05-27.
const PT_QUALIFICATION: Record<string, string> = {
  '495': '(Launchpad Bundle) Fitness Instructor & Personal Trainer',
  '496': 'Group Instructor & Personal Trainer',
  '497': 'The Cert (Fitness Instructor, Group Instructor, Personal Trainer)',
  '540': 'High Performance Bundle (Fitness, PT, S&C)',
  '564': 'Launchpad & The Fitness Business Accelerator',
  '565': 'Leader & The Fitness Business Accelerator',
  '566': 'Group Instruction Only',
  '567': 'Personal Trainer Course Only',
  '568': 'Fitness Business Accelerator Only',
  '569': 'The Career (Fitness, Group, PT, Nutrition, Fitness Business Accelerator)',
  '570': 'Online Coaching Course',
  '627': 'The Business (FI, GI, PT, Nutrition, FBA + AI & Programming Workshops + Brand Launch)',
};
const PT_LOCATION: Record<string, string> = {
  '498': 'Wexford', '499': 'Limerick', '500': 'Galway', '501': 'Cork',
  '502': 'Dublin — Tallaght', '503': 'Dublin — Swords', '544': 'Online', '563': 'Belfast',
};
const PT_TIMETABLE: Record<string, string> = {
  '504': 'Saturday (16 Weeks)',
  '505': 'Thursday & Friday (8 Weeks)',
  '506': 'Monday & Tuesday (8 Weeks)',
  '539': 'Monday & Wednesday Evenings (16 Weeks)',
  '597': 'Evening & Weekend — Mon + Wed + Sat (8 Weeks)',
  '633': 'Sunday (16 Weeks)',
};
const PILATES_QUALIFICATION: Record<string, string> = {
  '512': 'The Cert (Mat Pilates Instructor EQF Level 4)',
  '599': 'Reformer Pilates Instructor Course',
  '624': 'The Career (Mat + Reformer)',
};
const PILATES_LOCATION: Record<string, string> = {
  '513': 'Galway', '514': 'Cork', '515': 'Dublin — Tallaght',
  '516': 'Dublin — Swords', '634': 'Online', '635': 'Derry',
};
const PILATES_TIMETABLE: Record<string, string> = {
  '517': 'Bi-Weekly Saturdays',
  '518': 'Bi-Weekly Evenings',
  '598': 'Tuesday + Thursday Evenings Online',
  '600': 'Bi-Weekly Sat & Sun (Reformer Only)',
  '601': '3-Weekend Intensive',
  '625': 'Bi-Weekly Sat + 3-Weekend Intensive (Mat + Reformer)',
};

// ─── Ontraport API helper ────────────────────────────────────────────
function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

interface OntraportContact {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  sms_number?: string;
  // PT
  f2290?: string; f2291?: string; f2292?: string;
  f2293?: string; // unix
  f2294?: string;
  // Pilates
  f2302?: string; f2303?: string; f2304?: string;
  f2305?: string; // unix
  f2306?: string;
  // Reformer (cohort + price)
  f2592?: string; f2593?: string; f2594?: string;
  f2595?: string; // unix
  f2596?: string;
  // Payment plan
  f2604?: string; f2605?: string; f2606?: string; f2607?: string;
  // Add-on flag fields (boolean checks: 'true' / 'false' / empty)
  f2611?: string; // Brand Launch Photoshoot
  f2612?: string; // AI for Coaches
  f2613?: string; // Programming for Success
  f2614?: string; // FBA Enrolled
  f2620?: string; // Pregnancy Pilates Workshop
  f2621?: string; // Studio Cycle
  f2622?: string; // HYROX Simulation
  f2623?: string; // GroupBox
  // Add-on enum fields (dropdown ID populated when bought)
  f2329?: string; f2330?: string; // NutriCert (course=530, price)
  f2323?: string; f2324?: string; // PPN (course=529, price)
  f2318?: string; f2319?: string; // S&C (course=528, price)
  // Metadata
  dlm?: string; // unix string of last modified
  [key: string]: unknown;
}

// Add-on flag field → human-readable label for the receipt.
function detectAddOns(c: OntraportContact): string[] {
  const out: string[] = [];
  // Boolean check fields
  if (c.f2614 === 'true') out.push('Fitness Business Accelerator');
  if (c.f2612 === 'true') out.push('AI for Coaches Workshop');
  if (c.f2613 === 'true') out.push('Programming for Success Workshop');
  if (c.f2611 === 'true') out.push('Brand Launch Photoshoot');
  if (c.f2621 === 'true') out.push('Studio Cycle Workshop');
  if (c.f2622 === 'true') out.push('HYROX Simulation Workshop');
  if (c.f2623 === 'true') out.push('GroupBox Workshop');
  if (c.f2620 === 'true') out.push('Pregnancy Pilates Workshop');
  // Enum / dropdown fields (populated when the matching course is bought)
  if (c.f2329 === '530') out.push(`NutriCert Global${c.f2330 ? ` (€${Number(c.f2330).toLocaleString('en-IE')})` : ''}`);
  if (c.f2323 === '529') out.push(`Pre & Post Natal Course${c.f2324 ? ` (€${Number(c.f2324).toLocaleString('en-IE')})` : ''}`);
  if (c.f2318 === '528') out.push(`Strength & Conditioning Course${c.f2319 ? ` (€${Number(c.f2319).toLocaleString('en-IE')})` : ''}`);
  // Pilates add-ons (Mat / Reformer added through PT checkout)
  // Only surface here if the contact's MAIN booking is NOT already a Mat
  // Cert (otherwise it'd be redundant — the package itself is Mat).
  const isPilatesMainBooking = (c.f2302 && c.f2302 !== '0');
  if (c.f2302 === '512' && !isPilatesMainBooking) out.push(`Mat Pilates Instructor (The Cert)${c.f2306 ? ` (€${Number(c.f2306).toLocaleString('en-IE')})` : ''}`);
  if (c.f2592 === '619') out.push(`Reformer Pilates Instructor (CPD)${c.f2596 ? ` (€${Number(c.f2596).toLocaleString('en-IE')})` : ''}`);
  return out;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function unixToHumanDate(unix?: string): string {
  if (!unix) return 'TBC';
  const n = Number(unix);
  if (!n || isNaN(n)) return 'TBC';
  // Some Ontraport fields store dates as YYYY-MM-DD strings already
  if (String(unix).match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(unix).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  return new Date(n * 1000).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function num(x: unknown): number {
  if (x == null) return 0;
  const n = Number(x);
  return isFinite(n) ? n : 0;
}

function deriveBrand(c: OntraportContact): 'ift' | 'pilates' {
  // If Pilates fields are populated and PT fields aren't → Pilates booking.
  const hasPilates = !!(c.f2302 && c.f2302 !== '0') || !!(c.f2306 && num(c.f2306) > 0);
  const hasPt      = !!(c.f2290 && c.f2290 !== '0') || !!(c.f2294 && num(c.f2294) > 0);
  if (hasPilates && !hasPt) return 'pilates';
  return 'ift';
}

function buildSummary(c: OntraportContact): ReceiptListRow {
  const brand = deriveBrand(c);
  const isPilates = brand === 'pilates';
  const packageLabel = isPilates
    ? (PILATES_QUALIFICATION[c.f2302 || ''] || 'Pilates Course')
    : (PT_QUALIFICATION[c.f2290 || ''] || 'PT Course');
  const location = isPilates
    ? (PILATES_LOCATION[c.f2303 || ''] || '—')
    : (PT_LOCATION[c.f2291 || ''] || '—');
  const intakeDate = isPilates
    ? unixToHumanDate(c.f2305)
    : unixToHumanDate(c.f2293);
  // courseTotal — main fields first, but for Pilates the standalone
  // checkout may not have written f2306; in that case fall back to the
  // rollup-only data (mrcAmount last charge + remaining balance estimate).
  let courseTotal = isPilates ? num(c.f2306) : num(c.f2294);
  // paidToday — f2604 is the PT-checkout's "deposit" field. The Pilates
  // checkout (pilates_checkout/) does NOT write f2604, so for Pilates
  // bookings we fall back to: mrcAmount (last charge), or the Pilates Spent
  // rollup, or the invoice total. This is critical for Amy Farrell-style
  // bookings where f2604 = 0 but €300 was actually paid.
  let paidToday = num(c.f2604);
  if (paidToday === 0) {
    paidToday = num(c.mrcAmount) || num(c.f2335) || num(c.spent) || num(c.mriInvoiceTotal);
  }
  if (courseTotal === 0 && isPilates) {
    // Derive course total from the qualification ID when field is empty:
    //   The Career = €3,500 (current standard pricing as of 2026-04-01)
    //   The Cert   = €1,800 standalone / €2,000 on plan — assume plan default
    //   Reformer   = €1,000
    const qualId = c.f2302 || '';
    if (qualId === '624') courseTotal = 3500;         // The Career
    else if (qualId === '512') courseTotal = 2000;   // The Cert (plan)
    else if (qualId === '599') courseTotal = 1000;   // Reformer
  }
  const monthlyAmount = num(c.f2605);
  const months = Math.round(num(c.f2606));
  const remainingBalance = Math.max(0, courseTotal - paidToday);
  const isFullPayment = paidToday >= courseTotal && courseTotal > 0;
  const modifiedAt = c.dlm ? new Date(num(c.dlm) * 1000) : new Date();
  const dateAdded = c.date ? new Date(num(c.date as unknown as string) * 1000) : modifiedAt;
  // Year for receipt no. — taken from the booking date_added so it stays
  // stable even if the contact is updated later.
  const year = dateAdded.getFullYear();
  return {
    receiptNo: RECEIPT_NO_FOR(year, c.id),
    contactId: String(c.id),
    brand,
    firstName: c.firstname || '',
    lastName: c.lastname || '',
    email: c.email || '',
    phone: c.sms_number || '',
    packageName: packageLabel,
    location,
    intakeDate,
    paidToday,
    courseTotal,
    remainingBalance,
    monthlyAmount,
    months,
    isFullPayment,
    modifiedAt,
  };
}

function toReceiptInput(c: OntraportContact): ReceiptInput {
  const summary = buildSummary(c);
  const isPilates = summary.brand === 'pilates';
  const schedule = isPilates
    ? (PILATES_TIMETABLE[c.f2304 || ''] || '—')
    : (PT_TIMETABLE[c.f2292 || ''] || '—');

  // Components for the chosen package — short-bullet list of everything
  // included. Looked up by name; falls back to the bundled-tier package
  // when the Ontraport label is the long form (e.g. "The Career (Fitness,
  // Group, PT, Nutrition, Fitness Business Accelerator)").
  const lookupComponents = (label: string): string[] => {
    if (PACKAGE_COMPONENTS[label]) return PACKAGE_COMPONENTS[label];
    // Heuristic match — find the simplest package name contained in the label
    for (const key of ['The Business', 'The Career', 'The Cert', 'Reformer Pilates Instructor Course']) {
      if (label.includes(key) && PACKAGE_COMPONENTS[key]) return PACKAGE_COMPONENTS[key];
    }
    return [];
  };

  return {
    receiptNo: summary.receiptNo,
    contactId: summary.contactId,
    issuedDate: summary.modifiedAt.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
    firstName: summary.firstName,
    lastName: summary.lastName,
    email: summary.email,
    phone: summary.phone,
    packageName: summary.packageName,
    intakeDate: summary.intakeDate,
    location: summary.location,
    schedule,
    courseTotal: summary.courseTotal,
    paidToday: summary.paidToday,
    monthlyAmount: summary.monthlyAmount,
    months: summary.months,
    firstInstalment: c.f2607 || '',
    isFullPayment: summary.isFullPayment,
    brand: summary.brand,
    packageComponents: lookupComponents(summary.packageName),
    addOns: detectAddOns(c),
  };
}

// ─── Public API ──────────────────────────────────────────────────────

export interface ListReceiptsOptions {
  search?: string;
  brand?: 'ift' | 'pilates';
  limit?: number;
}

/**
 * List recent bookings (contacts that have made a deposit), newest first.
 * Filtered by `f2604 IS NOT EMPTY` to surface only paid bookings.
 */
export async function listRecentReceipts(opts: ListReceiptsOptions = {}): Promise<ReceiptListRow[]> {
  const { search, limit = 100 } = opts;

  // Ontraport condition: f2604 (Deposit Amount) IS NOT EMPTY
  // — gives us every contact that has made a paid booking.
  // If `search` is provided, we filter client-side after the fetch to avoid
  // building complex IN/LIKE conditions for the multiple fields.
  const condition = encodeURIComponent(
    JSON.stringify([
      { field: { field: 'f2604' }, op: 'IS NOT EMPTY' },
    ])
  );
  const range = Math.min(limit, 50); // Ontraport caps at 50/page
  const url =
    `https://api.ontraport.com/1/Contacts` +
    `?condition=${condition}` +
    `&sort=dlm&sortDir=desc&range=${range}&listFields=` +
    encodeURIComponent([
      'id', 'firstname', 'lastname', 'email', 'sms_number',
      'f2290', 'f2291', 'f2292', 'f2293', 'f2294',
      'f2302', 'f2303', 'f2304', 'f2305', 'f2306',
      'f2592', 'f2593', 'f2594', 'f2595', 'f2596',
      'f2604', 'f2605', 'f2606', 'f2607',
      // Add-on flags (boolean checks) + dropdowns
      'f2611', 'f2612', 'f2613', 'f2614',
      'f2620', 'f2621', 'f2622', 'f2623',
      'f2329', 'f2330', 'f2323', 'f2324', 'f2318', 'f2319',
      'dlm', 'date',
      // Payment rollups — used as fallback when checkout didn't write deposit/total
      'mrcAmount', 'mriInvoiceTotal', 'mriInvoiceNum', 'f2335', 'spent',
    ].join(','));

  const res = await fetch(url, { headers: ontraportHeaders(), cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Ontraport list failed: ${res.status} ${await res.text().then(t => t.slice(0, 200))}`);
  }
  const json = await res.json() as { data?: OntraportContact[] };
  const contacts = json.data || [];

  let rows = contacts.map(buildSummary);

  // Client-side filtering for brand + search keeps the query simple
  if (opts.brand) rows = rows.filter(r => r.brand === opts.brand);
  if (search) {
    const needle = search.toLowerCase().trim();
    rows = rows.filter(r =>
      r.firstName.toLowerCase().includes(needle) ||
      r.lastName.toLowerCase().includes(needle) ||
      r.email.toLowerCase().includes(needle) ||
      r.contactId.toLowerCase().includes(needle) ||
      r.receiptNo.toLowerCase().includes(needle) ||
      (r.phone || '').toLowerCase().includes(needle)
    );
  }

  return rows.slice(0, limit);
}

/**
 * Fetch a single contact by ID and convert to ReceiptInput so the
 * detail page can render the same HTML the customer saw.
 */
export async function getReceiptByContactId(contactId: string | number): Promise<ReceiptInput | null> {
  const url = `https://api.ontraport.com/1/Contact?id=${encodeURIComponent(String(contactId))}`;
  const res = await fetch(url, { headers: ontraportHeaders(), cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json() as { data?: OntraportContact };
  if (!json.data || !json.data.id) return null;
  return toReceiptInput(json.data);
}

/** Convenience: extract the contact ID portion from "IFT-2026-12345" → "12345". */
export function contactIdFromReceiptNo(receiptNo: string): string | null {
  const m = receiptNo.match(/-(\d+)$/);
  return m ? m[1] : null;
}
