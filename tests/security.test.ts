import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isPrivateOrRestrictedHost } from '../src/lib/security/ssrf.ts'
import { escapeCsvField } from '../src/lib/export/csv.ts'

describe('Security & Vulnerability Defenses', () => {
  describe('SSRF Protection (isPrivateOrRestrictedHost)', () => {
    it('blocks loopback hostnames and localhost variants', () => {
      assert.strictEqual(isPrivateOrRestrictedHost('localhost'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('127.0.0.1'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('0.0.0.0'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('::1'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('test.localhost'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('app.local'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('backend.internal'), true)
    })

    it('blocks cloud metadata IP addresses', () => {
      assert.strictEqual(isPrivateOrRestrictedHost('169.254.169.254'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('metadata.google.internal'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('instance-data'), true)
    })

    it('blocks RFC 1918 private IPv4 subnets', () => {
      assert.strictEqual(isPrivateOrRestrictedHost('10.0.0.1'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('10.255.255.255'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('192.168.1.1'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('172.16.0.5'), true)
      assert.strictEqual(isPrivateOrRestrictedHost('172.31.255.255'), true)
    })

    it('allows legitimate public job board hosts', () => {
      assert.strictEqual(isPrivateOrRestrictedHost('greenhouse.io'), false)
      assert.strictEqual(isPrivateOrRestrictedHost('jobs.lever.co'), false)
      assert.strictEqual(isPrivateOrRestrictedHost('boards.greenhouse.io'), false)
      assert.strictEqual(isPrivateOrRestrictedHost('stripe.com'), false)
      assert.strictEqual(isPrivateOrRestrictedHost('8.8.8.8'), false)
    })
  })

  describe('CSV Injection Neutralization (CWE-1236)', () => {
    it('escapes and prefixes formula execution characters', () => {
      assert.strictEqual(escapeCsvField('=cmd|/c calc'), '"\'=cmd|/c calc"')
      assert.strictEqual(escapeCsvField('+2+5'), '"\'+2+5"')
      assert.strictEqual(escapeCsvField('-5*2'), '"\'-5*2"')
      assert.strictEqual(escapeCsvField('@SUM(A1)'), '"\'@SUM(A1)"')
    })

    it('leaves standard job titles and numbers safely formatted', () => {
      assert.strictEqual(escapeCsvField('Senior Engineer'), '"Senior Engineer"')
      assert.strictEqual(escapeCsvField(500000), '"500000"')
    })
  })
})
