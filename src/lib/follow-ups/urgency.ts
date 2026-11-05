import { differenceInCalendarDays } from 'date-fns'

export type UrgencyTier = 'OVERDUE' | 'TODAY' | 'TOMORROW' | 'UPCOMING'

export interface UrgencyInfo {
  tier: UrgencyTier
  diffDays: number
  label: string
}

export function calculateUrgency(dueAt: Date | string, referenceDate: Date = new Date()): UrgencyInfo {
  const target = typeof dueAt === 'string' ? new Date(dueAt) : dueAt
  const diff = differenceInCalendarDays(target, referenceDate)

  if (diff < 0) {
    const days = Math.abs(diff)
    return {
      tier: 'OVERDUE',
      diffDays: diff,
      label: `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`,
    }
  }

  if (diff === 0) {
    return {
      tier: 'TODAY',
      diffDays: 0,
      label: 'Due Today',
    }
  }

  if (diff === 1) {
    return {
      tier: 'TOMORROW',
      diffDays: 1,
      label: 'Due Tomorrow',
    }
  }

  return {
    tier: 'UPCOMING',
    diffDays: diff,
    label: `Due in ${diff} days`,
  }
}
