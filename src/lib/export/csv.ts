export function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""')
  return `"${str}"`
}

export interface ApplicationExportItem {
  company: string
  jobTitle: string
  status: string
  location?: string | null
  workMode?: string | null
  salaryMin?: number | string | null
  salaryMax?: number | string | null
  currency: string
  applicationDate?: Date | string | null
  nextFollowUpAt?: Date | string | null
  contactName?: string | null
  contactEmail?: string | null
  resumeFileName?: string | null
  jobUrl?: string | null
  generalNotes?: string | null
}

export const CSV_HEADERS = [
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

export function generateApplicationsCsv(applications: ApplicationExportItem[]): string {
  const formatDate = (val: Date | string | null | undefined): string => {
    if (!val) return ''
    if (typeof val === 'string') {
      return val.split('T')[0]
    }
    return val.toISOString().split('T')[0]
  }

  const rows = applications.map((app) => [
    escapeCsvField(app.company),
    escapeCsvField(app.jobTitle),
    escapeCsvField(app.status),
    escapeCsvField(app.location || ''),
    escapeCsvField(app.workMode || ''),
    escapeCsvField(app.salaryMin !== null && app.salaryMin !== undefined ? Number(app.salaryMin) : ''),
    escapeCsvField(app.salaryMax !== null && app.salaryMax !== undefined ? Number(app.salaryMax) : ''),
    escapeCsvField(app.currency),
    escapeCsvField(formatDate(app.applicationDate)),
    escapeCsvField(formatDate(app.nextFollowUpAt)),
    escapeCsvField(app.contactName || ''),
    escapeCsvField(app.contactEmail || ''),
    escapeCsvField(app.resumeFileName || ''),
    escapeCsvField(app.jobUrl || ''),
    escapeCsvField(app.generalNotes || ''),
  ])

  return [CSV_HEADERS.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
}
