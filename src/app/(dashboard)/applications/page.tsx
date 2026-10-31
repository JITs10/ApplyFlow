import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/applications/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Plus, Briefcase, ExternalLink, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Applications — ApplyFlow',
}

export default async function ApplicationsPage() {
  const user = await requireUser()

  const applications = await db.application.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all your active job applications in one place.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/applications/new">
            <Plus className="h-4 w-4" />
            Add Application
          </Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">No applications yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t added any job applications to your workspace yet.
              Add your first role to begin tracking your progress.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/applications/new">
              <Plus className="h-4 w-4 mr-2" />
              Add First Application
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company & Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Applied Date</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Next Follow-up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-medium hover:underline flex flex-col"
                    >
                      <span className="font-semibold text-foreground">{app.company}</span>
                      <span className="text-xs text-muted-foreground">{app.jobTitle}</span>
                    </Link>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {formatDate(app.applicationDate)}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    {app.location || '—'}
                    {app.workMode && ` (${app.workMode})`}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                    {formatDate(app.nextFollowUpAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/applications/${app.id}`}>
                        <span className="sr-only sm:not-sr-only sm:mr-1">View</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
