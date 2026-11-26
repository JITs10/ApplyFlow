import { db } from '@/lib/db'

export const GUEST_USER_EMAIL = 'guest@applyflow.dev'
export const GUEST_USER_NAME = 'Guest Explorer'

export function isGuestUser(email?: string | null): boolean {
  return email === GUEST_USER_EMAIL
}

/**
 * Returns or creates the global demo guest user account, ensuring
 * rich sample applications and interviews are pre-seeded for realistic exploration.
 */
export async function getOrCreateGuestUser() {
  try {
    let user = await db.user.findUnique({
      where: { email: GUEST_USER_EMAIL },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email: GUEST_USER_EMAIL,
          name: GUEST_USER_NAME,
          image: null,
        },
      })
      try {
        await seedGuestWorkspace(user.id)
      } catch (seedErr) {
        console.warn('Could not seed guest workspace:', seedErr)
      }
    } else {
      try {
        const count = await db.application.count({ where: { userId: user.id } })
        if (count === 0) {
          await seedGuestWorkspace(user.id)
        }
      } catch (countErr) {
        console.warn('Could not check guest application count:', countErr)
      }
    }

    return user
  } catch (err) {
    console.error('Database unreachable during guest user retrieval, using fallback guest session:', err)
    return {
      id: 'guest-explorer-fallback',
      email: GUEST_USER_EMAIL,
      name: GUEST_USER_NAME,
      image: null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

/**
 * Populates the guest account with realistic engineering job applications across
 * all major stages (Wishlist, Applied, Assessment, Interview, Offer).
 */
export async function seedGuestWorkspace(userId: string) {
  const now = new Date()
  const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
  const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
  const tenDaysLater = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  // 1. Resumes
  const resume1 = await db.resume.create({
    data: {
      userId,
      fileName: 'Staff-Infrastructure-v2.4.pdf',
      storageKey: 'sample/staff-infra-v2.4.pdf',
      mimeType: 'application/pdf',
      fileSize: 142800,
    },
  })

  const resume2 = await db.resume.create({
    data: {
      userId,
      fileName: 'Fullstack-TypeScript-v3.1.pdf',
      storageKey: 'sample/fullstack-ts-v3.1.pdf',
      mimeType: 'application/pdf',
      fileSize: 118400,
    },
  })

  // 2. Stripe - Interview
  const appStripe = await db.application.create({
    data: {
      userId,
      company: 'Stripe',
      jobTitle: 'Staff Infrastructure Engineer',
      location: 'San Francisco, CA / Remote',
      workMode: 'HYBRID',
      status: 'INTERVIEW',
      salaryMin: 190000,
      salaryMax: 240000,
      currency: 'USD',
      applicationDate: threeDaysAgo,
      jobUrl: 'https://stripe.com/jobs',
      resumeId: resume1.id,
      contactName: 'Alex Rivera',
      contactEmail: 'alex.r@stripe.com',
      generalNotes: 'System design round with Principal Engineer coming up next Tuesday. Focus on high-throughput event processing and idempotency.',
      nextFollowUpAt: fiveDaysLater,
    },
  })

  await db.interview.create({
    data: {
      userId,
      applicationId: appStripe.id,
      title: 'Systems & Architecture Deep Dive',
      startAt: fiveDaysLater,
      meetingUrl: 'https://zoom.us/j/demo-stripe-round',
    },
  })

  // 3. Vercel - Assessment
  const appVercel = await db.application.create({
    data: {
      userId,
      company: 'Vercel',
      jobTitle: 'Staff Frontend Engineer',
      location: 'Remote, US/EU',
      workMode: 'REMOTE',
      status: 'ASSESSMENT',
      salaryMin: 180000,
      salaryMax: 220000,
      currency: 'USD',
      applicationDate: oneWeekAgo,
      jobUrl: 'https://vercel.com/careers',
      resumeId: resume2.id,
      contactName: 'Sarah Jenkins',
      contactEmail: 'sarah.j@vercel.com',
      generalNotes: 'Take-home architecture challenge due in 48 hours. Focus on Next.js Server Components, partial prerendering, and cache boundaries.',
      nextFollowUpAt: twoDaysLater,
    },
  })

  await db.interview.create({
    data: {
      userId,
      applicationId: appVercel.id,
      title: 'Take-Home Project Submission Review',
      startAt: twoDaysLater,
      meetingUrl: 'https://github.com',
    },
  })

  // 4. Linear - Applied
  await db.application.create({
    data: {
      userId,
      company: 'Linear',
      jobTitle: 'Fullstack Product Engineer',
      location: 'Remote',
      workMode: 'REMOTE',
      status: 'APPLIED',
      salaryMin: 160000,
      salaryMax: 200000,
      currency: 'USD',
      applicationDate: threeDaysAgo,
      jobUrl: 'https://linear.app/careers',
      resumeId: resume2.id,
      contactName: 'Tuomas Artman',
      generalNotes: 'Applied via referral from former colleague. Emphasized sync engine experience and desktop shortcut ergonomics.',
      nextFollowUpAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
  })

  // 5. Figma - Offer
  await db.application.create({
    data: {
      userId,
      company: 'Figma',
      jobTitle: 'Senior Systems Engineer',
      location: 'San Francisco, CA / Remote',
      workMode: 'REMOTE',
      status: 'OFFER',
      salaryMin: 210000,
      salaryMax: 260000,
      currency: 'USD',
      applicationDate: twoWeeksAgo,
      jobUrl: 'https://figma.com/careers',
      resumeId: resume1.id,
      contactName: 'Maya Patel',
      contactEmail: 'mpatel@figma.com',
      generalNotes: 'Received written offer! Base $235k + $180k equity over 4 years. Reviewing health benefits and IP clause before signing.',
      nextFollowUpAt: tenDaysLater,
    },
  })

  // 6. OpenAI - Wishlist
  await db.application.create({
    data: {
      userId,
      company: 'OpenAI',
      jobTitle: 'Member of Technical Staff, DevTools',
      location: 'San Francisco, CA',
      workMode: 'ONSITE',
      status: 'WISHLIST',
      salaryMin: 230000,
      salaryMax: 300000,
      currency: 'USD',
      applicationDate: null,
      jobUrl: 'https://openai.com/careers',
      generalNotes: 'Reaching out to engineering manager next week after polishing open-source distributed cache benchmarks.',
    },
  })
}
