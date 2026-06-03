/**
 * Receipt email sender — uses Ontraport's `/1/message` POST endpoint,
 * which is the SAME endpoint the existing sales-notification flow uses
 * to email sales@imageft.ie (proven working in production).
 *
 * This replaces the broken `/transaction/sendInvoice` PUT call which has
 * been returning HTTP 404 "Invalid path and/or method" — that endpoint
 * either changed on Ontraport's side or was never the right one.
 *
 * The "from" address is the Ontraport account-level default. To make
 * receipts come from education@imageft.ie, set that as the default
 * sender in Ontraport admin (Settings → Email → Default From Email).
 */

import { renderReceiptHtml, type ReceiptInput } from './render';

const ONTRAPORT_MESSAGE_URL = 'https://api.ontraport.com/1/message';

function ontraportHeaders() {
  return {
    'Api-Key': process.env.ONTRAPORT_API_KEY || '',
    'Api-Appid': process.env.ONTRAPORT_APP_ID || '',
    'Content-Type': 'application/json',
  };
}

export interface SendReceiptEmailResult {
  ok: boolean;
  status?: number;
  body?: string;
  error?: string;
}

/**
 * Send the rendered receipt HTML to the student's email via Ontraport.
 * Idempotent? No — caller is responsible for not double-sending.
 * Two-attempt retry on transient failures.
 */
export async function sendReceiptEmail(input: ReceiptInput): Promise<SendReceiptEmailResult> {
  const html = renderReceiptHtml(input);
  const subject = `Your ${input.brand === 'pilates' ? 'Image Pilates' : 'Image Fitness Training'} booking — Receipt ${input.receiptNo}`;

  const body = {
    contact_id: Number(input.contactId),
    id: 0,                       // 0 = ad-hoc message, not a saved template
    subject,
    message: html,               // full rendered HTML body
    send_to: input.email,        // recipient — student's email on file
  };

  const attempt = async (n: number): Promise<SendReceiptEmailResult> => {
    try {
      const res = await fetch(ONTRAPORT_MESSAGE_URL, {
        method: 'POST',
        headers: ontraportHeaders(),
        body: JSON.stringify(body),
      });
      const text = await res.text();
      if (res.ok) {
        console.log(`[Receipt-Email] ✅ Sent ${input.receiptNo} to ${input.email} (attempt ${n})`);
        return { ok: true, status: res.status, body: text.slice(0, 300) };
      }
      console.error(`[Receipt-Email] FAIL attempt ${n} for ${input.receiptNo} → ${res.status} ${text.slice(0, 300)}`);
      return { ok: false, status: res.status, error: text.slice(0, 300) };
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      console.error(`[Receipt-Email] FAIL attempt ${n} for ${input.receiptNo} threw:`, err);
      return { ok: false, error: err };
    }
  };

  const r1 = await attempt(1);
  if (r1.ok) return r1;
  await new Promise((r) => setTimeout(r, 1000));
  const r2 = await attempt(2);
  if (r2.ok) return r2;
  console.error(`[Receipt-Email] ❌ Failed to email ${input.receiptNo} to ${input.email} after 2 attempts`);
  return r2;
}
