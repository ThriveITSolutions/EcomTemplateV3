import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
});

// Protected admin routes
const adminRoutes = ['/admin/dashboard', '/admin/products', '/admin/categories', '/admin/orders', 
                     '/admin/customers', '/admin/marketing', '/admin/inventory', '/admin/content',
                     '/admin/reports', '/admin/settings', '/admin/users'];

// API routes to rate limit
const apiRateLimitedRoutes = ['/api/products', '/api/orders', '/api/cart', '/api/customers'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Security headers
  const headers = new Headers(request.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 2. Rate limiting for API routes
  const shouldRateLimit = apiRateLimitedRoutes.some(route => pathname.startsWith(route));
  if (shouldRateLimit) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const { success, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429, 
          headers: { 
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    headers.set('X-RateLimit-Remaining', remaining.toString());
  }

  // 3. Admin route protection
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  if (isAdminRoute) {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    const adminCookie = request.cookies.get('admin-session')?.value;

    // For now, allow access if either cookie exists
    // In production, this would verify the session and check admin role
    if (!sessionToken && !adminCookie) {
      // Redirect to admin login
      if (!pathname.startsWith('/admin/login')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  // 4. Storefront auth check for account routes
  if (pathname.startsWith('/account')) {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    if (!sessionToken) {
      // Redirect to sign in with return URL
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // 5. Checkout authentication
  if (pathname.startsWith('/checkout')) {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    // Allow guest checkout, but if session exists, user should be logged in
    if (!sessionToken) {
      // Set guest cookie for tracking
      const guestId = request.cookies.get('guest-id')?.value || crypto.randomUUID();
      headers.set('Set-Cookie', `guest-id=${guestId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
    }
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes that don't need rate limiting
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};