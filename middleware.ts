import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const middleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public routes
    if (path === '/') return NextResponse.next();

    // Admin routes
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Manager routes
    if (
      path.startsWith('/manager') &&
      !(token?.role === 'manager' || token?.role === 'admin')
    ) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Employee routes
    if (path.startsWith('/onboarding') && token?.role !== 'employee') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/manager/:path*',
    '/onboarding/:path*',
    '/dashboard/:path*',
  ],
};
