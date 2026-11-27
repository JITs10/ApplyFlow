'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteApplication } from '@/actions/applications'
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
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { showGuestSignInWarning, GUEST_RESTRICTION_ERROR } from '@/lib/guest-warning'

export function DeleteApplicationDialog({
  id,
  company,
  jobTitle,
}: {
  id: string
  company: string
  jobTitle: string
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      setIsDeleting(true)
      const res = await deleteApplication(id)
      if (res && !res.success) {
        if (res.error === GUEST_RESTRICTION_ERROR) {
          showGuestSignInWarning(res.message)
          setOpen(false)
          return
        }
        toast.error(res.error || 'Failed to delete application')
        return
      }
      toast.success('Application deleted')
      setOpen(false)
      router.push('/applications')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete application'
      if (message.includes('441') || message.includes('GUEST_MODE_RESTRICTED')) {
        showGuestSignInWarning()
        setOpen(false)
      } else {
        toast.error(message)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Application?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your application for{' '}
            <strong className="text-foreground">{jobTitle}</strong> at{' '}
            <strong className="text-foreground">{company}</strong>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
