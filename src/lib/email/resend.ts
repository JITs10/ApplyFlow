import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not defined. Email will not be sent.')
    return null
  }
  return new Resend(apiKey)
}

const FROM = process.env.RESEND_FROM_EMAIL ?? 'reminders@applyflow.app'

export async function sendReminderEmail(
  to: string,
  data: { company: string; jobTitle: string; dueAt: Date }
) {
  const resend = getResendClient()
  if (!resend) {
    return { success: false, error: 'Email service not configured' }
  }

  return resend.emails.send({
    from: `ApplyFlow <${FROM}>`,
    to,
    subject: `Follow-up reminder: ${data.company}`,
    html: `
      <p>Hi,</p>
      <p>Your follow-up for <strong>${data.jobTitle}</strong> at <strong>${data.company}</strong> is due on <strong>${data.dueAt.toDateString()}</strong>.</p>
      <p>Log in to ApplyFlow to update or reschedule it.</p>
    `,
  })
}
