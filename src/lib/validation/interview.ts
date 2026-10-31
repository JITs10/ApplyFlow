import { z } from 'zod'

export const interviewSchema = z.object({
  applicationId: z.string().min(1, 'Application is required'),
  title: z.string().min(1, 'Interview title is required').transform(s => s.trim()),
  startAt: z.string().min(1, 'Start date/time is required'),
  endAt: z.string().optional(),
  meetingUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  reminderAt: z.string().optional(),
})

export type InterviewInput = z.infer<typeof interviewSchema>
