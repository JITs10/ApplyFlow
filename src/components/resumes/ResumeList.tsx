'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteResumeAction } from '@/actions/resumes'
import { formatDate } from '@/lib/utils'
import {
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Briefcase,
  Calendar,
  HardDrive,
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

  const handleDelete = async (id: string, name: string, appCount: number) => {
    const warning =
      appCount > 0
        ? `"${name}" is currently linked to ${appCount} job ${appCount === 1 ? 'application' : 'applications'}. Deleting it will detach it from those applications. Are you sure?`
        : `Are you sure you want to delete "${name}"?`

    if (!confirm(warning)) return

    setDeletingId(id)
    await deleteResumeAction(id)
    setDeletingId(null)
    router.refresh()
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center space-y-3 bg-card">
        <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold">No resumes uploaded yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Upload your tailored resumes above to link them with job applications and track which version got you interviews.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => {
        const isPdf = resume.fileName.toLowerCase().endsWith('.pdf')
        const isWord =
          resume.fileName.toLowerCase().endsWith('.docx') ||
          resume.fileName.toLowerCase().endsWith('.doc')

        return (
          <Card key={resume.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      isPdf
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : isWord
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm truncate" title={resume.fileName}>
                      {resume.fileName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {formatBytes(resume.fileSize)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(resume.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md">
                  <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    Linked to{' '}
                    <strong className="text-foreground">
                      {resume._count.applications}
                    </strong>{' '}
                    {resume._count.applications === 1 ? 'application' : 'applications'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" asChild className="gap-1.5 flex-1 h-8 text-xs">
                  <a href={resume.storageKey} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3.5 w-3.5" />
                    View / Download
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(resume.id, resume.fileName, resume._count.applications)}
                  disabled={deletingId === resume.id}
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  aria-label="Delete resume"
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
}
