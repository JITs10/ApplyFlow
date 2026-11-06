/**
 * Checks whether a given hostname resolves to a loopback, private network,
 * or cloud metadata service to prevent Server-Side Request Forgery (SSRF).
 */
export function isPrivateOrRestrictedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim()

  // Loopback and common internal hostnames
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host === '[::1]' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.lan') ||
    host.endsWith('.localhost')
  ) {
    return true
  }

  // Cloud metadata services
  if (
    host === '169.254.169.254' ||
    host === 'metadata.google.internal' ||
    host === 'instance-data'
  ) {
    return true
  }

  // IPv4 regex checks for private and reserved ranges
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4Match) {
    const a = Number(ipv4Match[1])
    const b = Number(ipv4Match[2])

    if (a === 10) return true // 10.0.0.0/8
    if (a === 127) return true // 127.0.0.0/8
    if (a === 169 && b === 254) return true // 169.254.0.0/16
    if (a === 192 && b === 168) return true // 192.168.0.0/16
    if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12
    if (a === 0) return true // 0.0.0.0/8
  }

  return false
}
