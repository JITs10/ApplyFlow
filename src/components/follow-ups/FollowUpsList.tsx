'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  format,
  differenceInCalendarDays,
  isToday,
  isPast,
} from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScheduleFollowUpDialog } from '@/components/follow-ups/ScheduleFollowUpDialog'
import {
  markFollowUpComplete,
  snoozeFollowUp,
  deleteFollowUp,
} from '@/actions/follow-ups'
import {
  Check,
  Clock,
  Calendar,
  AlertTriangle,
  Mail,
  Trash2,
  ExternalLink,
  CheckCircle2,
  MoreVertical,
  Bell,
  ArrowRight,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

export interface FollowUpItem {
  id: string
  dueAt: string | Date
  completedAt: string | Date | null
  status: 'PENDING' | 'COMPLETED'
  notes: string | null
  application: {
    id: string
    company: string
    jobTitle: string
    contactName: string | null
    contactEmail: string | null
  }
}

interface ApplicationOption {
  id: string
  company: string
  jobTitle: string
}

interface FollowUpsListProps {
  followUps: FollowUpItem[]
  applications: ApplicationOption[]
}

export function FollowUpsList({ followUps, applications }: FollowUpsListProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'pending' | 'completed'>('pending')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const pending = followUps.filter((f) => f.status === 'PENDING')
  const completed = followUps.filter((f) => f.status === 'COMPLETED')

  // Sort pending by due date ascending (earliest / most overdue first)
  const sortedPending = [...pending].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
  )

  // Sort completed by completedAt descending (most recently completed first)
  const sortedCompleted = [...completed].sort(
    (a, b) =>
      new Date(b.completedAt || b.dueAt).getTime() -
      new Date(a.completedAt || a.dueAt).getTime()
  )

  const handleComplete = async (id: string) => {
    setLoadingId(id)
    await markFollowUpComplete(id)
    setLoadingId(null)
    router.refresh()
  }

  const handleSnooze = async (id: string, days: number) => {
    setLoadingId(id)
    await snoozeFollowUp(id, days)
    setLoadingId(null)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this follow-up?')) return
    setLoadingId(id)
    await deleteFollowUp(id)
    setLoadingId(null)
    router.refresh()
  }

  const getUrgencyBadge = (dueAt: Date) => {
    const diff = differenceInCalendarDays(dueAt, new Date())

    if (diff < 0) {
      const days = Math.abs(diff)
      return {
        label: `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`,
        className: 'bg-destructive/15 text-destructive border-destructive/20 font-semibold',
        icon: AlertTriangle,
      }
    }

    if (diff === 0) {
      return {
        label: 'Due Today',
        className: 'bg-primary/15 text-primary border-primary/25 font-semibold',
        icon: Clock,
      }
    }

    if (diff === 1) {
      return {
        label: 'Due Tomorrow',
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
        icon: Clock,
      }
    }

    return {
      label: `Due in ${diff} days`,
      className: 'bg-muted text-muted-foreground border-transparent',
      icon: Calendar,
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Follow-Ups & Reminders</h1>
          <p className="text-sm text-muted-foreground">
            Stay top of mind with recruiters and track post-application or post-interview communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center rounded-lg border bg-muted p-1">
            <button
              type="button"
              onClick={() => setTab('pending')}
              className={cn(
                'inline-flex items-center justify-center h-7 px-3 text-xs gap-1.5 rounded-md transition-all',
                tab === 'pending'
                  ? 'bg-background text-foreground shadow-sm font-semibold cursor-default'
                  : 'text-muted-foreground'
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              Pending ({pending.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('completed')}
              className={cn(
                'inline-flex items-center justify-center h-7 px-3 text-xs gap-1.5 rounded-md transition-all',
                tab === 'completed'
                  ? 'bg-background text-foreground shadow-sm font-semibold cursor-default'
                  : 'text-muted-foreground'
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed ({completed.length})
            </button>
          </div>

          <ScheduleFollowUpDialog applications={applications} />
        </div>
      </div>

      {/* Content */}
      {tab === 'pending' ? (
        sortedPending.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center space-y-4 bg-card">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">All caught up!</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You have no pending follow-ups right now. Keep applying or add a reminder for an existing application.
              </p>
            </div>
            <ScheduleFollowUpDialog
              applications={applications}
              triggerText="Add Reminder"
              triggerVariant="outline"
              triggerSize="sm"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPending.map((item) => {
              const dueDate = new Date(item.dueAt)
              const urgency = getUrgencyBadge(dueDate)
              const UrgencyIcon = urgency.icon
              const hasRecruiterEmail = Boolean(item.application.contactEmail)

              return (
                <Card
                  key={item.id}
                  className={cn(
                    'overflow-hidden transition-all border',
                    isPast(dueDate) && !isToday(dueDate) && 'border-destructive/30 bg-destructive/5'
                  )}
                >
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-base">{item.application.company}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{item.application.jobTitle}</span>

                        <div
                          className={cn(
                            'flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border',
                            urgency.className
                          )}
                        >
                          <UrgencyIcon className="h-3 w-3" />
                          <span>{urgency.label}</span>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-xs sm:text-sm text-foreground/90 bg-muted/50 p-2.5 rounded-md border text-muted-foreground">
                          {item.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          Due: {formatDate(item.dueAt)}
                        </span>

                        {item.application.contactName && (
                          <span>
                            Contact: <strong className="text-foreground">{item.application.contactName}</strong>
                          </span>
                        )}

                        {hasRecruiterEmail && (
                          <a
                            href={`mailto:${item.application.contactEmail}?subject=Following up on my application for ${encodeURIComponent(item.application.jobTitle)} at ${encodeURIComponent(item.application.company)}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Email {item.application.contactEmail}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                      <Button
                        size="sm"
                        onClick={() => handleComplete(item.id)}
                        disabled={loadingId === item.id}
                        className="gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        Done
                      </Button>

                      {/* Snooze Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 text-xs">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Snooze
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSnooze(item.id, 3)}>
                            +3 Days
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSnooze(item.id, 7)}>
                            +1 Week
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSnooze(item.id, 14)}>
                            +2 Weeks
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                        <Link href={`/applications/${item.application.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={loadingId === item.id}
                        className="h-8 px-2 text-muted-foreground hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )
      ) : (
        /* Completed Tab */
        sortedCompleted.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center space-y-3 bg-card">
            <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold">No completed follow-ups yet</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Follow-ups you mark as done will be archived here for your records.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-xl border bg-card">
            {sortedCompleted.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold line-through text-muted-foreground">
                      {item.application.company}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground truncate">{item.application.jobTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Completed {item.completedAt ? formatDate(item.completedAt) : ''}
                    </span>
                  </div>
                  {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                    <Link href={`/applications/${item.application.id}`}>
                      View Application
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
