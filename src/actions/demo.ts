'use server'

import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function seedDemoDataAction(): Promise<void> {
  const user = await requireUser()

  const now = new Date()
  const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
  const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Create 3 realistic engineering roles
  const app1 = await db.application.create({
    data: {
      userId: user.id,
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
      contactName: 'Sarah Jenkins',
      contactEmail: 'sarah.j@vercel.com',
      generalNotes: '[Demo] Take-home architecture challenge due in 48 hours. Focus on Next.js Server Components and cache optimization.',
      nextFollowUpAt: twoDaysLater,
    },
  })

  // Create assessment deadline
  await db.interview.create({
    data: {
      userId: user.id,
      applicationId: app1.id,
      title: 'Take-Home Project Submission',
      startAt: twoDaysLater,
      meetingUrl: 'https://github.com',
    },
  })

  const app2 = await db.application.create({
    data: {
      userId: user.id,
      company: 'Stripe',
      jobTitle: 'Infrastructure Engineer',
      location: 'San Francisco, CA / Remote',
      workMode: 'HYBRID',
      status: 'INTERVIEW',
      salaryMin: 190000,
      salaryMax: 240000,
      currency: 'USD',
      applicationDate: threeDaysAgo,
      jobUrl: 'https://stripe.com/jobs',
      contactName: 'Alex Rivera',
      contactEmail: 'alex.r@stripe.com',
      generalNotes: '[Demo] Recruiter phone screen went very well. System design round coming up next Tuesday.',
      nextFollowUpAt: fiveDaysLater,
    },
  })

  await db.interview.create({
    data: {
      userId: user.id,
      applicationId: app2.id,
      title: 'Systems & Architecture Round',
      startAt: fiveDaysLater,
      meetingUrl: 'https://zoom.us/j/demo-stripe-round',
    },
  })

  await db.application.create({
    data: {
      userId: user.id,
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
      generalNotes: '[Demo] Applied via team referral. Sent Fullstack TypeScript CV.',
      nextFollowUpAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/applications')
  revalidatePath('/kanban')
  revalidatePath('/calendar')
}

export async function clearDemoDataAction(): Promise<void> {
  const user = await requireUser()

  await db.application.deleteMany({
    where: {
      userId: user.id,
      generalNotes: {
        contains: '[Demo]',
      },
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/applications')
  revalidatePath('/kanban')
  revalidatePath('/calendar')
}
