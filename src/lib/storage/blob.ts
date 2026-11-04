import { put, del } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export function validateResumeFile(file: File) {
  const isAllowedType =
    ALLOWED_TYPES.includes(file.type) ||
    file.name.endsWith('.pdf') ||
    file.name.endsWith('.docx') ||
    file.name.endsWith('.doc')

  if (!isAllowedType) {
    throw new Error('Only PDF and Word (.docx, .doc) files are accepted')
  }

  if (file.size > MAX_BYTES) {
    throw new Error('File exceeds 10 MB limit')
  }
}

export async function uploadResume(userId: string, file: File) {
  validateResumeFile(file)
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  // If Vercel Blob token is set, use cloud storage
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const key = `resumes/${userId}/${filename}`
    const blob = await put(key, file, { access: 'public' })
    return {
      storageKey: blob.url,
      fileName: file.name,
      mimeType: file.type || 'application/pdf',
      fileSize: file.size,
    }
  }

  // Graceful local development fallback
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes')
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  return {
    storageKey: `/uploads/resumes/${filename}`,
    fileName: file.name,
    mimeType: file.type || 'application/pdf',
    fileSize: file.size,
  }
}

export async function deleteResume(storageKey: string) {
  if (storageKey.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), 'public', storageKey)
    try {
      await fs.unlink(localPath)
    } catch {
      // Ignore if file was already removed
    }
    return
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(storageKey)
    } catch {
      // Ignore if already removed in Blob
    }
  }
}
