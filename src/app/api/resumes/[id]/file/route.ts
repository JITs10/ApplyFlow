import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { get } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser()
    const { id } = await props.params

    const resume = await db.resume.findFirst({
      where: { id, userId: user.id },
    })

    if (!resume) {
      return new Response('Resume not found', { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const isDownload = searchParams.get('download') === '1'
    const contentType = resume.mimeType || 'application/pdf'
    const disposition = isDownload ? 'attachment' : 'inline'
    const encodedFileName = encodeURIComponent(resume.fileName)

    // 1. Local filesystem fallback
    if (resume.storageKey.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'public', resume.storageKey)
      try {
        const fileBuffer = await fs.readFile(localPath)
        return new Response(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `${disposition}; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
            'Cache-Control': 'private, max-age=3600',
          },
        })
      } catch {
        return new Response('File not found on local disk', { status: 404 })
      }
    }

    // 2. Vercel Blob Storage (Private or Public store)
    if (process.env.BLOB_READ_WRITE_TOKEN && resume.storageKey.startsWith('http')) {
      // Try authenticated private get first
      try {
        const result = await get(resume.storageKey, { access: 'private' })
        if (result && result.statusCode === 200) {
          return new Response(result.stream, {
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `${disposition}; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
              'Cache-Control': 'private, max-age=3600',
            },
          })
        }
      } catch {
        // Fallback to fetch if public store
        const publicRes = await fetch(resume.storageKey)
        if (publicRes.ok && publicRes.body) {
          return new Response(publicRes.body, {
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `${disposition}; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
              'Cache-Control': 'private, max-age=3600',
            },
          })
        }
      }
    }

    // Direct redirect fallback
    return Response.redirect(resume.storageKey, 302)
  } catch {
    return new Response('Unauthorized or server error', { status: 401 })
  }
}
