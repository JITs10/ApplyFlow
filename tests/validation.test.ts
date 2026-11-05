import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { applicationSchema } from '../src/lib/validation/application.ts'
import { interviewSchema } from '../src/lib/validation/interview.ts'
import { followUpSchema } from '../src/lib/validation/follow-up.ts'

describe('Form Validation Schemas', () => {
  describe('applicationSchema', () => {
    it('accepts a valid application input', () => {
      const valid = {
        company: 'Microsoft',
        jobTitle: 'Software Engineer II',
        status: 'APPLIED',
        currency: 'INR',
        salaryMin: 2000000,
        salaryMax: 3000000,
        jobUrl: 'https://careers.microsoft.com/job/12345',
        contactEmail: 'recruiter@microsoft.com',
      }
      const parsed = applicationSchema.safeParse(valid)
      assert.strictEqual(parsed.success, true)
    })

    it('rejects an empty company name', () => {
      const invalid = {
        company: '   ',
        jobTitle: 'Engineer',
        status: 'WISHLIST',
        currency: 'INR',
      }
      const parsed = applicationSchema.safeParse(invalid)
      assert.strictEqual(parsed.success, false)
      if (!parsed.success) {
        assert.strictEqual(parsed.error.issues[0].message, 'Company name is required')
      }
    })

    it('rejects when salaryMin is greater than salaryMax', () => {
      const invalid = {
        company: 'Startup',
        jobTitle: 'Founder',
        status: 'OFFER',
        currency: 'USD',
        salaryMin: 150000,
        salaryMax: 100000,
      }
      const parsed = applicationSchema.safeParse(invalid)
      assert.strictEqual(parsed.success, false)
      if (!parsed.success) {
        assert.strictEqual(parsed.error.issues[0].message, 'Minimum salary cannot exceed maximum salary')
      }
    })

    it('rejects malformed URLs', () => {
      const invalid = {
        company: 'Test Corp',
        jobTitle: 'Dev',
        status: 'APPLIED',
        currency: 'INR',
        jobUrl: 'not-a-url',
      }
      const parsed = applicationSchema.safeParse(invalid)
      assert.strictEqual(parsed.success, false)
    })
  })

  describe('interviewSchema', () => {
    it('trims titles and validates required fields', () => {
      const valid = {
        applicationId: 'app_123',
        title: '  Technical Screen  ',
        startAt: '2026-11-10T14:30',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
      }
      const parsed = interviewSchema.safeParse(valid)
      assert.strictEqual(parsed.success, true)
      if (parsed.success) {
        assert.strictEqual(parsed.data.title, 'Technical Screen')
      }
    })

    it('requires a non-empty startAt', () => {
      const invalid = {
        applicationId: 'app_123',
        title: 'Screening',
        startAt: '',
      }
      const parsed = interviewSchema.safeParse(invalid)
      assert.strictEqual(parsed.success, false)
    })
  })

  describe('followUpSchema', () => {
    it('validates applicationId and dueAt', () => {
      const valid = {
        applicationId: 'app_abc',
        dueAt: '2026-11-12',
        notes: 'Follow up after referral submit',
      }
      const parsed = followUpSchema.safeParse(valid)
      assert.strictEqual(parsed.success, true)
    })
  })
})
