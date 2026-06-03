// Admin endpoint: email a receipt (or batch of receipts) to the customer(s).
// Auth: ADMIN_PASSWORD cookie (same gate as the admin pages).

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, hashSessionToken } from '@/lib/admin-auth';
import { contactIdFromReceiptNo, getReceiptByContactId } from '@/lib/receipts/from-ontraport';
import { sendReceiptEmail } from '@/lib/receipts/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return new NextResponse('Admin not configured', { status: 503 });
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await hashSessionToken(adminPassword);
  if (cookie !== expected) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json().catch(() => null)) as { receiptNos?: string[] } | null;
  const list = Array.isArray(body?.receiptNos) ? (body!.receiptNos as string[]) : [];
  if (!list.length) return new NextResponse('No receiptNos provided', { status: 400 });

  const results: Array<{ receiptNo: string; ok: boolean; email?: string; error?: string }> = [];

  for (const receiptNo of list) {
    const contactId = contactIdFromReceiptNo(receiptNo);
    if (!contactId) {
      results.push({ receiptNo, ok: false, error: 'unrecognised receipt format' });
      continue;
    }
    try {
      const input = await getReceiptByContactId(contactId);
      if (!input) {
        results.push({ receiptNo, ok: false, error: 'contact not found in Ontraport' });
        continue;
      }
      const r = await sendReceiptEmail(input);
      results.push({ receiptNo, ok: r.ok, email: input.email, error: r.ok ? undefined : r.error });
    } catch (e) {
      results.push({ receiptNo, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  const successCount = results.filter((r) => r.ok).length;
  return NextResponse.json({
    sent: successCount,
    total: list.length,
    results,
  });
}
