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
import { Plus, Briefcase, ChevronRight, SearchX, Download, Sparkles, Kanban } from 'lucide-react'
import { seedDemoDataAction } from '@/actions/demo'
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

  // Count total matching rows and fetch paginated records atomically with fallback
  let applications: any[] = []
  let totalCount = 0
  let totalUserApps = 0

  try {
    const results = await db.$transaction([
      db.application.findMany({
        where,
        orderBy,
        skip: (pageParam - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      db.application.count({ where }),
      db.application.count({ where: { userId: user.id } }),
    ])
    applications = results[0]
    totalCount = results[1]
    totalUserApps = results[2]
  } catch (err) {
    console.warn('Applications DB query failed or DB offline, using empty list:', err)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">
            Applications <span className="serif-accent text-emerald-700 dark:text-emerald-400">List</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage, filter, and track all your job applications in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/kanban">
              <Kanban className="h-4 w-4" />
              Board View
            </Link>
          </Button>

          {totalUserApps > 0 && (
            <Button variant="outline" asChild className="gap-2">
              <a href="/api/applications/export" download>
                <Download className="h-4 w-4" />
                Export CSV
              </a>
            </Button>
          )}

          <Button asChild className="gap-2">
            <Link href="/applications/new">
              <Plus className="h-4 w-4" />
              Add Application
            </Link>
          </Button>
        </div>
      </div>

      {totalUserApps === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-4 bg-card">
          <div className="h-12 w-12 rounded-xl bg-muted border text-foreground flex items-center justify-center mx-auto font-mono font-bold">
            AF
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">No applications yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t added any job applications yet. Add your first job application or load sample roles to get started.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <form action={seedDemoDataAction}>
              <Button type="submit" variant="secondary" size="sm" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Load Sample Roles (Vercel, Stripe, Linear)
              </Button>
            </form>
            <Button asChild size="sm">
              <Link href="/applications/new">
                <Plus className="h-4 w-4 mr-2" />
                Add First Application
              </Link>
            </Button>
          </div>
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
                            className="font-medium hover:underline flex items-center gap-2.5"
                          >
                            <span className="w-6 h-6 rounded bg-muted border font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                              {app.company.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <span className="font-semibold text-foreground block truncate">{app.company}</span>
                              <span className="text-xs text-muted-foreground block truncate">{app.jobTitle}</span>
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={app.status} />
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-mono">
                          {formatDate(app.applicationDate)}
                        </TableCell>

                        <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                          {app.location || '—'}
                          {app.workMode && ` (${app.workMode})`}
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-muted-foreground text-xs font-mono">
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
