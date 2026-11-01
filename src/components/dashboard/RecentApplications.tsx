import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/applications/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Plus, ArrowRight, Briefcase } from 'lucide-react'
import type { Application } from '@prisma/client'

interface RecentApplicationsProps {
  applications: Application[]
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
            <CardDescription className="text-xs">
              Recently added or updated job opportunities
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href="/applications" className="gap-1">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {applications.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">No applications logged yet</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Start your job search journey by adding your first application.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/applications/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Application
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {applications.map((app) => (
              <div
                key={app.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/applications/${app.id}`}
                    className="font-medium text-sm hover:underline truncate block"
                  >
                    {app.company}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">{app.jobTitle}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {formatDate(app.applicationDate || app.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
