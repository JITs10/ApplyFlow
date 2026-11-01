import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Clock, Calendar, Trophy, TrendingUp } from 'lucide-react'

interface StatsGridProps {
  total: number
  inReview: number
  interviews: number
  offers: number
}

export function StatsGrid({ total, inReview, interviews, offers }: StatsGridProps) {
  const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0

  const stats = [
    {
      title: 'Total Applications',
      value: total,
      description: 'Total roles tracked in ApplyFlow',
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'In Review / Waiting',
      value: inReview,
      description: 'Applied & assessments in progress',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Active Interviews',
      value: interviews,
      description: 'Interview rounds scheduled',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Offers Received',
      value: offers,
      description: `${responseRate}% interview/offer response rate`,
      icon: Trophy,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
