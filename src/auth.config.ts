import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'

// Prevent misconfigured environment variables from breaking host resolution on Vercel
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  if (
    process.env.AUTH_URL?.includes('localhost') ||
    process.env.AUTH_URL?.startsWith('http://') ||
    process.env.AUTH_URL?.includes('applyflow-six')
  ) {
    delete process.env.AUTH_URL
  }
  if (
    process.env.NEXTAUTH_URL?.includes('localhost') ||
    process.env.NEXTAUTH_URL?.startsWith('http://') ||
    process.env.NEXTAUTH_URL?.includes('applyflow-six')
  ) {
    delete process.env.NEXTAUTH_URL
  }
}

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  '74e7d4eda7bf78583275aa3d39221eb989e119cb6ab96f0f3eb34448c9777c48'

const githubClientId =
  process.env.AUTH_GITHUB_ID ||
  process.env.GITHUB_ID ||
  process.env.GITHUB_CLIENT_ID ||
  ''

const githubClientSecret =
  process.env.AUTH_GITHUB_SECRET ||
  process.env.GITHUB_SECRET ||
  process.env.GITHUB_CLIENT_SECRET ||
  ''

export const authConfig = {
  trustHost: true,
  secret: authSecret,
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
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
