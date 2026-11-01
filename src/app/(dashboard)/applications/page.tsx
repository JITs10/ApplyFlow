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
import { ApplicationFilters } from '@/components/applications/ApplicationFilters'
import { PaginationControls } from '@/components/applications/PaginationControls'
import { formatDate } from '@/lib/utils'
import { Plus, Briefcase, ChevronRight, SearchX } from 'lucide-react'
import type { ApplicationStatus, Prisma } from '@prisma/client'

export const metadata = {
  title: 'Applications — ApplyFlow',
}

const PAGE_SIZE = 10

interface PageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    sort?: string
    page?: string
  }>
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const user = await requireUser()
  const params = await searchParams

  const q = params.q?.trim() || ''
  const statusParam = params.status?.trim() || ''
  const sortParam = params.sort?.trim() || 'created_desc'
  const pageParam = Math.max(1, parseInt(params.page || '1', 10) || 1)

  // Construct Prisma WHERE clause
  const where: Prisma.ApplicationWhereInput = {
    userId: user.id,
  }

  // Filter by status if valid
  const validStatuses: string[] = [
    'WISHLIST',
    'APPLIED',
    'ASSESSMENT',
    'INTERVIEW',
    'OFFER',
    'REJECTED',
    'WITHDRAWN',
  ]
  if (statusParam && validStatuses.includes(statusParam)) {
    where.status = statusParam as ApplicationStatus
  }

  // Filter by search query (case-insensitive across company, title, location)
  if (q) {
    where.OR = [
      { company: { contains: q, mode: 'insensitive' } },
      { jobTitle: { contains: q, mode: 'insensitive' } },
      { location: { contains: q, mode: 'insensitive' } },
    ]
  }

  // Construct Prisma ORDER BY clause
  let orderBy: Prisma.ApplicationOrderByWithRelationInput = { createdAt: 'desc' }
  if (sortParam === 'created_asc') {
    orderBy = { createdAt: 'asc' }
  } else if (sortParam === 'company_asc') {
    orderBy = { company: 'asc' }
  } else if (sortParam === 'date_desc') {
    orderBy = { applicationDate: 'desc' }
  }

  // Count total matching rows and fetch paginated records atomically
  const [applications, totalCount, totalUserApps] = await db.$transaction([
    db.application.findMany({
      where,
      orderBy,
      skip: (pageParam - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.application.count({ where }),
    db.application.count({ where: { userId: user.id } }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground">
            Manage, filter, and track all your active job applications in one place.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/applications/new">
            <Plus className="h-4 w-4" />
            Add Application
          </Link>
        </Button>
      </div>

      {totalUserApps === 0 ? (
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
        <div className="space-y-4">
          <ApplicationFilters />

          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center space-y-4 bg-card">
              <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                <SearchX className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">No matching applications</h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  No applications matched your search or filter criteria. Try adjusting or clearing your filters.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/applications">Clear Filters</Link>
              </Button>
            </div>
          ) : (
            <>
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

              <PaginationControls
                currentPage={pageParam}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
