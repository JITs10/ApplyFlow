'use server'

import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { applicationSchema, type ApplicationInput } from '@/lib/validation/application'
import { revalidatePath } from 'next/cache'
import type { ApplicationStatus } from '@prisma/client'

export async function createApplication(input: ApplicationInput) {
  const user = await requireUser()
  const validated = applicationSchema.parse(input)

  const application = await db.application.create({
    data: {
      userId: user.id,
      company: validated.company,
      jobTitle: validated.jobTitle,
      description: validated.description || null,
      jobUrl: validated.jobUrl || null,
      location: validated.location || null,
      workMode: validated.workMode || null,
      salaryMin: validated.salaryMin ?? null,
      salaryMax: validated.salaryMax ?? null,
      currency: validated.currency || 'INR',
      applicationDate: validated.applicationDate ? new Date(validated.applicationDate) : null,
      status: validated.status,
      resumeId: validated.resumeId || null,
      contactName: validated.contactName || null,
      contactEmail: validated.contactEmail || null,
      nextFollowUpAt: validated.nextFollowUpAt ? new Date(validated.nextFollowUpAt) : null,
      generalNotes: validated.generalNotes || null,
    },
  })

  // shortcut: creates default Interview entry for Interview or Assessment stage; full multi-round editor to be expanded in Day 4
  const scheduledDate =
    validated.status === 'INTERVIEW'
      ? validated.interviewDate
      : validated.status === 'ASSESSMENT'
      ? validated.assessmentDate
      : null

  if (scheduledDate) {
    await db.interview.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        title: validated.status === 'INTERVIEW' ? 'Interview' : 'Assessment',
        startAt: new Date(scheduledDate),
      },
    })
  }

  revalidatePath('/applications')
  revalidatePath('/dashboard')
  revalidatePath('/kanban')
  revalidatePath('/calendar')
  return { success: true, id: application.id }
}

export async function updateApplication(id: string, input: ApplicationInput) {
  const user = await requireUser()
  const validated = applicationSchema.parse(input)

  // Verify ownership before updating
  const existing = await db.application.findFirst({
    where: { id, userId: user.id },
  })
  if (!existing) {
    throw new Error('Application not found or unauthorized')
  }

  await db.application.update({
    where: { id },
    data: {
      company: validated.company,
      jobTitle: validated.jobTitle,
      description: validated.description || null,
      jobUrl: validated.jobUrl || null,
      location: validated.location || null,
      workMode: validated.workMode || null,
      salaryMin: validated.salaryMin ?? null,
      salaryMax: validated.salaryMax ?? null,
      currency: validated.currency || 'INR',
      applicationDate: validated.applicationDate ? new Date(validated.applicationDate) : null,
      status: validated.status,
      resumeId: validated.resumeId || null,
      contactName: validated.contactName || null,
      contactEmail: validated.contactEmail || null,
      nextFollowUpAt: validated.nextFollowUpAt ? new Date(validated.nextFollowUpAt) : null,
      generalNotes: validated.generalNotes || null,
    },
  })

  // shortcut: creates or updates default Interview entry for Interview or Assessment stage
  const scheduledDate =
    validated.status === 'INTERVIEW'
      ? validated.interviewDate
      : validated.status === 'ASSESSMENT'
      ? validated.assessmentDate
      : null

  if (scheduledDate) {
    const title = validated.status === 'INTERVIEW' ? 'Interview' : 'Assessment'
    const existingEvent = await db.interview.findFirst({
      where: {
        applicationId: id,
        userId: user.id,
        title,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (existingEvent) {
      await db.interview.update({
        where: { id: existingEvent.id },
        data: { startAt: new Date(scheduledDate) },
      })
    } else {
      await db.interview.create({
        data: {
          userId: user.id,
          applicationId: id,
          title,
          startAt: new Date(scheduledDate),
        },
      })
    }
  }

  revalidatePath('/applications')
  revalidatePath(`/applications/${id}`)
  revalidatePath('/dashboard')
  revalidatePath('/kanban')
  revalidatePath('/calendar')
  return { success: true }
}

export async function deleteApplication(id: string) {
  const user = await requireUser()

  const existing = await db.application.findFirst({
    where: { id, userId: user.id },
  })
  if (!existing) {
    throw new Error('Application not found or unauthorized')
  }

  await db.application.delete({
    where: { id },
  })

  revalidatePath('/applications')
  revalidatePath('/dashboard')
  revalidatePath('/kanban')
  revalidatePath('/calendar')
  return { success: true }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const user = await requireUser()

  const existing = await db.application.findFirst({
    where: { id, userId: user.id },
  })
  if (!existing) {
    throw new Error('Application not found or unauthorized')
  }

  await db.application.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/applications')
  revalidatePath(`/applications/${id}`)
  revalidatePath('/dashboard')
  revalidatePath('/kanban')
  revalidatePath('/calendar')
  return { success: true }
}
