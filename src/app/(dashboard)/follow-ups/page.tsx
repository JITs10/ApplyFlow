import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { FollowUpsList } from '@/components/follow-ups/FollowUpsList'

export const metadata = {
  title: 'Follow-ups — ApplyFlow',
}

export default async function FollowUpsPage() {
  const user = await requireUser()

  const [followUps, applications] = await Promise.all([
    db.followUp.findMany({
      where: { userId: user.id },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            jobTitle: true,
            contactName: true,
            contactEmail: true,
          },
        },
      },
      orderBy: { dueAt: 'asc' },
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

  return <FollowUpsList followUps={followUps} applications={applications} />
}
