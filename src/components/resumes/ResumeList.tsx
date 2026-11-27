'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteResumeAction } from '@/actions/resumes'
import { formatDate } from '@/lib/utils'
import { showGuestSignInWarning, GUEST_RESTRICTION_ERROR } from '@/lib/guest-warning'
import {
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Briefcase,
  Eye,
  FileCode,
} from 'lucide-react'

export interface ResumeItem {
  id: string
  fileName: string
  storageKey: string
  fileSize: number
  mimeType: string
  createdAt: string | Date
  _count: {
    applications: number
  }
  applications?: Array<{
    id: string
    company: string
    jobTitle: string
    status: string
  }>
}

interface ResumeListProps {
  resumes: ResumeItem[]
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ResumeList({ resumes }: ResumeListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null)

  const handleDelete = async (id: string, name: string, appCount: number) => {
    const warning =
      appCount > 0
        ? `"${name}" is currently linked to ${appCount} job ${appCount === 1 ? 'application' : 'applications'}. Deleting it will detach it from those applications. Are you sure?`
        : `Are you sure you want to delete "${name}"?`

    if (!confirm(warning)) return

    setDeletingId(id)
    const res = await deleteResumeAction(id)
    setDeletingId(null)
    if (res?.error === GUEST_RESTRICTION_ERROR) {
      showGuestSignInWarning(res.message)
      return
    }
    router.refresh()
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-3 bg-card/40">
        <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No resumes uploaded yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Upload your tailored resume versions to link them to job applications and track which version lands interviews.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => {
          const isPdf = resume.fileName.toLowerCase().endsWith('.pdf')
          const isWord =
            resume.fileName.toLowerCase().endsWith('.docx') ||
            resume.fileName.toLowerCase().endsWith('.doc')

          return (
            <Card
              key={resume.id}
              className="rx-card rounded-xl overflow-hidden flex flex-col justify-between group transition-all"
            >
              {/* RxResume Visual Paper Sheet Preview Frame */}
              <div
                onClick={() => setPreviewResume(resume)}
                className="relative h-64 bg-gradient-to-b from-muted/20 to-muted/50 p-4 border-b border-border/80 cursor-pointer overflow-hidden flex items-center justify-center select-none"
              >
                {/* Format Monogram Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-xs ${
                      isPdf
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                        : isWord
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {isPdf ? 'PDF' : isWord ? 'DOCX' : 'DOC'}
                  </span>
                </div>

                {/* Tactile White Paper A4 Sheet with Live First-Page Preview */}
                <div className="relative w-40 h-56 bg-white text-zinc-900 rounded-xs shadow-xl ring-1 ring-black/15 overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                  {isPdf ? (
                    <>
                      {/* Paper Skeleton Backdrop (renders instantly while PDF stream compiles) */}
                      <div className="absolute inset-0 p-3 flex flex-col justify-between bg-white pointer-events-none select-none">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="h-2 w-20 bg-zinc-900 rounded-2xs" />
                            <div className="h-1 w-6 bg-zinc-400 rounded-2xs" />
                          </div>
                          <div className="h-1 w-24 bg-zinc-500 rounded-2xs" />
                          <div className="h-0.5 w-28 bg-zinc-400 rounded-2xs" />
                          <div className="h-0.5 w-full bg-zinc-200 mt-1" />
                        </div>

                        <div className="space-y-1.5 my-auto">
                          <div className="space-y-0.5">
                            <div className="h-1 w-14 bg-zinc-800 rounded-2xs" />
                            <div className="h-0.5 w-full bg-zinc-300 rounded-2xs" />
                            <div className="h-0.5 w-11/12 bg-zinc-300 rounded-2xs" />
                          </div>
                          <div className="space-y-0.5 pt-1 border-t border-zinc-100">
                            <div className="h-1 w-12 bg-zinc-800 rounded-2xs" />
                            <div className="h-0.5 w-full bg-zinc-300 rounded-2xs" />
                          </div>
                        </div>

                        <div className="pt-1 border-t border-zinc-100 flex items-center justify-between text-[8px] text-zinc-400 font-mono">
                          <span>Page 1</span>
                          <span>ApplyFlow Vault</span>
                        </div>
                      </div>

                      {/* Real Live First-Page PDF Render */}
                      <iframe
                        src={`/api/resumes/${resume.id}/file#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                        title={resume.fileName}
                        className="absolute top-0 left-0 w-[640px] h-[905px] border-0 pointer-events-none origin-top-left scale-[0.25] bg-transparent"
                        tabIndex={-1}
                        loading="lazy"
                      />
                    </>
                  ) : (
                    /* Word Document High-Fidelity Paper Representation */
                    <div className="p-3.5 flex flex-col justify-between h-full bg-white select-none">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="h-2.5 w-24 bg-blue-900 rounded-2xs" />
                          <div className="h-1.5 w-8 bg-blue-400 rounded-2xs" />
                        </div>
                        <div className="h-1.5 w-28 bg-zinc-600 rounded-2xs" />
                        <div className="h-1 w-32 bg-zinc-400 rounded-2xs" />
                        <div className="h-0.5 w-full bg-blue-100 mt-1" />
                      </div>

                      <div className="space-y-2 my-auto">
                        <div className="space-y-1">
                          <div className="h-1.5 w-16 bg-zinc-800 rounded-2xs" />
                          <div className="h-1 w-full bg-zinc-300 rounded-2xs" />
                          <div className="h-1 w-10/12 bg-zinc-300 rounded-2xs" />
                        </div>
                        <div className="space-y-1 pt-1 border-t border-zinc-200">
                          <div className="h-1.5 w-12 bg-zinc-800 rounded-2xs" />
                          <div className="h-1 w-full bg-zinc-300 rounded-2xs" />
                        </div>
                      </div>

                      <div className="pt-1 border-t border-zinc-100 flex items-center justify-between text-[8px] text-zinc-400 font-mono">
                        <span>Word Document</span>
                        <span>.docx</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Quick Action Veil */}
                <div className="absolute inset-0 bg-background/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 z-20">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 gap-1.5 text-xs shadow-lg font-medium"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewResume(resume)
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    Inspect Document
                  </Button>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Click to view full screen
                  </span>
                </div>
              </div>

              {/* Card Meta & Details */}
              <CardContent className="p-4 flex flex-col gap-3 flex-1 justify-between">
                <div className="space-y-2">
                  <div className="min-w-0">
                    <h4
                      className="font-semibold text-xs truncate text-foreground tracking-tight"
                      title={resume.fileName}
                    >
                      {resume.fileName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-0.5">
                      <span>{formatBytes(resume.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(resume.createdAt)}</span>
                    </div>
                  </div>

                  {/* Linked Applications Badge / Pill */}
                  <div className="rounded-md border border-border/70 bg-muted/30 p-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Briefcase className="h-3 w-3 text-foreground" />
                        <span>Active Roles:</span>
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {resume._count.applications}
                      </span>
                    </div>

                    {resume.applications && resume.applications.length > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-border/50 flex flex-wrap gap-1">
                        {resume.applications.slice(0, 3).map((app) => (
                          <span
                            key={app.id}
                            className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border/80 text-muted-foreground truncate max-w-[120px]"
                            title={`${app.company} — ${app.jobTitle}`}
                          >
                            {app.company}
                          </span>
                        ))}
                        {resume.applications.length > 3 && (
                          <span className="text-[10px] font-mono text-muted-foreground px-1 self-center">
                            +{resume.applications.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 flex-1 h-8 text-xs font-medium"
                    onClick={() => setPreviewResume(resume)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Download original file"
                  >
                    <a href={`/api/resumes/${resume.id}/file?download=1`} download>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDelete(resume.id, resume.fileName, resume._count.applications)
                    }
                    disabled={deletingId === resume.id}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Delete resume"
                    aria-label="Delete resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* In-App Modal PDF Inspector */}
      {previewResume && (
        <Dialog open={!!previewResume} onOpenChange={(open) => !open && setPreviewResume(null)}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 flex flex-col overflow-hidden bg-card border-border shadow-2xl">
            {/* Modal Header */}
            <div className="h-14 px-5 border-b border-border/80 flex items-center justify-between bg-card shrink-0">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="p-2 rounded-md bg-muted text-foreground shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-sm font-semibold truncate text-foreground leading-tight">
                    {previewResume.fileName}
                  </DialogTitle>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {formatBytes(previewResume.fileSize)} • Linked to {previewResume._count.applications} {previewResume._count.applications === 1 ? 'role' : 'roles'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pr-12">
                <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs">
                  <a
                    href={`/api/resumes/${previewResume.id}/file?download=1`}
                    download
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 text-xs">
                  <a href={`/api/resumes/${previewResume.id}/file`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Tab
                  </a>
                </Button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 bg-zinc-950 overflow-hidden relative flex items-center justify-center">
              {previewResume.fileName.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`/api/resumes/${previewResume.id}/file`}
                  title={previewResume.fileName}
                  className="w-full h-full border-0 bg-zinc-950"
                />
              ) : (
                <div className="text-center p-8 space-y-3 max-w-sm">
                  <FileCode className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h4 className="text-sm font-semibold text-foreground">In-browser preview unavailable</h4>
                  <p className="text-xs text-muted-foreground">
                    Word (.docx / .doc) documents cannot be rendered directly in the browser. Download the file to inspect in Microsoft Word or Google Docs.
                  </p>
                  <Button asChild size="sm" className="gap-1.5 text-xs mt-2">
                    <a href={`/api/resumes/${previewResume.id}/file?download=1`} download>
                      <Download className="h-3.5 w-3.5" />
                      Download Document
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Modal Linked Applications Footer */}
            {previewResume.applications && previewResume.applications.length > 0 && (
              <div className="p-3 bg-muted/40 border-t border-border/80 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
                <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                  Targeted Roles:
                </span>
                {previewResume.applications.map((app) => (
                  <span
                    key={app.id}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-card border border-border/80 text-foreground shrink-0"
                  >
                    {app.company} ({app.status.toLowerCase()})
                  </span>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
