import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { escapeCsvField, generateApplicationsCsv, CSV_HEADERS } from '../src/lib/export/csv.ts'

describe('CSV Export Utilities', () => {
  it('escapes standard strings by wrapping in double quotes', () => {
    assert.strictEqual(escapeCsvField('Google'), '"Google"')
  })

  it('escapes quotes inside strings by doubling them per RFC 4180', () => {
    assert.strictEqual(escapeCsvField('Senior "Lead" Engineer'), '"Senior ""Lead"" Engineer"')
  })

  it('escapes commas and special characters cleanly', () => {
    assert.strictEqual(escapeCsvField('Bengaluru, Karnataka'), '"Bengaluru, Karnataka"')
  })

  it('handles null and undefined gracefully', () => {
    assert.strictEqual(escapeCsvField(null), '""')
    assert.strictEqual(escapeCsvField(undefined), '""')
  })

  it('generates a well-formed CSV file with headers and records', () => {
    const records = [
      {
        company: 'Stripe, Inc.',
        jobTitle: 'Backend "Core" Engineer',
        status: 'INTERVIEW',
        location: 'Remote, India',
        workMode: 'REMOTE',
        salaryMin: 2500000,
        salaryMax: 3500000,
        currency: 'INR',
        applicationDate: new Date('2026-11-01T00:00:00.000Z'),
        nextFollowUpAt: '2026-11-08',
        contactName: 'Jane Recruiter',
        contactEmail: 'jane@stripe.com',
        resumeFileName: 'Backend-Resume.pdf',
        jobUrl: 'https://stripe.com/jobs/123',
        generalNotes: 'Passed first screen; preparing system design.',
      },
    ]

    const csv = generateApplicationsCsv(records)
    const lines = csv.split('\r\n')

    assert.strictEqual(lines.length, 2)
    assert.strictEqual(lines[0], CSV_HEADERS.join(','))
    assert.ok(lines[1].includes('"Stripe, Inc."'))
    assert.ok(lines[1].includes('"Backend ""Core"" Engineer"'))
    assert.ok(lines[1].includes('"2026-11-01"'))
    assert.ok(lines[1].includes('"Backend-Resume.pdf"'))
  })
})
