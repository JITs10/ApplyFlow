import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'

export const metadata = {
  title: 'Kanban Board — ApplyFlow',
  description: 'Visual drag-and-drop pipeline for your active interview stages.',
}

export default async function KanbanPage() {
  const user = await requireUser()

  const rawApplications = await db.application.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      company: true,
      jobTitle: true,
      status: true,
      location: true,
      workMode: true,
      salaryMin: true,
      salaryMax: true,
      currency: true,
      nextFollowUpAt: true,
      updatedAt: true,
      jobUrl: true,
      resume: {
        select: { fileName: true },
      },
      interviews: {
        select: { startAt: true, title: true },
        orderBy: { startAt: 'asc' },
        take: 1,
      },
    },
  })

  // Format decimal values to clean numbers for client component serialization
  const applications = rawApplications.map((app) => ({
    ...app,
    salaryMin: app.salaryMin ? Number(app.salaryMin) : null,
    salaryMax: app.salaryMax ? Number(app.salaryMax) : null,
  }))

  return <KanbanBoard initialApplications={applications} />
}
