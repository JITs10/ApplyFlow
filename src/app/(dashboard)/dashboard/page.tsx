import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { RecentApplications } from '@/components/dashboard/RecentApplications'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Dashboard — ApplyFlow',
}

export default async function DashboardPage() {
  const user = await requireUser()

  // Run all dashboard counts and queries in parallel for high-speed server rendering
  const [
    totalApps,
    inReviewCount,
    interviewCount,
    offerCount,
    recentApplications,
    upcomingInterviews,
  ] = await Promise.all([
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
        startAt: { gte: new Date() },
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
  ])

  const firstName = user.name ? user.name.split(' ')[0] : 'there'

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here is a snapshot of your job search progress and upcoming milestones.
          </p>
        </div>

        <Button asChild className="gap-2 shrink-0">
          <Link href="/applications/new">
            <Plus className="h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      {/* 4 KPI Summary Cards */}
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
    </div>
  )
}
