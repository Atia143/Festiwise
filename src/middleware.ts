import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Legacy paths that need to be redirected to new URLs
const LEGACY_REDIRECTS: Record<string, string> = {
  '/festival-finder': '/',
  '/festivals.html': '/festivals',
  '/festivals/europe': '/festivals/europe',
  '/festival-finder-quiz': '/quiz',
  '/about-us.html': '/about',
  // Add more legacy paths here
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, search, host } = url;

  // Only handle legacy redirects in middleware
  const redirectTo = LEGACY_REDIRECTS[pathname];
  if (redirectTo) {
    return NextResponse.redirect(
      `https://${host}${redirectTo}${search}`,
      301
    );
  }

  // Set x-pathname header so generateMetadata can build hreflang tags
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    // Legacy redirects
    '/festival-finder',
    '/festivals.html',
    '/festivals/europe',
    '/festival-finder-quiz',
    '/about-us.html',
    // All pages (for x-pathname header)
    '/((?!_next/static|_next/image|favicon|api|.*\\..*).*)',
  ]
};
