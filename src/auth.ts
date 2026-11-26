import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { authConfig } from '@/auth.config'
import { getOrCreateGuestUser, isGuestUser } from '@/lib/guest'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
