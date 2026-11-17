import { Card, CardContent } from '@/components/ui/card'

interface StatsGridProps {
  total: number
  inReview: number
  interviews: number
  offers: number
}

export function StatsGrid({ total, inReview, interviews, offers }: StatsGridProps) {
  const otherCount = Math.max(0, total - (inReview + interviews + offers))

  const inReviewPct = total > 0 ? (inReview / total) * 100 : 0
  const interviewsPct = total > 0 ? (interviews / total) * 100 : 0
  const offersPct = total > 0 ? (offers / total) * 100 : 0
  const otherPct = total > 0 ? (otherCount / total) * 100 : 0

  const metrics = [
    { label: 'Total Tracked', value: total, detail: 'Total applications' },
    { label: 'Waiting / Review', value: inReview, detail: 'Applied & assessments' },
    { label: 'Active Interviews', value: interviews, detail: 'Scheduled rounds' },
    { label: 'Offers Received', value: offers, detail: `${total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0}% success rate` },
  ]

  return (
    <div className="space-y-4">
      {/* 4 Clean Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="rx-card p-4 rounded-xl relative overflow-hidden card-interactive group">
            <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
            <div className="text-2xl font-bold tracking-tight mt-1 font-mono text-foreground">{m.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{m.detail}</div>
          </Card>
        ))}
      </div>

      {/* Stage Distribution Progress Bar */}
      {total > 0 && (
        <div className="rx-card p-3.5 rounded-xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Application Stages</span>
            <span className="font-mono text-muted-foreground text-[11px]">
              {total} total applications
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
            {inReviewPct > 0 && (
              <div
                style={{ width: `${inReviewPct}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Applied/Review: ${inReview}`}
              />
            )}
            {interviewsPct > 0 && (
              <div
                style={{ width: `${interviewsPct}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Interviews: ${interviews}`}
              />
            )}
            {offersPct > 0 && (
              <div
                style={{ width: `${offersPct}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Offers: ${offers}`}
              />
            )}
            {otherPct > 0 && (
              <div
                style={{ width: `${otherPct}%` }}
                className="bg-zinc-400 dark:bg-zinc-600 h-full transition-all"
                title={`Other: ${otherCount}`}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Applied/Review ({inReview})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Interviews ({interviews})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Offers ({offers})
            </span>
            {otherCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600"></span> Other ({otherCount})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
