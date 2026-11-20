import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const authConfig = {
  providers: [GitHub],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLandingPage = nextUrl.pathname === '/'
      const isAuthPage = nextUrl.pathname.startsWith('/sign-in')
      const isApiAuth = nextUrl.pathname.startsWith('/api/auth')
      const isCron = nextUrl.pathname.startsWith('/api/cron')

      // Allow public access to landing page, auth APIs, and background cron jobs
      if (isLandingPage || isApiAuth || isCron) return true

      // Redirect unauthenticated access to dashboard/applications/etc. to /sign-in
      if (!isLoggedIn && !isAuthPage) return false

      // Redirect authenticated users away from /sign-in to /dashboard
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
  },
} satisfies NextAuthConfig
