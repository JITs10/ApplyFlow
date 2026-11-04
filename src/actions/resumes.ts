'use server'

import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { uploadResume, deleteResume, validateResumeFile } from '@/lib/storage/blob'
import { revalidatePath } from 'next/cache'

export async function uploadResumeAction(formData: FormData) {
  const user = await requireUser()

  const file = formData.get('file') as File | null
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: 'Please select a valid resume file' }
  }

  try {
    validateResumeFile(file)
  } catch (err) {
    return { error: (err as Error).message }
  }

  try {
    const uploaded = await uploadResume(user.id, file)

    const resume = await db.resume.create({
      data: {
        userId: user.id,
        fileName: uploaded.fileName,
        storageKey: uploaded.storageKey,
        mimeType: uploaded.mimeType,
        fileSize: uploaded.fileSize,
      },
    })

    revalidatePath('/resumes')
    revalidatePath('/applications')
    revalidatePath('/dashboard')

    return { success: true, resume }
  } catch (err) {
    console.error('Failed to upload resume:', err)
    return { error: 'Failed to upload resume. Please try again.' }
  }
}

export async function deleteResumeAction(id: string) {
  const user = await requireUser()

  const resume = await db.resume.findFirst({
    where: { id, userId: user.id },
  })

  if (!resume) {
    return { error: 'Resume not found' }
  }

  try {
    await deleteResume(resume.storageKey)
    await db.resume.delete({ where: { id } })

    revalidatePath('/resumes')
    revalidatePath('/applications')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (err) {
    console.error('Failed to delete resume:', err)
    return { error: 'Failed to delete resume' }
  }
}
