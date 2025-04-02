import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isOurUser = !!request.cookies.get('next-auth.session-token');
  if (!isOurUser) return NextResponse.redirect(new URL('/on-boarding', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/my-page'],
};
