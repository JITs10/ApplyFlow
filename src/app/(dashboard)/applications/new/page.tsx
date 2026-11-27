import { requireUser } from '@/lib/auth'
import { isGuestUser } from '@/lib/guest'
import { db } from '@/lib/db'
import { ApplicationForm } from '@/components/applications/ApplicationForm'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Add Application — ApplyFlow',
}

export default async function NewApplicationPage() {
  const user = await requireUser()
  const isGuest = isGuestUser(user.email)

  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    select: { id: true, fileName: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      {isGuest && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Guest Demo Preview
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are exploring in read-only guest mode. Test the form below, or connect your GitHub account to save your real applications permanently.
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
      <ApplicationForm resumes={resumes} isGuest={isGuest} />
    </div>
  )
}
