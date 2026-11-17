import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ResumeUploader } from '@/components/resumes/ResumeUploader'
import { ResumeList } from '@/components/resumes/ResumeList'

export const metadata = {
  title: 'Resume Library — ApplyFlow',
}

export default async function ResumesPage() {
  const user = await requireUser()

  const resumes = await db.resume.findMany({
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
