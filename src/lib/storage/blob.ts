import { put, del } from '@vercel/blob'

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export function validateResumeFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Only PDF and DOCX files are accepted')
  if (file.size > MAX_BYTES) throw new Error('File exceeds 10 MB limit')
}

export async function uploadResume(userId: string, file: File) {
  validateResumeFile(file)
  const ext = file.name.endsWith('.pdf') ? 'pdf' : 'docx'
  const key = `resumes/${userId}/${Date.now()}.${ext}`
  const blob = await put(key, file, { access: 'public' })
  return { storageKey: blob.url, fileName: file.name, mimeType: file.type, fileSize: file.size }
}

export async function deleteResume(storageKey: string) {
  await del(storageKey)
}
