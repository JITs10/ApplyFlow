import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ApplicationForm } from '@/components/applications/ApplicationForm'

export const metadata = {
  title: 'Add Application — ApplyFlow',
}

export default async function NewApplicationPage() {
  const user = await requireUser()

  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    select: { id: true, fileName: true },
    orderBy: { createdAt: 'desc' },
  })

  return <ApplicationForm resumes={resumes} />
}
