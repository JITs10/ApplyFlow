import { db } from '@/lib/db'
import { sendReminderEmail } from '@/lib/email/resend'

export async function GET(req: Request) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const due = await db.notification.findMany({
    where: { status: 'PENDING', scheduledAt: { lte: new Date() } },
    include: {
      followUp: {
        include: { application: true, user: true },
      },
    },
    take: 50,
  })

  let sent = 0
  let failed = 0

  for (const n of due) {
    try {
      await sendReminderEmail(n.followUp.user.email, {
        company: n.followUp.application.company,
        jobTitle: n.followUp.application.jobTitle,
        dueAt: n.followUp.dueAt,
      })
      await db.notification.update({
        where: { id: n.id },
        data: { status: 'SENT', sentAt: new Date() },
      })
      sent++
    } catch (err) {
      await db.notification.update({
        where: { id: n.id },
        data: {
          status: n.attempts + 1 >= 3 ? 'FAILED' : 'PENDING',
          attempts: { increment: 1 },
          lastError: String(err),
        },
      })
      failed++
    }
  }

  return Response.json({ processed: due.length, sent, failed })
}
