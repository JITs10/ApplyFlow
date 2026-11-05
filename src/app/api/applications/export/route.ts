import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateApplicationsCsv } from '@/lib/export/csv'

export async function GET() {
  const user = await requireUser()

  const applications = await db.application.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      resume: {
        select: { fileName: true },
      },
    },
  })

  const exportData = applications.map((app) => ({
    company: app.company,
    jobTitle: app.jobTitle,
    status: app.status,
    location: app.location,
    workMode: app.workMode,
    salaryMin: app.salaryMin ? Number(app.salaryMin) : null,
    salaryMax: app.salaryMax ? Number(app.salaryMax) : null,
    currency: app.currency,
    applicationDate: app.applicationDate,
    nextFollowUpAt: app.nextFollowUpAt,
    contactName: app.contactName,
    contactEmail: app.contactEmail,
    resumeFileName: app.resume?.fileName,
    jobUrl: app.jobUrl,
    generalNotes: app.generalNotes,
  }))

  const csvContent = generateApplicationsCsv(exportData)
  const dateStr = new Date().toISOString().split('T')[0]

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="applyflow-applications-${dateStr}.csv"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
