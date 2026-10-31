'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, type ApplicationInput } from '@/lib/validation/application'
import { createApplication, updateApplication } from '@/actions/applications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Loader2, Calendar } from 'lucide-react'

interface ApplicationFormProps {
  initialData?: ApplicationInput & { id?: string }
  isEditing?: boolean
}

export function ApplicationForm({ initialData, isEditing }: ApplicationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: initialData || {
      company: '',
      jobTitle: '',
      description: '',
      jobUrl: '',
      location: '',
      workMode: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      currency: 'INR',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'WISHLIST',
      contactName: '',
      contactEmail: '',
      nextFollowUpAt: '',
      generalNotes: '',
      interviewDate: '',
      assessmentDate: '',
    },
  })

  const currentStatus = watch('status')
  const currentWorkMode = watch('workMode')
  const currentCurrency = watch('currency')

  async function onSubmit(data: ApplicationInput) {
    try {
      setIsSubmitting(false)

      if (isEditing && initialData?.id) {
        await updateApplication(initialData.id, data)
        toast.success('Application updated successfully')
        router.push(`/applications/${initialData.id}`)
      } else {
        const result = await createApplication(data)
        toast.success('Application created successfully')
        router.push(`/applications/${result.id}`)
      }
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save application'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={isEditing && initialData?.id ? `/applications/${initialData.id}` : '/applications'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Application' : 'Add New Application'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? 'Update the details for this job opportunity.'
              : 'Record a new job opportunity or submitted application.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role & Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="e.g. Google, Stripe"
                  {...register('company')}
                />
                {errors.company && (
                  <p className="text-xs text-destructive">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Frontend Engineer"
                  {...register('jobTitle')}
                />
                {errors.jobTitle && (
                  <p className="text-xs text-destructive">{errors.jobTitle.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Application Stage</Label>
                <Select
                  value={currentStatus}
                  onValueChange={(val: any) => setValue('status', val)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WISHLIST">Wishlist</SelectItem>
                    <SelectItem value="APPLIED">Applied</SelectItem>
                    <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                    <SelectItem value="INTERVIEW">Interview</SelectItem>
                    <SelectItem value="OFFER">Offer</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-destructive">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDate">Application Date</Label>
                <Input
                  id="applicationDate"
                  type="date"
                  {...register('applicationDate')}
                />
                {errors.applicationDate && (
                  <p className="text-xs text-destructive">{errors.applicationDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job Posting Link</Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="https://company.com/careers/role"
                {...register('jobUrl')}
              />
              {errors.jobUrl && (
                <p className="text-xs text-destructive">{errors.jobUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Scheduling Card for Interview */}
        {currentStatus === 'INTERVIEW' && (
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Calendar className="h-4 w-4" />
                Scheduled Interview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="interviewDate">Interview Date & Time</Label>
                <Input
                  id="interviewDate"
                  type="datetime-local"
                  {...register('interviewDate')}
                />
                <p className="text-xs text-muted-foreground">
                  This will automatically appear in your Scheduled Interviews list and on the Calendar.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Scheduling Card for Assessment */}
        {currentStatus === 'ASSESSMENT' && (
          <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <Calendar className="h-4 w-4" />
                Assessment Deadline / Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="assessmentDate">Assessment Due Date & Time</Label>
                <Input
                  id="assessmentDate"
                  type="datetime-local"
                  {...register('assessmentDate')}
                />
                <p className="text-xs text-muted-foreground">
                  This will automatically appear in your Scheduled Interviews list and on the Calendar.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location & Compensation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location & Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Bengaluru, IN or Remote"
                  {...register('location')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workMode">Work Arrangement</Label>
                <Select
                  value={currentWorkMode || ''}
                  onValueChange={(val: any) => setValue('workMode', val || undefined)}
                >
                  <SelectTrigger id="workMode">
                    <SelectValue placeholder="Select arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="ONSITE">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currentCurrency}
                  onValueChange={(val) => setValue('currency', val)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  min="0"
                  placeholder="e.g. 1200000"
                  {...register('salaryMin')}
                />
                {errors.salaryMin && (
                  <p className="text-xs text-destructive">{errors.salaryMin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  min="0"
                  placeholder="e.g. 1800000"
                  {...register('salaryMax')}
                />
                {errors.salaryMax && (
                  <p className="text-xs text-destructive">{errors.salaryMax.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts & Follow-up */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recruiter & Follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Recruiter / Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="e.g. Jane Doe"
                  {...register('contactName')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Recruiter Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="jane.doe@company.com"
                  {...register('contactEmail')}
                />
                {errors.contactEmail && (
                  <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextFollowUpAt">Next Follow-up Date</Label>
              <Input
                id="nextFollowUpAt"
                type="date"
                {...register('nextFollowUpAt')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes & Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="generalNotes">General Notes</Label>
              <Textarea
                id="generalNotes"
                rows={3}
                placeholder="Key requirements, referral notes, team details..."
                {...register('generalNotes')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Paste the full job description or key highlights..."
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}
          >
            <Link href={isEditing && initialData?.id ? `/applications/${initialData.id}` : '/applications'}>
              Cancel
            </Link>
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Application'}
          </Button>
        </div>
      </form>
    </div>
  )
}
