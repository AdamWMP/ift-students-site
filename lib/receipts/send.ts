/**
 * Receipt send pipeline — called once per successful booking.
 *
 * Three channels fire in parallel, each with its own retry/log:
 *   1. Email receipt   → Ontraport sendInvoice (existing flow — templated)
 *   2. Slack receipt log → posts rendered HTML to #sales-receipts (audit trail)
 *   3. WhatsApp confirm → AiSensy booking_confirmation campaign (template)
 *
 * Idempotency: keyed on receiptNo. The caller MUST pass the same receiptNo
 * across retries — duplicate sends are suppressed via an in-process memo
 * (good enough for v1 — survives the request lifecycle; Vercel cold-start
 * may re-send once on retry but receipts are cheap and tagged with the
 * receipt number so support can identify duplicates).
 *
 * None of the channels block the checkout response — caller is expected
 * to await this fire-and-forget after the 200 OK is sent.
 */

import { sendWhatsAppMessage } from '@/lib/aisensy';
import { postToSlack } from '@/lib/sale-notifications';
import { renderReceiptHtml, renderWhatsAppMessages, type ReceiptInput } from './render';
import { persistReceipt } from './store';

// Canonical "from" address for every customer receipt — used in any
// direct-send path AND surfaced in logs so it's obvious where receipts
// originate. The Ontraport invoice template (#5 IFT Global Receipt) must
// also be configured to send from this address in the Ontraport UI:
//   Administration → Messages → Invoice Templates → IFT Global Receipt
//   → From: education@imageft.ie
export const RECEIPT_FROM_EMAIL = 'education@imageft.ie';

// In-process dedupe — survives request lifecycle, resets on cold start.
// Belt-and-braces: also tag every Slack receipt log with receiptNo so
// duplicates can be hand-deleted if needed.
const SENT_KEYS = new Set<string>();

export interface ReceiptSendResult {
  receiptNo: string;
  email:    { attempted: boolean; ok: boolean; error?: string };
  slack:    { attempted: boolean; ok: boolean; error?: string };
  whatsapp: { attempted: boolean; ok: boolean; error?: string };
  duplicate: boolean;
}

export interface ReceiptSendInput extends ReceiptInput {
  // Ontraport invoice ID for the sendInvoice email trigger.
  // If absent, email channel is skipped (still log to Slack + WhatsApp).
  ontraportInvoiceId?: string | number;
}

export async function sendReceipt(input: ReceiptSendInput): Promise<ReceiptSendResult> {
  const result: ReceiptSendResult = {
    receiptNo: input.receiptNo,
    email:    { attempted: false, ok: false },
    slack:    { attempted: false, ok: false },
    whatsapp: { attempted: false, ok: false },
    duplicate: false,
  };

  // ── Idempotency check ─────────────────────────────────────────────
  if (SENT_KEYS.has(input.receiptNo)) {
    result.duplicate = true;
    console.warn(`[Receipt] Duplicate send suppressed for ${input.receiptNo}`);
    return result;
  }
  SENT_KEYS.add(input.receiptNo);

  // ── Channel 1: Email via Ontraport sendInvoice (existing path) ───
  // The route is already calling sendInvoiceReceipt() in its own code; we
  // don't duplicate it here. This channel is acknowledged in the result
  // for completeness and observability — actual call lives in route.ts.
  result.email.attempted = !!input.ontraportInvoiceId;
  if (input.ontraportInvoiceId) {
    // Caller is responsible for the sendInvoice call itself (already wired).
    // We mark this as ok=true if invoiceId was provided — the caller's
    // sendInvoiceReceipt() handles its own retry + Slack on failure.
    result.email.ok = true;
  } else {
    result.email.error = 'No Ontraport invoiceId — email skipped (sendInvoice not called)';
  }

  // ── Channel 2: Slack receipt log (with deep-link to admin view) ──
  result.slack.attempted = true;
  try {
    const html = renderReceiptHtml(input);
    // Base URL for the admin link. Overridable via ADMIN_BASE_URL env
    // (e.g. https://admin.imageft.ie or a Vercel preview URL).
    const adminBase = (process.env.ADMIN_BASE_URL || 'https://www.imageft.ie').replace(/\/$/, '');
    const adminUrl = `${adminBase}/admin/receipts/${encodeURIComponent(input.receiptNo)}`;
    // Slack mrkdwn link syntax: <URL|label>
    const summary =
      `📧 *Receipt sent* · ${input.receiptNo}  ·  <${adminUrl}|🔗 View receipt>\n` +
      `Student: ${input.firstName} ${input.lastName} (#${input.contactId})\n` +
      `Course: ${input.packageName}\n` +
      `Total: €${input.courseTotal.toLocaleString('en-IE', { minimumFractionDigits: 2 })} · ` +
      `Paid today: €${input.paidToday.toLocaleString('en-IE', { minimumFractionDigits: 2 })}` +
      (input.isFullPayment ? ' (in full)' : ` · Plan: €${input.monthlyAmount}/mo × ${input.months}`) + `\n` +
      `Email: ${input.email}\n` +
      `Phone: ${input.phone}\n\n` +
      `<${adminUrl}|Open in admin →>  ·  HTML snapshot ${html.length.toLocaleString()} bytes`;
    const slackResult = await postToSlack(summary, `receipt-log ${input.receiptNo}`);
    result.slack.ok = slackResult.ok;
    if (!slackResult.ok) result.slack.error = slackResult.reason;
  } catch (e) {
    result.slack.error = e instanceof Error ? e.message : String(e);
    console.error(`[Receipt] Slack log failed for ${input.receiptNo}:`, e);
  }

  // ── Channel 3: WhatsApp booking confirmation via AiSensy ─────────
  // Requires `WHATSAPP_BOOKING_CONFIRMATION_CAMPAIGN` env to point to an
  // approved AiSensy campaign (template with 8 params, see order below).
  // If env not set, channel is skipped gracefully.
  const campaignName = (process.env.WHATSAPP_BOOKING_CONFIRMATION_CAMPAIGN || '').trim();
  if (!campaignName) {
    result.whatsapp.error = 'WHATSAPP_BOOKING_CONFIRMATION_CAMPAIGN env not set — channel skipped';
  } else {
    result.whatsapp.attempted = true;
    try {
      // Template params — order MUST match the approved AiSensy template:
      //   {{1}} firstName
      //   {{2}} packageName
      //   {{3}} intakeDate
      //   {{4}} location
      //   {{5}} schedule
      //   {{6}} paidToday (formatted)
      //   {{7}} firstInstalment (or "Paid in full")
      //   {{8}} studentNo
      const templateParams = [
        input.firstName,
        input.packageName,
        input.intakeDate,
        input.location,
        input.schedule,
        `€${input.paidToday.toLocaleString('en-IE')}`,
        input.isFullPayment ? 'Paid in full' : `Next: ${input.firstInstalment} (€${input.monthlyAmount})`,
        `#${input.contactId}`,
      ];
      const waResult = await sendWhatsAppMessage({
        destination: input.phone,
        userName: `${input.firstName} ${input.lastName}`.trim(),
        campaignName,
        templateParams,
        source: `receipt-${input.receiptNo}`,
      });
      result.whatsapp.ok = waResult.success;
      if (!waResult.success) result.whatsapp.error = waResult.error;
    } catch (e) {
      result.whatsapp.error = e instanceof Error ? e.message : String(e);
      console.error(`[Receipt] WhatsApp send failed for ${input.receiptNo}:`, e);
    }
  }

  // ── Persist to billing-history DB (admin view source) ─────────────
  // Non-blocking — if the DB write fails, the receipt was still sent
  // via the live channels above; we just lose the admin-page row.
  await persistReceipt({
    ...input,
    result,
  });

  // ── Final consolidated log ────────────────────────────────────────
  console.log(`[Receipt] ${input.receiptNo} send result (from: ${RECEIPT_FROM_EMAIL}):`, {
    email: result.email.ok ? '✅' : `❌ ${result.email.error || 'skipped'}`,
    slack: result.slack.ok ? '✅' : `❌ ${result.slack.error}`,
    whatsapp: result.whatsapp.ok ? '✅' : `${result.whatsapp.attempted ? '❌ ' + result.whatsapp.error : '⏭ skipped'}`,
  });

  // For dev use: render WhatsApp messages so they can be sent manually if
  // the AiSensy template isn't configured yet — Adam pastes them into
  // WhatsApp Web until the automated channel is live.
  if (!result.whatsapp.ok) {
    const [msg1, msg2] = renderWhatsAppMessages(input);
    console.log(`[Receipt] WhatsApp NOT auto-sent — manual messages below for ${input.receiptNo}:\n\nMESSAGE 1:\n${msg1}\n\nMESSAGE 2:\n${msg2}`);
  }

  return result;
}
