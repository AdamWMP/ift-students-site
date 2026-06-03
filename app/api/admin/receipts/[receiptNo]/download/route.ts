// Admin endpoint: download a single receipt as an .html file.
// Returns the rendered receipt HTML with a `Content-Disposition: attachment`
// header so the browser saves it instead of rendering inline.
// Auth: ADMIN_PASSWORD cookie.

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, hashSessionToken } from '@/lib/admin-auth';
import { contactIdFromReceiptNo, getReceiptByContactId } from '@/lib/receipts/from-ontraport';
import { renderReceiptHtml } from '@/lib/receipts/render';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ receiptNo: string }> },
) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return new NextResponse('Admin not configured', { status: 503 });
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await hashSessionToken(adminPassword);
  if (cookie !== expected) return new NextResponse('Unauthorized', { status: 401 });

  const { receiptNo } = await params;
  const decoded = decodeURIComponent(receiptNo);
  const contactId = contactIdFromReceiptNo(decoded);
  if (!contactId) return new NextResponse('Unrecognised receipt no.', { status: 400 });

  const input = await getReceiptByContactId(contactId);
  if (!input) return new NextResponse('Contact not found', { status: 404 });

  const html = renderReceiptHtml(input);
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${decoded}.html"`,
      'Cache-Control': 'no-store',
    },
  });
}
