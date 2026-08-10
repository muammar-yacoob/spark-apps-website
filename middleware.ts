import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  // Redirect unauthenticated users to hero page with login modal
  if (!req.auth) {
    return NextResponse.redirect(new URL('/?login=true', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
