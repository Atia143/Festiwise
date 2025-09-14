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

  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    // Only match legacy paths that need redirection
    '/festival-finder',
    '/festivals.html',
    '/festivals/europe',
    '/festival-finder-quiz',
    '/about-us.html'
  ]
};
