/**
 * Receipt renderer — produces the slim transactional HTML receipt
 * (mirror of booking-confirmation-mockups/02-receipt-email.html).
 *
 * Pure function, no side effects. Caller decides where the rendered
 * string goes (email body, snapshot storage, Slack debug, etc).
 *
 * Receipt content is intentionally minimal per Adam's review:
 *   - Student details (no. = Ontraport contact id, name, email, phone)
 *   - Course (package, intake, location, schedule)
 *   - Payment summary (total, paid today, remaining)
 *   - Payment plan (monthly, months, first instalment)
 *   - No itemised line items, no marketing copy, no journey map.
 *
 * The matching warm/motivational thank-you page lives elsewhere
 * (booking-confirmation-mockups/01-thankyou-page.html → real route TBD).
 */

export interface ReceiptInput {
  // Identifiers
  receiptNo: string;                  // e.g. "IFT-2026-108318"
  contactId: string | number;         // Ontraport contact id = student no.
  issuedDate: string;                 // human-readable, e.g. "27 May 2026"

  // Student
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Course
  packageName: string;                // e.g. "The Career — Personal Trainer Course"
  intakeDate: string;                 // human-readable, e.g. "Thursday, 2 July 2026"
  location: string;                   // e.g. "Dublin — Tallaght"
  schedule: string;                   // e.g. "Thursdays + Fridays · 8-week intensive"

  // Payment
  courseTotal: number;                // €
  paidToday: number;                  // €
  monthlyAmount: number;              // € per month
  months: number;
  firstInstalment: string;            // "30 June 2026" — empty if paid in full
  cardLast4?: string;                 // optional
  isFullPayment: boolean;

  // Brand variant — Pilates uses ivory theme, IFT uses dark
  brand?: 'ift' | 'pilates';

  // ─── What was actually bought ────────────────────────────────────
  // packageComponents — for bundled packages like The Career / The Business,
  //   list each individual qualification/asset the student gets. Pulled
  //   from PACKAGE_COMPONENTS below (or passed in by the caller).
  packageComponents?: string[];
  // addOns — extra items purchased on top of the package (NutriCert, PPN,
  //   Mat Pilates, AI for Coaches, etc). Each item is the human-readable
  //   label as it should appear on the receipt.
  addOns?: string[];
}

// ─── Package → included components mapping ──────────────────────────
// What a student actually gets when they buy each PT/Pilates package.
// Used by the receipt so customers can see exactly what they paid for.
export const PACKAGE_COMPONENTS: Record<string, string[]> = {
  // PT bundles
  'The Cert': [
    'Fitness Instruction (EQF Level 3)',
    'Group Fitness Instruction',
    'Personal Training (EQF Level 4)',
    'Nutrition Diploma',
    'REPs Ireland accreditation',
  ],
  'The Career': [
    'Everything in The Cert',
    '3–4 week live job placement',
    'Fitness Business Accelerator — Phase 1',
    '6 months free in The Floor (graduate community)',
    'Graded result: Pass / Merit / Distinction',
  ],
  'The Business': [
    'Everything in The Career',
    'Fitness Business Accelerator — Phase 2',
    'Professional brand photoshoot (Brand Launch)',
    'AI for Coaches workshop',
    'Programming for Success workshop',
    'Priority placement through 200+ partner network',
  ],
  // Pilates bundles
  'The Cert (Mat Pilates Instructor EQF Level 4)': [
    'Mat Pilates Instructor qualification (EQF Level 4)',
    'Body-Flow Method certification',
    '38+ mat exercises (classical + contemporary)',
    'Pregnancy Pilates workshop',
    'Special populations module',
  ],
  'The Career (Mat + Reformer)': [
    'Everything in the Mat Cert',
    'Full Reformer repertoire',
    'Studio class programming + small group teaching',
    'Reformer Pilates CPD certification',
  ],
  'Reformer Pilates Instructor Course': [
    'Reformer Pilates CPD',
    'Full studio reformer repertoire',
    'Class programming + small group teaching',
  ],
};

const BRAND_CFG = {
  ift: {
    name: 'Image Fitness Training',
    domain: 'imageft.ie',
    bg: '#0a0a0a', card: '#161616', text: '#f5f5f5', mute: '#a9a9a9',
    gold: '#D4A836', border: 'rgba(212,168,54,0.10)', line: 'rgba(255,255,255,0.06)',
    invoicePrefix: 'IFT',
  },
  pilates: {
    name: 'Image Pilates',
    domain: 'imagepilates.ie',
    bg: '#FFFFFF', card: '#FAF8F5', text: '#1a1a1a', mute: '#6B6660',
    gold: '#B8922E', border: 'rgba(184,146,46,0.18)', line: 'rgba(26,26,26,0.06)',
    invoicePrefix: 'IPC',
  },
} as const;

/**
 * Render the receipt as a self-contained HTML email body (inline CSS,
 * table layout, email-client safe).
 */
export function renderReceiptHtml(input: ReceiptInput): string {
  const brand = BRAND_CFG[input.brand || 'ift'];
  const remaining = Math.max(0, input.courseTotal - input.paidToday);
  const fullName = `${input.firstName} ${input.lastName}`.trim();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Receipt ${escapeHtml(input.receiptNo)} — ${brand.name}</title>
</head>
<body style="margin:0;padding:0;background:#efece6;font-family:'Inter',Arial,sans-serif;-webkit-text-size-adjust:100%;">
<div style="display:none;font-size:1px;color:#efece6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  Receipt for your ${brand.name} booking — keep this for your records.
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#efece6;">
  <tr><td align="center" style="padding:40px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:${brand.bg};border-radius:16px;overflow:hidden;">

      <tr><td style="padding:24px 32px 18px;border-bottom:1px solid ${brand.line};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:700;letter-spacing:0.04em;color:${brand.gold};line-height:1;">${brand.name.toUpperCase()}</div>
              <div style="font-size:10px;letter-spacing:0.18em;color:${brand.mute};margin-top:8px;text-transform:uppercase;">Booking Receipt</div>
            </td>
            <td align="right" valign="top">
              <div style="font-size:11px;color:${brand.mute};letter-spacing:0.04em;">No. <span style="color:${brand.text};font-weight:600;">${escapeHtml(input.receiptNo)}</span></div>
              <div style="font-size:11px;color:${brand.mute};letter-spacing:0.04em;margin-top:4px;">Issued ${escapeHtml(input.issuedDate)}</div>
            </td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="padding:24px 32px 4px;">
        <h1 style="margin:0;color:${brand.text};font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:600;line-height:1.2;">
          Your booking is confirmed, ${escapeHtml(input.firstName)}.
        </h1>
        <p style="margin:8px 0 0;color:${brand.mute};font-size:14px;line-height:1.6;">
          Below is your official receipt. Keep this for your records — quote
          your student number on any future correspondence.
        </p>
      </td></tr>

      ${block(brand, 'Student Details', [
        ['Student no.', `#${input.contactId}`],
        ['Name', fullName],
        ['Email on file', input.email],
        ['Phone on file', input.phone],
      ])}

      ${block(brand, 'Course', [
        ['Package', input.packageName],
        ['Intake date', input.intakeDate],
        ['Location', input.location],
        ['Schedule', input.schedule],
      ])}

      ${input.packageComponents && input.packageComponents.length > 0
        ? listBlock(brand, 'What\'s Included In Your Package', input.packageComponents)
        : ''}

      ${input.addOns && input.addOns.length > 0
        ? listBlock(brand, 'Add-Ons Purchased', input.addOns)
        : ''}

      ${block(brand, 'Payment Summary', [
        ['Course total', `€${input.courseTotal.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`],
        ['Paid today' + (input.isFullPayment ? ' (in full)' : ' (deposit)'),
          `€${input.paidToday.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`],
        ['Remaining balance', `€${remaining.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`],
      ], { highlightLast: !input.isFullPayment })}

      ${!input.isFullPayment ? block(brand, 'Payment Plan', [
        ['Monthly amount', `€${input.monthlyAmount.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`],
        ['Number of months', String(input.months)],
        ['First instalment', input.firstInstalment],
        ['Billing date', '30th of each month'],
        ...(input.cardLast4 ? [['Card on file', `Visa •••• ${input.cardLast4}`] as [string, string]] : []),
      ]) : ''}

      <tr><td style="padding:18px 32px 6px;">
        <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
          Need to adjust a date or update your card? Reply to this email or message
          <a href="https://wa.me/353866003667" style="color:${brand.gold};text-decoration:none;">+353 86 600 3667</a>
          on WhatsApp at least 3 working days before the next charge.
        </p>
      </td></tr>

      <tr><td style="padding:26px 32px 28px;color:#666;font-size:11px;line-height:1.7;border-top:1px solid ${brand.line};">
        <strong style="color:${brand.mute};">Image Education Ltd</strong> · REPs Ireland accredited<br>
        <a href="https://${brand.domain}" style="color:${brand.gold};text-decoration:none;">${brand.domain}</a> ·
        <a href="mailto:education@imageft.ie" style="color:${brand.gold};text-decoration:none;">education@imageft.ie</a> ·
        <a href="https://wa.me/353866003667" style="color:${brand.gold};text-decoration:none;">WhatsApp</a>
        <br><br>
        Transactional receipt — sent automatically and stored on your student file.
        Quote student no. <strong style="color:${brand.mute};">#${input.contactId}</strong> on any future correspondence.
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/* ── helpers ─────────────────────────────────────────────────────── */

function block(
  brand: typeof BRAND_CFG.ift,
  heading: string,
  rows: Array<[string, string]>,
  opts: { highlightLast?: boolean } = {},
): string {
  const rowsHtml = rows.map(([label, val], i) => {
    const isLast = i === rows.length - 1;
    const valStyle = isLast && opts.highlightLast
      ? `padding:14px 18px;color:${brand.gold};font-size:20px;font-weight:800;border-top:${i > 0 ? `1px solid ${brand.line}` : '0'};text-align:right;`
      : `padding:14px 18px;color:${brand.text};font-size:14px;font-weight:600;border-top:${i > 0 ? `1px solid ${brand.line}` : '0'};text-align:right;`;
    return `<tr>
      <td style="padding:14px 18px;color:${brand.mute};font-size:13px;width:160px;border-top:${i > 0 ? `1px solid ${brand.line}` : '0'};">${escapeHtml(label)}</td>
      <td style="${valStyle}">${escapeHtml(val)}</td>
    </tr>`;
  }).join('');

  return `<tr><td style="padding:18px 32px 0;">
    <div style="font-size:10px;letter-spacing:0.18em;color:${brand.gold};text-transform:uppercase;font-weight:700;margin-bottom:10px;">
      ${escapeHtml(heading)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:${brand.card};border:1px solid ${brand.border};border-radius:12px;">
      ${rowsHtml}
    </table>
  </td></tr>`;
}

function listBlock(
  brand: typeof BRAND_CFG.ift,
  heading: string,
  items: string[],
): string {
  const rowsHtml = items.map((item, i) => `
    <tr>
      <td style="padding:12px 18px;color:${brand.text};font-size:14px;border-top:${i > 0 ? `1px solid ${brand.line}` : '0'};">
        <span style="color:${brand.gold};font-weight:700;margin-right:10px;">✓</span> ${escapeHtml(item)}
      </td>
    </tr>
  `).join('');
  return `<tr><td style="padding:18px 32px 0;">
    <div style="font-size:10px;letter-spacing:0.18em;color:${brand.gold};text-transform:uppercase;font-weight:700;margin-bottom:10px;">
      ${escapeHtml(heading)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:${brand.card};border:1px solid ${brand.border};border-radius:12px;">
      ${rowsHtml}
    </table>
  </td></tr>`;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Companion plain-text WhatsApp confirmation — 2-message script.
 * Message 1 = booking summary; Message 2 = next steps + save number.
 * Caller sends these as separate WhatsApp messages ~2s apart.
 */
export function renderWhatsAppMessages(input: ReceiptInput): [string, string] {
  const brand = input.brand === 'pilates' ? 'Image Pilates' : 'Image Fitness Training';
  const planLine = input.isFullPayment
    ? `💳 *Paid in full today:* €${input.paidToday.toLocaleString('en-IE')}`
    : `💳 *Charged today:* €${input.paidToday.toLocaleString('en-IE')}\n📆 *Next charge:* ${input.firstInstalment} (€${input.monthlyAmount.toLocaleString('en-IE')})\n📋 *Plan:* €${input.monthlyAmount.toLocaleString('en-IE')} × ${input.months} months`;

  const msg1 = `Hi ${input.firstName}! 👋

It's Adam from ${brand} — welcome to the family.

Your place on *${input.packageName}* is officially booked in. Here's the summary:

📚 *Course:* ${input.packageName}
📅 *First class:* ${input.intakeDate}
📍 *Location:* ${input.location}
🕙 *Schedule:* ${input.schedule}

${planLine}
🧾 *Student no.:* #${input.contactId}

Your full receipt and schedule is in your inbox 📧
(${input.email} — check spam if it's not there in 5 mins).`;

  const msg2 = `What happens next 👇

1. Within 48 hours, your tutor will add you to your cohort WhatsApp group.

2. Two weeks before intake we'll send your kit list and student portal login.

3. Save this number 📲 — for anything about your course, payment plan, or schedule. For email queries, write to education@imageft.ie.

This is the start. 16 years. 5,000+ coaches. We're excited to walk this one with you 💪

— Adam & the ${brand} team`;

  return [msg1, msg2];
}
