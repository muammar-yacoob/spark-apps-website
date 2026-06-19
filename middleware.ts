import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // Redirect unauthenticated users to hero page with login modal
  if (!req.auth) {
    return NextResponse.redirect(new URL('/?login=true', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
