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
  return db.user.findUniqueOrThrow({ where: { id: session.user.id } })
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
