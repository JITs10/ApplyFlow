import { auth } from '@/auth'
import { db } from './db'
import { isGuestUser } from './guest'

/**
 * Returns the current authenticated DB user.
 * Swap auth providers by changing only this file.
 */
export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthenticated')
  }
  try {
    return await db.user.findUniqueOrThrow({ where: { id: session.user.id } })
  } catch (err) {
    if (session.user.isGuest) {
      return {
        id: session.user.id,
        email: session.user.email || 'guest@applyflow.dev',
        name: session.user.name || 'Guest Explorer',
        image: session.user.image || null,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    throw err
  }
}

/**
 * Throws a user-friendly error if a guest user attempts a database mutation (create/edit/delete/upload).
 */
export async function assertNonGuest(user?: { email?: string | null }) {
  const targetUser = user || (await requireUser())
  if (isGuestUser(targetUser.email)) {
    throw new Error('GUEST_MODE_RESTRICTED: You are exploring in Demo Guest Mode. Sign in with GitHub to save real applications, notes, and resumes.')
  }
}

/** Returns null instead of throwing — use in layouts for conditional rendering */
export async function getUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return db.user.findUnique({ where: { id: session.user.id } })
}
