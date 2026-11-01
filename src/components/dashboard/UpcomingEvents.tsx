import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Calendar, Video, MapPin, ExternalLink, CalendarDays } from 'lucide-react'

interface InterviewItem {
  id: string
  title: string
  startAt: Date
  meetingUrl: string | null
  location: string | null
  application: {
    id: string
    company: string
    jobTitle: string
  }
}

interface UpcomingEventsProps {
  interviews: InterviewItem[]
}

export function UpcomingEvents({ interviews }: UpcomingEventsProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Upcoming Schedule</CardTitle>
            <CardDescription className="text-xs">
              Next scheduled interviews and assessments
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href="/calendar">View Calendar</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {interviews.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <CalendarDays className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">No upcoming interviews</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              When you schedule an interview round or assessment on an application, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 rounded-lg border bg-muted/40 hover:bg-muted/70 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">
                      {item.application.company}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.application.jobTitle}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.startAt)}
                    </span>
                    {item.meetingUrl ? (
                      <a
                        href={item.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Video className="h-3 w-3" />
                        Meeting link
                      </a>
                    ) : item.location ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                <Button variant="ghost" size="sm" asChild className="shrink-0 h-8 px-2">
                  <Link href={`/applications/${item.application.id}`}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
