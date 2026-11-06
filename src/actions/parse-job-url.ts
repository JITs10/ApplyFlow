'use server'

import { requireUser } from '@/lib/auth'
import { isPrivateOrRestrictedHost } from '@/lib/security/ssrf'

interface ParsedJobMetadata {
  company?: string
  jobTitle?: string
  description?: string
  location?: string
}

export async function parseJobUrlAction(url: string): Promise<{
  success: boolean
  data?: ParsedJobMetadata
  error?: string
}> {
  await requireUser()

  if (!url || typeof url !== 'string') {
    return { success: false, error: 'Please provide a valid URL' }
  }

  try {
    const parsedUrl = new URL(url.trim())
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { success: false, error: 'Invalid URL protocol' }
    }

    if (parsedUrl.port && parsedUrl.port !== '80' && parsedUrl.port !== '443') {
      return { success: false, error: 'Only standard web ports (80, 443) are permitted' }
    }

    if (isPrivateOrRestrictedHost(parsedUrl.hostname)) {
      return { success: false, error: 'Access to private or internal addresses is blocked for security' }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return { success: false, error: `Server responded with status ${response.status}` }
    }

    const html = await response.text()

    // Helper regex to extract meta content
    const getMeta = (prop: string): string => {
      const match =
        html.match(new RegExp(`<meta[^>]+(?:property|name)=["'](?:og:)?${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:)?${prop}["']`, 'i'))
      return match ? match[1].trim() : ''
    }

    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || ''
    const ogTitle = getMeta('title') || titleTag
    const ogSiteName = getMeta('site_name')
    const ogDescription = getMeta('description')

    let company = ogSiteName
    let jobTitle = ogTitle

    // Heuristics for Greenhouse / Lever / Common job boards
    const hostname = parsedUrl.hostname.toLowerCase()
    if (hostname.includes('greenhouse.io')) {
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
      if (pathParts.length > 0 && pathParts[0] !== 'jobs') {
        company = company || capitalize(pathParts[0])
      }
    } else if (hostname.includes('lever.co')) {
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
      if (pathParts.length > 0) {
        company = company || capitalize(pathParts[0])
      }
    }

    // Split common title formats like "Role at Company", "Company - Role", "Role | Company"
    if (jobTitle) {
      if (jobTitle.includes(' at ')) {
        const parts = jobTitle.split(' at ')
        jobTitle = parts[0].trim()
        if (!company && parts[1]) company = parts[1].trim()
      } else if (jobTitle.includes(' - ')) {
        const parts = jobTitle.split(' - ')
        // Frequently "Job Title - Company" or "Company - Job Title"
        if (!company) {
          company = parts[parts.length - 1].trim()
          jobTitle = parts.slice(0, parts.length - 1).join(' - ').trim()
        } else {
          jobTitle = parts[0].trim()
        }
      } else if (jobTitle.includes(' | ')) {
        const parts = jobTitle.split(' | ')
        jobTitle = parts[0].trim()
        if (!company && parts[1]) company = parts[1].trim()
      }
    }

    // Clean common suffixes from company
    if (company) {
      company = company.replace(/(careers|jobs|recruitment|inc\.?|llc|ltd\.?)/gi, '').trim()
    }

    return {
      success: true,
      data: {
        company: company || undefined,
        jobTitle: jobTitle || undefined,
        description: ogDescription ? ogDescription.slice(0, 1000) : undefined,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch job metadata'
    return { success: false, error: message }
  }
}

function capitalize(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
