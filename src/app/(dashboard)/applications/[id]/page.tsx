import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/applications/StatusBadge'
import { DeleteApplicationDialog } from '@/components/applications/DeleteApplicationDialog'
import { ScheduleInterviewDialog } from '@/components/interviews/ScheduleInterviewDialog'
import { ScheduleFollowUpDialog } from '@/components/follow-ups/ScheduleFollowUpDialog'
import { formatDate, formatDateTime } from '@/lib/utils'
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  User,
  Mail,
  Clock,
  Video,
  Bell,
  CheckCircle2,
  FileText,
  Download,
} from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params
  const user = await requireUser()

  const application = await db.application.findFirst({
    where: { id, userId: user.id },
    include: {
      interviews: { orderBy: { startAt: 'asc' } },
      followUps: { orderBy: { dueAt: 'asc' } },
      resume: true,
    },
  })

  if (!application) {
    notFound()
  }

  const appOption = [{ id: application.id, company: application.company, jobTitle: application.jobTitle }]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/applications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{application.company}</h1>
              <StatusBadge status={application.status} />
            </div>
            <p className="text-lg text-muted-foreground">{application.jobTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {application.jobUrl && (
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Job Posting
              </a>
            </Button>
          )}

          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href={`/applications/${application.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>

          <DeleteApplicationDialog
            id={application.id}
            company={application.company}
            jobTitle={application.jobTitle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Notes */}
          {application.generalNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {application.generalNotes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Job Description */}
          {application.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {application.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Interviews Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Scheduled Rounds & Deadlines</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {application.interviews.length} {application.interviews.length === 1 ? 'round' : 'rounds'} logged
                </p>
              </div>

              <ScheduleInterviewDialog
                applications={appOption}
                defaultApplicationId={application.id}
                triggerText="Add Round"
                triggerVariant="outline"
                triggerSize="sm"
              />
            </CardHeader>

            <CardContent>
              {application.interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No interview rounds scheduled yet. Click &quot;Add Round&quot; above to add a screening, technical round, or assessment deadline.
                </p>
              ) : (
                <div className="space-y-3">
                  {application.interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3.5 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm bg-muted/30"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{interview.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {formatDateTime(interview.startAt)}
                        </p>
                        {interview.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {interview.location}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {interview.meetingUrl && (
                          <Button variant="default" size="sm" asChild className="gap-1.5 h-8">
                            <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <Video className="h-3.5 w-3.5" />
                              Join Meeting
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Follow-Ups Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Follow-Up Reminders</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {application.followUps.length} {application.followUps.length === 1 ? 'reminder' : 'reminders'} logged
                </p>
              </div>

              <ScheduleFollowUpDialog
                applications={appOption}
                defaultApplicationId={application.id}
                triggerText="Add Reminder"
                triggerVariant="outline"
                triggerSize="sm"
              />
            </CardHeader>

            <CardContent>
              {application.followUps.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No follow-ups scheduled. Click &quot;Add Reminder&quot; above to set a check-in reminder with the recruiter.
                </p>
              ) : (
                <div className="space-y-3">
                  {application.followUps.map((fu) => (
                    <div
                      key={fu.id}
                      className="p-3 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm bg-muted/20"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Due: {formatDate(fu.dueAt)}
                          </span>
                          {fu.status === 'COMPLETED' ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Done
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              Pending
                            </span>
                          )}
                        </div>
                        {fu.notes && (
                          <p className="text-xs text-muted-foreground">{fu.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col) - Overview Metadata & Attached Resume */}
        <div className="space-y-6">
          {/* Attached Resume Card */}
          {application.resume && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-primary">
                  <FileText className="h-4 w-4" />
                  Attached Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium truncate" title={application.resume.fileName}>
                  {application.resume.fileName}
                </p>
                <Button variant="outline" size="sm" asChild className="w-full gap-2 text-xs">
                  <a href={application.resume.storageKey} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3.5 w-3.5" />
                    Download / View Resume
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Applied Date</p>
                  <p className="font-medium">{formatDate(application.applicationDate)}</p>
                </div>
              </div>

              {(application.salaryMin || application.salaryMax) && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary Range</p>
                    <p className="font-medium">
                      {application.currency}{' '}
                      {application.salaryMin ? Number(application.salaryMin).toLocaleString() : '0'}{' '}
                      -{' '}
                      {application.salaryMax
                        ? Number(application.salaryMax).toLocaleString()
                        : 'Uncapped'}
                    </p>
                  </div>
                </div>
              )}

              {(application.location || application.workMode) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location & Mode</p>
                    <p className="font-medium">
                      {application.location || 'Not specified'}
                      {application.workMode && ` (${application.workMode})`}
                    </p>
                  </div>
                </div>
              )}

              {application.nextFollowUpAt && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Next Follow-up</p>
                    <p className="font-medium">{formatDate(application.nextFollowUpAt)}</p>
                  </div>
                </div>
              )}

              {(application.contactName || application.contactEmail) && (
                <div className="pt-2 border-t space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Contact</p>
                  {application.contactName && (
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{application.contactName}</span>
                    </div>
                  )}
                  {application.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <a
                        href={`mailto:${application.contactEmail}`}
                        className="text-primary hover:underline text-xs"
                      >
                        {application.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
