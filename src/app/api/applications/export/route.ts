import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'

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

  const headers = [
    'Company',
    'Job Title',
    'Status',
    'Location',
    'Work Mode',
    'Min Salary',
    'Max Salary',
    'Currency',
    'Application Date',
    'Next Follow-up Date',
    'Contact Name',
    'Contact Email',
    'Attached Resume',
    'Job Posting URL',
    'Notes',
  ]

  const escapeCsv = (val: unknown): string => {
    if (val === null || val === undefined) return '""'
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }

  const rows = applications.map((app) => [
    escapeCsv(app.company),
    escapeCsv(app.jobTitle),
    escapeCsv(app.status),
    escapeCsv(app.location || ''),
    escapeCsv(app.workMode || ''),
    escapeCsv(app.salaryMin ? Number(app.salaryMin) : ''),
    escapeCsv(app.salaryMax ? Number(app.salaryMax) : ''),
    escapeCsv(app.currency),
    escapeCsv(app.applicationDate ? app.applicationDate.toISOString().split('T')[0] : ''),
    escapeCsv(app.nextFollowUpAt ? app.nextFollowUpAt.toISOString().split('T')[0] : ''),
    escapeCsv(app.contactName || ''),
    escapeCsv(app.contactEmail || ''),
    escapeCsv(app.resume?.fileName || ''),
    escapeCsv(app.jobUrl || ''),
    escapeCsv(app.generalNotes || ''),
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')

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
