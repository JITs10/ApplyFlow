'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createInterview } from '@/actions/interviews'
import { Plus, Calendar, Video, MapPin, Loader2 } from 'lucide-react'

interface ApplicationOption {
  id: string
  company: string
  jobTitle: string
}

interface ScheduleInterviewDialogProps {
  applications: ApplicationOption[]
  defaultApplicationId?: string
  triggerText?: string
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost'
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon'
}

const COMMON_ROUNDS = [
  'Screening Call (HR / Recruiter)',
  'Technical Interview 1',
  'Technical Interview 2',
  'System Design',
  'Live Coding / Pair Programming',
  'Hiring Manager Round',
  'Behavioral / Culture Fit',
  'Take-Home Assessment Deadline',
  'Offer Discussion',
]

export function ScheduleInterviewDialog({
  applications,
  defaultApplicationId,
  triggerText = 'Schedule Round',
  triggerVariant = 'default',
  triggerSize = 'default',
}: ScheduleInterviewDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [applicationId, setApplicationId] = useState(defaultApplicationId || applications[0]?.id || '')
  const [title, setTitle] = useState(COMMON_ROUNDS[0])
  const [customTitle, setCustomTitle] = useState('')
  const [startAt, setStartAt] = useState('')
  const [meetingUrl, setMeetingUrl] = useState('')
  const [location, setLocation] = useState('')

  const effectiveTitle = title === 'CUSTOM' ? customTitle.trim() : title

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!applicationId) {
      setError('Please select an application')
      return
    }

    if (!effectiveTitle) {
      setError('Please enter a round title')
      return
    }

    if (!startAt) {
      setError('Please choose a date and time')
      return
    }

    setLoading(true)

    const result = await createInterview({
      applicationId,
      title: effectiveTitle,
      startAt: new Date(startAt).toISOString(),
      meetingUrl: meetingUrl.trim() || undefined,
      location: location.trim() || undefined,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize} className="gap-2">
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview Round</DialogTitle>
          <DialogDescription>
            Add an upcoming round, screening, or assessment deadline to your calendar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 text-xs rounded-md bg-destructive/15 text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Application Selection (if not locked to one) */}
          {!defaultApplicationId && (
            <div className="space-y-1.5">
              <Label>Application</Label>
              <Select value={applicationId} onValueChange={setApplicationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select application..." />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.company} — {app.jobTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Round Title */}
          <div className="space-y-1.5">
            <Label>Interview Round / Stage</Label>
            <Select value={title} onValueChange={setTitle}>
              <SelectTrigger>
                <SelectValue placeholder="Select round type..." />
              </SelectTrigger>
              <SelectContent>
                {COMMON_ROUNDS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
                <SelectItem value="CUSTOM">Custom Title...</SelectItem>
              </SelectContent>
            </Select>

            {title === 'CUSTOM' && (
              <Input
                placeholder="e.g. VP Engineering Chat"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="mt-2"
                required
              />
            )}
          </div>

          {/* Date and Time */}
          <div className="space-y-1.5">
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
            />
          </div>

          {/* Video Meeting URL */}
          <div className="space-y-1.5">
            <Label>Meeting Link (Optional)</Label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="https://meet.google.com/xyz or Zoom link"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Location or Additional Note */}
          <div className="space-y-1.5">
            <Label>Location / Prep Notes (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Office address, or 'Review system design'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
