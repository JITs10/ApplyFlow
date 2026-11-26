'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application render error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md w-full p-8 rounded-xl border border-border bg-card surface-depth text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-medium tracking-tight">Something went wrong</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We encountered a temporary rendering issue loading this page.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/60 bg-muted/40 py-1.5 px-3 rounded-md">
            Reference ID: {error.digest}
          </p>
        )}
        <div className="pt-2 flex justify-center">
          <Button onClick={() => reset()} className="gap-2 font-medium">
            <RotateCcw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
