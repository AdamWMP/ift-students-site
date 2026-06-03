import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, hashSessionToken } from '@/lib/admin-auth';

/**
 * Host-based routing middleware
 * Maps subdomains to specific pages so each course gets a clean landing URL:
 *   ptcheckout.imageft.ie  → /checkout
 *   pilatescheckout.imageft.ie → /checkout  (add more as needed)
 */
const SUBDOMAIN_ROUTES: Record<string, string> = {
  'ptcheckout': '/checkout/launch',
  'checkout': '/enrol',
  // Future: 'pilatescheckout': '/pilates-checkout',
};

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const path = request.nextUrl.pathname;

  // ── Admin routes — gated by signed cookie ────────────────────────
  // /admin/login and /api/admin/login are EXEMPT (otherwise the login
  // page itself would require auth — chicken & egg). The login API
  // route validates the password and sets the cookie.
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return new NextResponse('Admin not configured. Set ADMIN_PASSWORD env var.', { status: 503 });
    }

    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    const expected = await hashSessionToken(adminPassword);
    if (cookie === expected) {
      return NextResponse.next();              // ✅ authed
    }

    // Not authed → redirect to login, preserving the original destination
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // Extract subdomain: "ptcheckout.imageft.ie" → "ptcheckout"
  const subdomain = hostname.split('.')[0];
  const targetPath = SUBDOMAIN_ROUTES[subdomain];

  // Only rewrite if this is a subdomain we handle AND the user is hitting the root
  if (targetPath && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all paths except static files and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
