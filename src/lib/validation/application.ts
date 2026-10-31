import { z } from 'zod'

export const applicationSchema = z.object({
  company: z.string().trim().min(1, 'Company name is required'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  description: z.string().optional(),
  jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  workMode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']).optional(),
  salaryMin: z.coerce.number().nonnegative().optional(),
  salaryMax: z.coerce.number().nonnegative().optional(),
  currency: z.string().min(1),
  applicationDate: z.string().optional(),
  status: z.enum([
    'WISHLIST',
    'APPLIED',
    'ASSESSMENT',
    'INTERVIEW',
    'OFFER',
    'REJECTED',
    'WITHDRAWN',
  ]),
  resumeId: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  nextFollowUpAt: z.string().optional(),
  generalNotes: z.string().optional(),
  interviewDate: z.string().optional(),
  assessmentDate: z.string().optional(),
}).refine(
  data => !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
  { message: 'Minimum salary cannot exceed maximum salary', path: ['salaryMin'] }
)

export type ApplicationInput = z.infer<typeof applicationSchema>
