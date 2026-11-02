import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { CalendarView } from '@/components/calendar/CalendarView'

export const metadata = {
  title: 'Interview Calendar — ApplyFlow',
}

export default async function CalendarPage() {
  const user = await requireUser()

  const [interviews, applications] = await Promise.all([
    db.interview.findMany({
      where: { userId: user.id },
      orderBy: { startAt: 'asc' },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            jobTitle: true,
          },
        },
      },
    }),
    db.application.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        company: true,
        jobTitle: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return <CalendarView interviews={interviews} applications={applications} />
}
