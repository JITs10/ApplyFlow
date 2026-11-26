import { requireUser } from '@/lib/auth'
import { isGuestUser } from '@/lib/guest'
import { db } from '@/lib/db'
import { ResumeUploader } from '@/components/resumes/ResumeUploader'
import { ResumeList } from '@/components/resumes/ResumeList'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Resume Library — ApplyFlow',
}

export default async function ResumesPage() {
  const user = await requireUser()
  const isGuest = isGuestUser(user.email)

  let resumes: any[] = []
  try {
    resumes = await db.resume.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { applications: true },
        },
        applications: {
          select: {
            id: true,
            company: true,
            jobTitle: true,
            status: true,
          },
          take: 6,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.warn('Resumes DB query failed or DB offline, using empty list:', err)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif tracking-tight">
          Resume <span className="serif-accent text-emerald-700 dark:text-emerald-400">Library</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Save and organize your resume versions so you always know which one you sent.
        </p>
      </div>

      {isGuest && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Sample Resumes Loaded
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We&apos;ve loaded sample resumes for demonstration. To upload, version, and link your real PDF resumes to applications, connect your GitHub account.
            </p>
          </div>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            <span>Connect GitHub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Upload Dropzone */}
      <ResumeUploader />

      {/* Uploaded Resumes Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold">Your Resumes ({resumes.length})</h2>
        <ResumeList resumes={resumes} />
      </div>
    </div>
  )
}
