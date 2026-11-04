'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { uploadResumeAction } from '@/actions/resumes'
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ResumeUploader() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)

    const isPdfOrWord =
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc')

    if (!isPdfOrWord) {
      setError('Please upload a PDF or Word document (.pdf, .docx)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10 MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadResumeAction(formData)
    setUploading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    router.refresh()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-6">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center py-8 px-4 text-center rounded-lg border-2 border-dashed cursor-pointer transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleChange}
            className="hidden"
          />

          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>

          <h3 className="font-semibold text-base mb-1">
            {uploading ? 'Uploading your resume...' : 'Click or drag resume file to upload'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            Supports PDF and Word documents (.pdf, .docx) up to 10 MB. Files are stored securely on cloud CDN.
          </p>

          <Button size="sm" disabled={uploading} type="button">
            {uploading ? 'Processing...' : 'Browse File'}
          </Button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-md bg-destructive/15 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
