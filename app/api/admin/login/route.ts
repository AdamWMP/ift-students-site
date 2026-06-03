// POST handler for the admin login form.
// Verifies the submitted password against ADMIN_PASSWORD, sets the
// session cookie, and redirects to the original destination.

import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, hashSessionToken } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new NextResponse('ADMIN_PASSWORD not configured', { status: 503 });
  }

  const form = await req.formData();
  const submitted = String(form.get('password') || '');
  const rawNext = String(form.get('next') || '/admin/receipts');
  // Only allow same-origin admin redirects — defence against open-redirect abuse.
  const next = rawNext.startsWith('/admin/') ? rawNext : '/admin/receipts';

  if (submitted !== adminPassword) {
    // Wrong password — bounce back to login with the error flag preserving
    // the original next= so successful re-auth lands the user where they were.
    const redirectUrl = new URL(`/admin/login?error=1&next=${encodeURIComponent(next)}`, req.url);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  // Auth succeeded — set the session cookie and bounce to the destination.
  const token = await hashSessionToken(adminPassword);
  const redirectUrl = new URL(next, req.url);
  const res = NextResponse.redirect(redirectUrl, { status: 303 });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: req.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
