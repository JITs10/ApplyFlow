import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { authConfig } from '@/auth.config'
import { getOrCreateGuestUser, isGuestUser } from '@/lib/guest'

// Prevent localhost environment variables from breaking host resolution on Vercel
if ((process.env.VERCEL || process.env.NODE_ENV === 'production') && process.env.AUTH_URL?.includes('localhost')) {
  delete process.env.AUTH_URL
}
if ((process.env.VERCEL || process.env.NODE_ENV === 'production') && process.env.NEXTAUTH_URL?.includes('localhost')) {
  delete process.env.NEXTAUTH_URL
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    ...authConfig.providers,
    Credentials({
      id: 'guest',
      name: 'Guest Explorer',
      credentials: {},
      async authorize() {
        return getOrCreateGuestUser()
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.isGuest = token.isGuest === true
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.isGuest = isGuestUser(user.email)
      }
      return token
    },
  },
})
