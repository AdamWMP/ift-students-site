// Admin recovery: re-fire the full booking notification pipeline for a
// contact whose original checkout flow crashed mid-way (or for a contact
// that came in through a separate codebase like pilates_checkout that
// hasn't been patched yet).
//
// Fires (best effort, in parallel):
//   1. Slack #sales notification via the existing notifySale path
//   2. Receipt email via the /1/message endpoint
//   3. WhatsApp confirmation (if AiSensy template configured)
//
// Auth: ADMIN_PASSWORD cookie.

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, hashSessionToken } from '@/lib/admin-auth';
import { getReceiptByContactId } from '@/lib/receipts/from-ontraport';
import { sendReceiptEmail } from '@/lib/receipts/email';
import { sendReceipt } from '@/lib/receipts/send';
import { postToSlack } from '@/lib/sale-notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return new NextResponse('Admin not configured', { status: 503 });
  // Auth — accept either:
  //   1. Admin session cookie (browser flow via the admin UI)
  //   2. Authorization: Bearer <ADMIN_PASSWORD> (programmatic / chat-driven)
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await hashSessionToken(adminPassword);
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const isAuthed = cookie === expected || bearer === adminPassword;
  if (!isAuthed) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json().catch(() => null)) as { contactId?: string | number } | null;
  const contactId = body?.contactId;
  if (!contactId) return new NextResponse('contactId required', { status: 400 });

  const input = await getReceiptByContactId(contactId);
  if (!input) return NextResponse.json({ ok: false, error: 'Contact not found in Ontraport' }, { status: 404 });

  const result: Record<string, unknown> = {
    contactId: String(contactId),
    receiptNo: input.receiptNo,
    student: `${input.firstName} ${input.lastName}`.trim(),
    email: input.email,
    courseTotal: input.courseTotal,
    paidToday: input.paidToday,
  };

  // 1. Receipt email
  const emailRes = await sendReceiptEmail(input).catch((e) => ({ ok: false, error: e instanceof Error ? e.message : String(e) }));
  result.email_send = emailRes;

  // 2. Slack #sales — manual recovery notification (distinct format so it's
  //    visually obvious this was triggered by admin, not by the live checkout)
  const slackText = [
    `🛟 *RECOVERY: Booking re-confirmed by admin* — ${input.receiptNo}`,
    `Student: ${input.firstName} ${input.lastName} (#${input.contactId})`,
    `Course: ${input.packageName}`,
    `Location: ${input.location} · Intake: ${input.intakeDate}`,
    `Schedule: ${input.schedule}`,
    `Course total: €${input.courseTotal.toLocaleString('en-IE', { minimumFractionDigits: 2 })}`,
    `Paid today: €${input.paidToday.toLocaleString('en-IE', { minimumFractionDigits: 2 })}` + (input.isFullPayment ? ' (in full)' : ` · Remaining: €${(input.courseTotal - input.paidToday).toLocaleString('en-IE', { minimumFractionDigits: 2 })}`),
    `Email: ${input.email} · Phone: ${input.phone}`,
    ``,
    `<https://app.ontraport.com/#!/contact/edit&id=${input.contactId}|Open in Ontraport ↗>  ·  <https://www.imageft.ie/admin/receipts/${encodeURIComponent(input.receiptNo)}|View receipt in admin ↗>`,
  ].join('\n');
  const slackRes = await postToSlack(slackText, `recovery for contact ${contactId}`);
  result.slack = slackRes;

  // 3. WhatsApp + Slack receipt-log channel via the existing sendReceipt pipeline.
  //    This doubles up on Slack (one ding from the recovery notification above,
  //    one from the receipt-log) which is fine — both useful audit entries.
  await sendReceipt(input).catch((e) => { result.sendReceipt_error = e instanceof Error ? e.message : String(e); });

  return NextResponse.json({ ok: true, result });
}
