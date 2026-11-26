import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected route prefixes that require an active session
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/applications',
  '/kanban',
  '/resumes',
  '/calendar',
  '/settings',
]

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Check if session token exists in cookies (NextAuth v5 / Auth.js)
    const hasSession = Boolean(
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('__Secure-authjs.session-token')?.value ||
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value
    )

    const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
    const isAuthPage = pathname.startsWith('/sign-in')

    // If accessing protected route without session cookie, redirect to /sign-in
    if (isProtected && !hasSession) {
      const signInUrl = new URL('/sign-in', request.nextUrl.origin)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If authenticated user navigates to /sign-in, redirect to /dashboard
    if (isAuthPage && hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin))
    }

    return NextResponse.next()
  } catch (error) {
    // Fail open safely on edge so an unhandled proxy error never crashes the entire application
    console.error('Edge proxy invocation error:', error)
    return NextResponse.next()
  }
}

export default proxy

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg, icon, apple-icon, opengraph-image
     * - public files (files with an extension e.g. .svg, .png, .jpg)
     */
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon|apple-icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
