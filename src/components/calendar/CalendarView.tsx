'use client'

import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScheduleInterviewDialog } from '@/components/interviews/ScheduleInterviewDialog'
import { deleteInterview } from '@/actions/interviews'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  MapPin,
  ExternalLink,
  Trash2,
  Clock,
  List,
  CalendarDays,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CalendarInterviewItem {
  id: string
  title: string
  startAt: string | Date
  endAt: string | Date | null
  meetingUrl: string | null
  location: string | null
  application: {
    id: string
    company: string
    jobTitle: string
  }
}

interface ApplicationOption {
  id: string
  company: string
  jobTitle: string
}

interface CalendarViewProps {
  interviews: CalendarInterviewItem[]
  applications: ApplicationOption[]
}

export function CalendarView({ interviews, applications }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedInterview, setSelectedInterview] = useState<CalendarInterviewItem | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month')
  const [isDeleting, setIsDeleting] = useState(false)

  // Normalize interview dates to Date objects
  const parsedInterviews = interviews.map((item) => ({
    ...item,
    startDate: new Date(item.startAt),
  }))

  // Month navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToToday = () => setCurrentMonth(new Date())

  // Calendar grid calculations
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this interview from your schedule?')) return
    setIsDeleting(true)
    await deleteInterview(id)
    setIsDeleting(false)
    setSelectedInterview(null)
  }

  // Filter interviews for the agenda view (upcoming and recent)
  const upcomingInterviews = [...parsedInterviews].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  )

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Schedule, track, and prep for upcoming interview rounds and assessment deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border bg-muted p-1">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={cn(
                'inline-flex items-center justify-center h-7 px-3 text-xs gap-1.5 rounded-md transition-all',
                viewMode === 'month'
                  ? 'bg-background text-foreground shadow-sm font-semibold cursor-default'
                  : 'text-muted-foreground'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              className={cn(
                'inline-flex items-center justify-center h-7 px-3 text-xs gap-1.5 rounded-md transition-all',
                viewMode === 'agenda'
                  ? 'bg-background text-foreground shadow-sm font-semibold cursor-default'
                  : 'text-muted-foreground'
              )}
            >
              <List className="h-3.5 w-3.5" />
              Agenda
            </button>
          </div>

          <ScheduleInterviewDialog applications={applications} />
        </div>
      </div>

      {viewMode === 'month' ? (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          {/* Calendar Toolbar */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold tracking-tight">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>

            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={goToToday} className="h-8 text-xs">
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="h-8 w-8"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b text-center text-xs font-semibold text-muted-foreground bg-muted/40">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2.5">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y border-b">
            {calendarDays.map((day) => {
              const dayInterviews = parsedInterviews.filter((item) =>
                isSameDay(item.startDate, day)
              )
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const today = isToday(day)

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[105px] p-2 transition-colors flex flex-col',
                    !isCurrentMonth && 'bg-muted/20 text-muted-foreground/60',
                    today && 'bg-primary/5 font-semibold'
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={cn(
                        'text-xs flex items-center justify-center h-6 w-6 rounded-full',
                        today && 'bg-primary text-primary-foreground font-bold'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayInterviews.length > 0 && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {dayInterviews.length} {dayInterviews.length === 1 ? 'round' : 'rounds'}
                      </span>
                    )}
                  </div>

                  {/* Interview Pills */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px] flex-1">
                    {dayInterviews.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedInterview(item)}
                        className="w-full text-left px-2 py-1 rounded text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all truncate flex items-center gap-1.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span className="truncate">
                          {format(item.startDate, 'h:mm a')} {item.application.company}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Agenda / Upcoming View */
        <div className="space-y-4">
          {upcomingInterviews.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center space-y-4 bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">No interviews scheduled yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Add an upcoming interview round or take-home deadline to see it on your schedule.
                </p>
              </div>
              <ScheduleInterviewDialog applications={applications} />
            </div>
          ) : (
            <div className="rounded-xl border bg-card divide-y">
              {upcomingInterviews.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-base">{item.application.company}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {item.title}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{item.application.jobTitle}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                        {format(item.startDate, 'EEEE, MMMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {format(item.startDate, 'h:mm a')}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.meetingUrl && (
                      <Button asChild size="sm" className="gap-1.5">
                        <a href={item.meetingUrl} target="_blank" rel="noreferrer">
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </a>
                      </Button>
                    )}

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/applications/${item.application.id}`}>
                        View Role
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-muted-foreground hover:text-destructive h-9 w-9 p-0"
                      aria-label="Delete interview"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Interview Details Dialog */}
      <Dialog
        open={Boolean(selectedInterview)}
        onOpenChange={(open) => !open && setSelectedInterview(null)}
      >
        <DialogContent className="sm:max-w-md">
          {selectedInterview && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {selectedInterview.title}
                  </span>
                </div>
                <DialogTitle className="text-xl pt-1">
                  {selectedInterview.application.company}
                </DialogTitle>
                <DialogDescription>
                  {selectedInterview.application.jobTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 border-y text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    {format(
                      new Date(selectedInterview.startAt),
                      'EEEE, MMMM d, yyyy · h:mm a'
                    )}
                  </span>
                </div>

                {selectedInterview.meetingUrl && (
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary shrink-0" />
                    <a
                      href={selectedInterview.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {selectedInterview.meetingUrl}
                    </a>
                  </div>
                )}

                {selectedInterview.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{selectedInterview.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedInterview.id)}
                  disabled={isDeleting}
                  className="gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>

                <div className="flex items-center gap-2">
                  {selectedInterview.meetingUrl && (
                    <Button asChild size="sm" className="gap-1.5">
                      <a
                        href={selectedInterview.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Video className="h-4 w-4" />
                        Join Call
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/applications/${selectedInterview.application.id}`}>
                      View Role
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
