import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@prisma/client'

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  WISHLIST: {
    label: 'Wishlist',
    dotClass: 'bg-stone-400',
    badgeClass: 'border-border bg-muted/60 text-muted-foreground',
  },
  APPLIED: {
    label: 'Applied',
    dotClass: 'bg-blue-500',
    badgeClass: 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  },
  ASSESSMENT: {
    label: 'Assessment',
    dotClass: 'bg-purple-500',
    badgeClass: 'border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  },
  INTERVIEW: {
    label: 'Interview',
    dotClass: 'bg-amber-500',
    badgeClass: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  OFFER: {
    label: 'Offer',
    dotClass: 'bg-emerald-500',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold',
  },
  REJECTED: {
    label: 'Rejected',
    dotClass: 'bg-rose-500',
    badgeClass: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    dotClass: 'bg-stone-400',
    badgeClass: 'border-border bg-muted/40 text-muted-foreground/80',
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
    dotClass: 'bg-muted-foreground',
    badgeClass: 'border-border bg-muted/20 text-muted-foreground',
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-mono text-[11px] font-medium border inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full shadow-2xs',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotClass)} />
      <span>{config.label}</span>
    </Badge>
  )
}
