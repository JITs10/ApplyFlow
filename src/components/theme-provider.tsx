'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

// Filter known development false-positives in React 19:
// 1. next-themes inline theme script
// 2. Browser extension autofill attributes (e.g. fdprocessedid injected by password managers)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    const message = args.map((a) => (typeof a === 'string' ? a : '')).join(' ')
    if (
      message.includes('Encountered a script tag') ||
      message.includes('fdprocessedid')
    ) {
      return
    }
    originalError.apply(console, args)
  }
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
