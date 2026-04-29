import { NextRequest, NextResponse } from 'next/server';

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

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

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
