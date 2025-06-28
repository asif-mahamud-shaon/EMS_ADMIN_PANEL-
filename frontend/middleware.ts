import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login']

// List of admin-only routes
const adminRoutes = [
  '/departments',
  '/designations',
  '/employees',
  '/payroll',
]

// List of routes that require authentication (both admin and employee)
const protectedRoutes = [
  '/dashboard',
  '/attendance',
  '/leaves',
  '/profile',
  ...adminRoutes
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public assets and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get stored auth data
  const accessToken = request.cookies.get('accessToken')?.value
  const userData = request.cookies.get('userData')?.value

  // If trying to access login page
  if (publicRoutes.includes(pathname)) {
    // If already authenticated, redirect to dashboard
    if (accessToken && userData) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // For all other routes, check authentication
  if (!accessToken || !userData) {
    // Store the original URL to redirect back after login
    const loginUrl = new URL('/login', request.url)
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Parse user data
    const user = JSON.parse(userData)

    // Check if trying to access admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      // If not an admin, redirect to dashboard
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // For protected routes, we've already verified authentication above
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // For root path, redirect to dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // For any unhandled routes, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    // If there's any error parsing user data, clear cookies and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    response.cookies.delete('userData')
    return response
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
} 