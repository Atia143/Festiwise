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
  
  // 1. Force HTTPS (if not already)
  if (process.env.NODE_ENV === 'production' && !request.headers.get('x-forwarded-proto')?.includes('https')) {
    return NextResponse.redirect(
      `https://${host}${pathname}${search}`,
      301
    );
  }
  
  // 2. Redirect www to non-www
  if (host?.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '');
    return NextResponse.redirect(
      `https://${newHost}${pathname}${search}`,
      301
    );
  }

  // 3. Remove trailing slashes (except for root path)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return NextResponse.redirect(
      `https://${host}${pathname.slice(0, -1)}${search}`,
      301
    );
  }

  // 4. Handle legacy path redirects
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
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next (Next.js internals)
     * - static files
     */
    '/(api|_next|.*\\..*|favicon\\.ico)/:path*',
    '/:path*'
  ]
};
