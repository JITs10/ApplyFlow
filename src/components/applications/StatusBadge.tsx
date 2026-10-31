import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@prisma/client'

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  WISHLIST: {
    label: 'Wishlist',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  },
  APPLIED: {
    label: 'Applied',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  ASSESSMENT: {
    label: 'Assessment',
    className: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  INTERVIEW: {
    label: 'Interview',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  OFFER: {
    label: 'Offer',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
  },
}

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-muted text-muted-foreground',
  }

  return (
    <Badge
      variant="outline"
      className={cn('font-medium border', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
