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
      const isAuthPage = nextUrl.pathname.startsWith('/sign-in')
      const isApiAuth = nextUrl.pathname.startsWith('/api/auth')
      const isCron = nextUrl.pathname.startsWith('/api/cron')

      if (isApiAuth || isCron) return true
      if (!isLoggedIn && !isAuthPage) return false
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
  },
} satisfies NextAuthConfig
