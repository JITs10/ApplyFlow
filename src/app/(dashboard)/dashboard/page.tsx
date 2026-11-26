import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { RecentApplications } from '@/components/dashboard/RecentApplications'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { seedDemoDataAction, clearDemoDataAction } from '@/actions/demo'
import { Plus, AlertCircle, Calendar, Sparkles, Trash2, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Dashboard — ApplyFlow',
}

export default async function DashboardPage() {
  const user = await requireUser()
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  // Run all dashboard counts and triage queries in parallel with fallback for offline/connecting DB
  let totalApps = 0
  let inReviewCount = 0
  let interviewCount = 0
  let offerCount = 0
  let recentApplications: any[] = []
  let upcomingInterviews: any[] = []
  let urgentInterviews: any[] = []
  let overdueFollowUps: any[] = []
  let demoCount = 0

  try {
    const results = await Promise.all([
      db.application.count({ where: { userId: user.id } }),
      db.application.count({
        where: {
          userId: user.id,
          status: { in: ['APPLIED', 'ASSESSMENT'] },
        },
      }),
      db.application.count({
        where: {
          userId: user.id,
          status: 'INTERVIEW',
        },
      }),
      db.application.count({
        where: {
          userId: user.id,
          status: 'OFFER',
        },
      }),
      db.application.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.interview.findMany({
        where: {
          application: { userId: user.id },
          startAt: { gte: now },
        },
        orderBy: { startAt: 'asc' },
        take: 4,
        include: {
          application: {
            select: {
              id: true,
              company: true,
              jobTitle: true,
            },
          },
        },
      }),
      db.interview.findMany({
        where: {
          application: { userId: user.id },
          startAt: { gte: now, lte: threeDaysFromNow },
        },
        orderBy: { startAt: 'asc' },
        take: 2,
        include: {
          application: {
            select: {
              id: true,
              company: true,
              jobTitle: true,
            },
          },
        },
      }),
      db.application.findMany({
        where: {
          userId: user.id,
          nextFollowUpAt: { lte: now },
          status: { notIn: ['REJECTED', 'WITHDRAWN', 'OFFER'] },
        },
        orderBy: { nextFollowUpAt: 'asc' },
        take: 2,
        select: {
          id: true,
          company: true,
          jobTitle: true,
          nextFollowUpAt: true,
        },
      }),
      db.application.count({
        where: {
          userId: user.id,
          generalNotes: { contains: '[Demo]' },
        },
      }),
    ])

    totalApps = results[0]
    inReviewCount = results[1]
    interviewCount = results[2]
    offerCount = results[3]
    recentApplications = results[4]
    upcomingInterviews = results[5]
    urgentInterviews = results[6]
    overdueFollowUps = results[7]
    demoCount = results[8]
  } catch (dbErr) {
    console.warn('Dashboard DB queries failed or DB offline, using empty defaults:', dbErr)
  }

  const hasTriageItems = urgentInterviews.length > 0 || overdueFollowUps.length > 0
  const hasDemoData = demoCount > 0

  return (
    <div className="space-y-6">
      {/* Sample Data Notice Banner (If Demo Data Active) */}
      {hasDemoData && (
        <div className="p-3 rounded-lg border bg-muted/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">You are viewing sample demo roles (Vercel, Stripe, Linear).</span>
          </div>
          <form action={clearDemoDataAction}>
            <Button variant="ghost" size="sm" type="submit" className="text-xs h-7 text-muted-foreground hover:text-destructive gap-1">
              <Trash2 className="w-3 h-3" />
              Clear Sample Data
            </Button>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">
            Application <span className="serif-accent text-emerald-700 dark:text-emerald-400">Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track your active applications, upcoming interviews, and follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild className="gap-2">
            <Link href="/applications/new">
              <Plus className="h-4 w-4" />
              New Application
            </Link>
          </Button>
        </div>
      </div>

      {/* First-Time User Empty State */}
      {totalApps === 0 ? (
        <div className="rounded-xl border border-dashed p-10 sm:p-16 text-center space-y-6 bg-card">
          <div className="w-12 h-12 rounded-xl bg-muted border flex items-center justify-center mx-auto text-foreground font-mono font-bold">
            AF
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg font-bold tracking-tight">No Applications Yet</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Start tracking where you applied, upcoming interviews, and tailored resumes. 
              Add your first job application, or load 3 sample roles to see how it works.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <form action={seedDemoDataAction}>
              <Button type="submit" variant="secondary" className="gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample Roles (Vercel, Stripe, Linear)
              </Button>
            </form>

            <Button asChild className="gap-2 text-xs">
              <Link href="/applications/new">
                <Plus className="w-3.5 h-3.5" />
                Add Your First Application
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Actionable Triage Strip */}
          {hasTriageItems && (
            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Attention Required Today
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {urgentInterviews.length + overdueFollowUps.length} pending
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {urgentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-foreground truncate">
                        {interview.application.company} &mdash; {interview.title}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        Scheduled for {formatDate(interview.startAt)}
                      </p>
                    </div>
                    <Link
                      href={`/applications/${interview.application.id}`}
                      className="px-2 py-1 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30 shrink-0 hover:bg-amber-500/20 transition-colors"
                    >
                      View Interview &rarr;
                    </Link>
                  </div>
                ))}

                {overdueFollowUps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-foreground truncate">
                        {app.company} &mdash; Follow-up Overdue
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        Target date was {formatDate(app.nextFollowUpAt!)}
                      </p>
                    </div>
                    <Link
                      href={`/applications/${app.id}`}
                      className="px-2 py-1 rounded text-[10px] font-mono font-medium bg-rose-500/10 text-rose-500 border border-rose-500/30 shrink-0 hover:bg-rose-500/20 transition-colors"
                    >
                      Send Follow-Up &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics & Stage Funnel */}
          <StatsGrid
            total={totalApps}
            inReview={inReviewCount}
            interviews={interviewCount}
            offers={offerCount}
          />

          {/* Two-Column Grid: Recent Applications & Upcoming Schedule */}
          <div className="grid gap-6 md:grid-cols-2">
            <RecentApplications applications={recentApplications} />
            <UpcomingEvents interviews={upcomingInterviews} />
          </div>
        </>
      )}
    </div>
  )
}
