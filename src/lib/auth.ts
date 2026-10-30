import { auth } from '@/auth'
import { db } from './db'

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

/** Returns null instead of throwing — use in layouts for conditional rendering */
export async function getUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return db.user.findUnique({ where: { id: session.user.id } })
}
