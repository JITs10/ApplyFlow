import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calculateUrgency } from '../src/lib/follow-ups/urgency.ts'

describe('Follow-Up Urgency Engine', () => {
  const referenceDate = new Date('2026-11-05T12:00:00Z')

  it('marks follow-ups past the reference date as OVERDUE with correct day count', () => {
    const overdueDate = new Date('2026-11-02T12:00:00Z')
    const result = calculateUrgency(overdueDate, referenceDate)

    assert.strictEqual(result.tier, 'OVERDUE')
    assert.strictEqual(result.diffDays, -3)
    assert.strictEqual(result.label, 'Overdue by 3 days')
  })

  it('uses singular "day" for 1 day overdue', () => {
    const overdueYesterday = new Date('2026-11-04T12:00:00Z')
    const result = calculateUrgency(overdueYesterday, referenceDate)

    assert.strictEqual(result.tier, 'OVERDUE')
    assert.strictEqual(result.label, 'Overdue by 1 day')
  })

  it('identifies follow-ups due on the current day as TODAY', () => {
    const todayDate = new Date('2026-11-05T18:00:00Z')
    const result = calculateUrgency(todayDate, referenceDate)

    assert.strictEqual(result.tier, 'TODAY')
    assert.strictEqual(result.diffDays, 0)
    assert.strictEqual(result.label, 'Due Today')
  })

  it('identifies follow-ups due on the next calendar day as TOMORROW', () => {
    const tomorrowDate = new Date('2026-11-06T09:00:00Z')
    const result = calculateUrgency(tomorrowDate, referenceDate)

    assert.strictEqual(result.tier, 'TOMORROW')
    assert.strictEqual(result.diffDays, 1)
    assert.strictEqual(result.label, 'Due Tomorrow')
  })

  it('identifies future follow-ups as UPCOMING with day count', () => {
    const futureDate = new Date('2026-11-12T12:00:00Z')
    const result = calculateUrgency(futureDate, referenceDate)

    assert.strictEqual(result.tier, 'UPCOMING')
    assert.strictEqual(result.diffDays, 7)
    assert.strictEqual(result.label, 'Due in 7 days')
  })
})
