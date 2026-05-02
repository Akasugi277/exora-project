import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public pages (no session required)
  if (pathname === '/' || pathname === '/docs' || pathname.startsWith('/docs/')) {
    return NextResponse.next();
  }

  const session = req.cookies.get('exora_session');
  if (!session) {
    const loginUrl = new URL('/api/auth/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
