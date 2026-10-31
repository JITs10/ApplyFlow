import { z } from 'zod'

export const followUpSchema = z.object({
  applicationId: z.string().min(1, 'Application is required'),
  dueAt: z.string().min(1, 'Due date is required'),
  reminderAt: z.string().optional(),
  notes: z.string().optional(),
})

export type FollowUpInput = z.infer<typeof followUpSchema>
