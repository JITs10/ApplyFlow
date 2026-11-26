'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-sans p-6">
        <div className="max-w-md w-full p-8 rounded-xl border border-neutral-800 bg-neutral-900 text-center space-y-4">
          <h2 className="text-xl font-medium tracking-tight">Application Unavailable</h2>
          <p className="text-sm text-neutral-400">
            A critical server error prevented this view from rendering.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-neutral-500 bg-neutral-950 py-1.5 px-3 rounded-md">
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="mt-4 px-4 py-2 rounded-lg bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  )
}
