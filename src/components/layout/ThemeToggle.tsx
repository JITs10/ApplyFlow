'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ThemeToggle({
  className,
  variant = 'ghost',
  size = 'icon',
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn('w-8 h-8 rounded-md text-muted-foreground', className)}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4 opacity-50" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors',
        className
      )}
      title={isDark ? 'Switch to Warm Paper (Light)' : 'Switch to Smoked Obsidian (Dark)'}
      aria-label={isDark ? 'Switch to Warm Paper (Light)' : 'Switch to Smoked Obsidian (Dark)'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-stone-600 transition-transform duration-200 hover:-rotate-12" />
      )}
    </Button>
  )
}
