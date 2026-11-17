'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Check, Mail, Sparkles, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Template {
  id: string
  title: string
  subtitle: string
  badge: string
  getSubject: (company: string, role: string) => string
  getBody: (company: string, role: string, contact: string) => string
}

const TEMPLATES: Template[] = [
  {
    id: 'check-in',
    title: 'Application Follow-Up',
    subtitle: 'Send 7–10 days after applying if you haven\'t heard back',
    badge: 'Applied',
    getSubject: (c, r) => `Following up on my ${r} application — ${c}`,
    getBody: (c, r, contact) =>
      `Hi ${contact},\n\nI hope your week is going well.\n\nI recently applied for the ${r} position at ${c} and wanted to check in. I'm very excited about what the team is building and would love the opportunity to contribute.\n\nPlease let me know if there is any additional information, portfolio links, or references I can share to help with your review.\n\nBest regards,\n[Your Name]`,
  },
  {
    id: 'thank-you',
    title: 'Thank You After Interview',
    subtitle: 'Send within 24 hours of your interview',
    badge: 'Interview',
    getSubject: (c, r) => `Thank you — ${r} interview at ${c}`,
    getBody: (c, r, contact) =>
      `Hi ${contact},\n\nThank you so much for taking the time to speak with me today about the ${r} role at ${c}.\n\nI really enjoyed learning more about the team, especially our conversation about [mention a specific topic or challenge discussed]. The discussion made me even more excited about the opportunity to join ${c}.\n\nPlease let me know if you need any additional information from my side. Looking forward to hearing about next steps.\n\nBest regards,\n[Your Name]`,
  },
  {
    id: 'timeline-check',
    title: 'Checking on Status',
    subtitle: 'Send when the expected decision date has passed',
    badge: 'Status',
    getSubject: (c, r) => `Checking in on ${r} application — ${c}`,
    getBody: (c, r, contact) =>
      `Hi ${contact},\n\nI hope you're having a great week.\n\nI'm following up on our recent interview for the ${r} role at ${c}. I remain very interested in the opportunity and wanted to see if there are any updates regarding next steps or your decision timeline.\n\nThank you again for your time and guidance throughout the process.\n\nBest regards,\n[Your Name]`,
  },
  {
    id: 'offer-negotiation',
    title: 'Discussing the Offer',
    subtitle: 'Questions about offer details, timeline, or compensation',
    badge: 'Offer',
    getSubject: (c, r) => `Questions regarding ${r} offer — ${c}`,
    getBody: (c, r, contact) =>
      `Hi ${contact},\n\nThank you so much for extending the offer for the ${r} role at ${c}. I'm thrilled about the prospect of joining the team.\n\nI've reviewed the offer and would love to schedule a brief 10–15 minute call to discuss a few specific questions regarding [mention topic: salary / start date / benefits] before finalizing.\n\nPlease let me know what day and time works best for a quick chat this week.\n\nBest regards,\n[Your Name]`,
  },
]

interface EmailTemplatesDialogProps {
  company?: string
  jobTitle?: string
  contactName?: string
  contactEmail?: string
  trigger?: React.ReactNode
}

export function EmailTemplatesDialog({
  company = '[Company Name]',
  jobTitle = '[Job Title]',
  contactName = 'Hiring Team',
  contactEmail,
  trigger,
}: EmailTemplatesDialogProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id)
  const [copied, setCopied] = useState(false)

  const activeTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0]
  const subject = activeTemplate.getSubject(company, jobTitle)
  const body = activeTemplate.getBody(company, jobTitle, contactName)

  const handleCopy = async () => {
    const fullText = `Subject: ${subject}\n\n${body}`
    await navigator.clipboard.writeText(fullText)
    setCopied(true)
    toast.success('Template copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const mailtoHref = `mailto:${contactEmail || ''}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Email Templates
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-card border-border shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-foreground text-background font-mono text-[10px] font-bold flex items-center justify-center">
              AF
            </div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Follow-Up Email Templates
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ready-to-use email templates for following up after applying, thanking interviewers, or checking on next steps.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="px-4 sm:px-5 pt-3 border-b border-border/60 bg-card flex gap-2 overflow-x-auto">
          {TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`pb-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap px-1 ${
                  isSelected
                    ? 'border-foreground text-foreground font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tmpl.title}
              </button>
            )
          })}
        </div>

        {/* Template Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="text-[11px] font-mono text-muted-foreground uppercase">
              Subject Line
            </label>
            <div className="p-2.5 rounded-md bg-muted/40 border border-border/80 font-mono text-xs text-foreground mt-1 select-all">
              {subject}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-muted-foreground uppercase">
              Email Body
            </label>
            <div className="p-3.5 rounded-md bg-muted/30 border border-border/80 text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans mt-1 max-h-56 overflow-y-auto select-all">
              {body}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/60">
            <span className="text-[11px] text-muted-foreground font-mono">
              For: <strong className="text-foreground">{company}</strong> &bull; {jobTitle}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-xs flex-1 sm:flex-initial h-8"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </Button>

              <Button
                asChild
                size="sm"
                className="gap-1.5 text-xs flex-1 sm:flex-initial h-8"
              >
                <a href={mailtoHref}>
                  <Mail className="h-3.5 w-3.5" />
                  Open in Mail
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
