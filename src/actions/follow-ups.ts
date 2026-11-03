'use server'

import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { followUpSchema, type FollowUpInput } from '@/lib/validation/follow-up'
import { revalidatePath } from 'next/cache'

export async function createFollowUp(input: FollowUpInput) {
  const user = await requireUser()

  const parsed = followUpSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid follow-up details' }
  }

  const application = await db.application.findFirst({
    where: { id: parsed.data.applicationId, userId: user.id },
  })

  if (!application) {
    return { error: 'Application not found or unauthorized' }
  }

  const dueAt = new Date(parsed.data.dueAt)
  if (isNaN(dueAt.getTime())) {
    return { error: 'Invalid due date' }
  }

  // Determine scheduled reminder time (defaults to due date morning at 09:00, or custom reminderAt)
  const scheduledReminderAt = parsed.data.reminderAt
    ? new Date(parsed.data.reminderAt)
    : new Date(dueAt.getTime())

  await db.$transaction(async (tx) => {
    // 1. Create FollowUp record
    const followUp = await tx.followUp.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        dueAt,
        reminderAt: parsed.data.reminderAt ? scheduledReminderAt : null,
        notes: parsed.data.notes || null,
        status: 'PENDING',
      },
    })

    // 2. Create Notification queue item if reminder is set or requested
    if (!isNaN(scheduledReminderAt.getTime())) {
      await tx.notification.create({
        data: {
          userId: user.id,
          followUpId: followUp.id,
          scheduledAt: scheduledReminderAt,
          status: 'PENDING',
        },
      })
    }

    // 3. Update application's nextFollowUpAt if this is the earliest pending follow-up
    if (!application.nextFollowUpAt || dueAt < application.nextFollowUpAt) {
      await tx.application.update({
        where: { id: application.id },
        data: { nextFollowUpAt: dueAt },
      })
    }
  })

  revalidatePath('/follow-ups')
  revalidatePath('/dashboard')
  revalidatePath(`/applications/${application.id}`)
  revalidatePath('/applications')

  return { success: true }
}

export async function markFollowUpComplete(id: string) {
  const user = await requireUser()

  const followUp = await db.followUp.findFirst({
    where: { id, userId: user.id },
    select: { id: true, applicationId: true },
  })

  if (!followUp) {
    return { error: 'Follow-up not found' }
  }

  await db.$transaction(async (tx) => {
    // 1. Mark as completed
    await tx.followUp.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    // 2. Mark pending notifications as completed/cancelled
    await tx.notification.updateMany({
      where: { followUpId: id, status: 'PENDING' },
      data: { status: 'SENT', sentAt: new Date() },
    })

    // 3. Recalculate next pending follow-up for this application
    const nextPending = await tx.followUp.findFirst({
      where: {
        applicationId: followUp.applicationId,
        status: 'PENDING',
      },
      orderBy: { dueAt: 'asc' },
      select: { dueAt: true },
    })

    await tx.application.update({
      where: { id: followUp.applicationId },
      data: { nextFollowUpAt: nextPending ? nextPending.dueAt : null },
    })
  })

  revalidatePath('/follow-ups')
  revalidatePath('/dashboard')
  revalidatePath(`/applications/${followUp.applicationId}`)
  revalidatePath('/applications')

  return { success: true }
}

export async function snoozeFollowUp(id: string, daysToAdd: number) {
  const user = await requireUser()

  const followUp = await db.followUp.findFirst({
    where: { id, userId: user.id },
  })

  if (!followUp) {
    return { error: 'Follow-up not found' }
  }

  const newDueAt = new Date(followUp.dueAt.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

  await db.$transaction(async (tx) => {
    // 1. Update due date
    await tx.followUp.update({
      where: { id },
      data: {
        dueAt: newDueAt,
        status: 'PENDING',
        completedAt: null,
      },
    })

    // 2. Update linked pending notification
    await tx.notification.updateMany({
      where: { followUpId: id, status: 'PENDING' },
      data: { scheduledAt: newDueAt },
    })

    // 3. Update application nextFollowUpAt
    const nextPending = await tx.followUp.findFirst({
      where: {
        applicationId: followUp.applicationId,
        status: 'PENDING',
      },
      orderBy: { dueAt: 'asc' },
      select: { dueAt: true },
    })

    await tx.application.update({
      where: { id: followUp.applicationId },
      data: { nextFollowUpAt: nextPending ? nextPending.dueAt : null },
    })
  })

  revalidatePath('/follow-ups')
  revalidatePath('/dashboard')
  revalidatePath(`/applications/${followUp.applicationId}`)
  revalidatePath('/applications')

  return { success: true }
}

export async function deleteFollowUp(id: string) {
  const user = await requireUser()

  const followUp = await db.followUp.findFirst({
    where: { id, userId: user.id },
    select: { id: true, applicationId: true },
  })

  if (!followUp) {
    return { error: 'Follow-up not found' }
  }

  await db.$transaction(async (tx) => {
    // 1. Delete notifications first then follow-up
    await tx.notification.deleteMany({ where: { followUpId: id } })
    await tx.followUp.delete({ where: { id } })

    // 2. Recalculate next pending follow-up on application
    const nextPending = await tx.followUp.findFirst({
      where: {
        applicationId: followUp.applicationId,
        status: 'PENDING',
      },
      orderBy: { dueAt: 'asc' },
      select: { dueAt: true },
    })

    await tx.application.update({
      where: { id: followUp.applicationId },
      data: { nextFollowUpAt: nextPending ? nextPending.dueAt : null },
    })
  })

  revalidatePath('/follow-ups')
  revalidatePath('/dashboard')
  revalidatePath(`/applications/${followUp.applicationId}`)
  revalidatePath('/applications')

  return { success: true }
}
