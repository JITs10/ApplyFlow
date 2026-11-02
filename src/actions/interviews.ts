'use server'

import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { interviewSchema, type InterviewInput } from '@/lib/validation/interview'
import { revalidatePath } from 'next/cache'

export async function createInterview(input: InterviewInput) {
  const user = await requireUser()

  const parsed = interviewSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid interview details' }
  }

  // Verify application ownership
  const application = await db.application.findFirst({
    where: { id: parsed.data.applicationId, userId: user.id },
  })

  if (!application) {
    return { error: 'Application not found or unauthorized' }
  }

  const startAt = new Date(parsed.data.startAt)
  if (isNaN(startAt.getTime())) {
    return { error: 'Invalid interview date and time' }
  }

  await db.$transaction(async (tx) => {
    // 1. Create interview round
    await tx.interview.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        title: parsed.data.title,
        startAt,
        endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : null,
        meetingUrl: parsed.data.meetingUrl || null,
        location: parsed.data.location || null,
      },
    })

    // 2. Automatically advance status to INTERVIEW if currently WISHLIST or APPLIED
    if (application.status === 'WISHLIST' || application.status === 'APPLIED') {
      await tx.application.update({
        where: { id: application.id },
        data: { status: 'INTERVIEW' },
      })
    }
  })

  revalidatePath('/calendar')
  revalidatePath('/dashboard')
  revalidatePath(`/applications/${application.id}`)
  revalidatePath('/applications')

  return { success: true }
}

export async function deleteInterview(id: string) {
  const user = await requireUser()

  const interview = await db.interview.findFirst({
    where: { id, userId: user.id },
    select: { id: true, applicationId: true },
  })

  if (!interview) {
    return { error: 'Interview not found or unauthorized' }
  }

  await db.interview.delete({ where: { id } })

  revalidatePath('/calendar')
  revalidatePath('/dashboard')
  revalidatePath(`/applications/${interview.applicationId}`)
  revalidatePath('/applications')

  return { success: true }
}
