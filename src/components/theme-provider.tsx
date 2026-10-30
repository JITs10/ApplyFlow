'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

// React 19 logs a development warning for the inline script that next-themes
// uses to prevent flash of unstyled theme. This filters that specific false-positive.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
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
