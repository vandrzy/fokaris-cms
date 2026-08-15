import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  let isTokenValid = false;

  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = atob(base64);
      const decoded = JSON.parse(decodedJson);
      // Validasi waktu kedaluwarsa token
      if (decoded.exp && Date.now() < decoded.exp * 1000) {
        isTokenValid = true;
      }
    } catch (e) {
      isTokenValid = false;
    }
  }

  // Check if trying to access dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isTokenValid) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Check if trying to access login
  if (request.nextUrl.pathname === '/login') {
    if (isTokenValid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
