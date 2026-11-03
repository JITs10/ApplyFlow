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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createFollowUp } from '@/actions/follow-ups'
import { Plus, Bell, Loader2 } from 'lucide-react'

interface ApplicationOption {
  id: string
  company: string
  jobTitle: string
}

interface ScheduleFollowUpDialogProps {
  applications: ApplicationOption[]
  defaultApplicationId?: string
  triggerText?: string
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost'
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon'
}

const TEMPLATES = [
  {
    label: 'Post-application check-in (1 week)',
    days: 7,
    text: 'Sent application 1 week ago. Check in with recruiter or hiring team on status.',
  },
  {
    label: 'Post-interview thank you note (24 hours)',
    days: 1,
    text: 'Send thank you email expressing enthusiasm and reiterating key fit for the role.',
  },
  {
    label: 'Post-interview feedback check-in (1 week)',
    days: 7,
    text: 'Interview completed 1 week ago. Polite follow-up to ask about next steps and timeline.',
  },
  {
    label: 'Offer decision / update check-in',
    days: 3,
    text: 'Check in on pending offer details or final decision timeline.',
  },
]

export function ScheduleFollowUpDialog({
  applications,
  defaultApplicationId,
  triggerText = 'Add Follow-up',
  triggerVariant = 'default',
  triggerSize = 'default',
}: ScheduleFollowUpDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Default due date: 7 days from today
  const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [applicationId, setApplicationId] = useState(defaultApplicationId || applications[0]?.id || '')
  const [dueAt, setDueAt] = useState(defaultDate)
  const [notes, setNotes] = useState(TEMPLATES[0].text)
  const [sendEmail, setSendEmail] = useState(true)

  const applyTemplate = (index: number) => {
    const tmpl = TEMPLATES[index]
    if (!tmpl) return
    const targetDate = new Date(Date.now() + tmpl.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    setDueAt(targetDate)
    setNotes(tmpl.text)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!applicationId) {
      setError('Please select an application')
      return
    }

    if (!dueAt) {
      setError('Please choose a due date')
      return
    }

    setLoading(true)

    // Schedule reminder on the morning of due date (9:00 AM) if email option is checked
    const dueDateObj = new Date(dueAt)
    dueDateObj.setHours(9, 0, 0, 0)

    const result = await createFollowUp({
      applicationId,
      dueAt: dueDateObj.toISOString(),
      reminderAt: sendEmail ? dueDateObj.toISOString() : undefined,
      notes: notes.trim() || undefined,
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
          <DialogTitle>Set Follow-Up Reminder</DialogTitle>
          <DialogDescription>
            Schedule a check-in reminder so you never drop communication with recruiters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 text-xs rounded-md bg-destructive/15 text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Application Selection */}
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

          {/* Quick Note & Timing Templates */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Quick Shortcuts</Label>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={tmpl.label}
                  type="button"
                  onClick={() => applyTemplate(idx)}
                  className="text-xs px-2.5 py-1 rounded-md border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label>Follow-Up Due Date</Label>
            <Input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes & Goal</Label>
            <Textarea
              placeholder="What do you plan to say or ask in this follow-up?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Email Reminder Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="sendEmail" className="text-xs font-normal cursor-pointer flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-primary" />
              Send automated email reminder to my inbox on due date (9:00 AM)
            </Label>
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
              Set Follow-up
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
