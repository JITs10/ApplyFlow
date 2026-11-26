import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { CalendarView } from '@/components/calendar/CalendarView'

export const metadata = {
  title: 'Interview Calendar — ApplyFlow',
}

export default async function CalendarPage() {
  const user = await requireUser()

  let interviews: any[] = []
  let applications: any[] = []

  try {
    const results = await Promise.all([
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
    interviews = results[0]
    applications = results[1]
  } catch (err) {
    console.warn('Calendar DB query failed or DB offline, using empty defaults:', err)
  }

  return <CalendarView interviews={interviews} applications={applications} />
}
