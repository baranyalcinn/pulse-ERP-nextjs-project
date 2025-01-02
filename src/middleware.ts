import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const isLoggedIn = authToken === 'logged_in';
  
  // Korumalı rotalar ve auth sayfaları
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/auth');

  // Giriş yapmamış kullanıcı korumalı sayfaya erişmeye çalışıyorsa
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Giriş yapmış kullanıcı auth sayfalarına erişmeye çalışıyorsa
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı sayfaları belirt
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 