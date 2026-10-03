import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith('/admin/login');
  const isAdminRoute = path.startsWith('/admin');

  if (isAdminRoute && !isAuthRoute) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || token !== 'superadmin_token_123') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (isAuthRoute) {
    const token = request.cookies.get('admin_token')?.value;
    if (token === 'superadmin_token_123') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
