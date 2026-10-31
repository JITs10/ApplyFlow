import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ApplicationForm } from '@/components/applications/ApplicationForm'

interface Props {
  params: Promise<{ id: string }>
}

function formatDateTimeLocal(date?: Date | null) {
  if (!date) return ''
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export default async function EditApplicationPage({ params }: Props) {
  const { id } = await params
  const user = await requireUser()

  const application = await db.application.findFirst({
    where: { id, userId: user.id },
    include: {
      interviews: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!application) {
    notFound()
  }

  const interviewEvent = application.interviews.find((i) => i.title === 'Interview')
  const assessmentEvent = application.interviews.find((i) => i.title === 'Assessment')

  const initialData = {
    id: application.id,
    company: application.company,
    jobTitle: application.jobTitle,
    description: application.description || '',
    jobUrl: application.jobUrl || '',
    location: application.location || '',
    workMode: application.workMode || undefined,
    salaryMin: application.salaryMin ? Number(application.salaryMin) : undefined,
    salaryMax: application.salaryMax ? Number(application.salaryMax) : undefined,
    currency: application.currency || 'INR',
    applicationDate: application.applicationDate
      ? application.applicationDate.toISOString().split('T')[0]
      : '',
    status: application.status,
    resumeId: application.resumeId || undefined,
    contactName: application.contactName || '',
    contactEmail: application.contactEmail || '',
    nextFollowUpAt: application.nextFollowUpAt
      ? application.nextFollowUpAt.toISOString().split('T')[0]
      : '',
    generalNotes: application.generalNotes || '',
    interviewDate: formatDateTimeLocal(interviewEvent?.startAt),
    assessmentDate: formatDateTimeLocal(assessmentEvent?.startAt),
  }

  return <ApplicationForm initialData={initialData} isEditing />
}
