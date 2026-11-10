'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
  variant?: 'icon' | 'lockup' | 'full'
  showTagline?: boolean
}

/**
 * ApplyFlow Vector Brand Logo
 * 
 * Concept: The Paper Plane & Flow Swoop
 * Unites "Apply" (the paper document / application) with "Flow" (upward momentum and flight).
 * Uses Instrument Serif typography and the calibrated Warm Paper / Smoked Obsidian & Mint palette.
 */
export function Logo({
  className,
  size = 28,
  variant = 'icon',
  showTagline = false,
}: LogoProps) {
  // Standalone Icon: The Origami Paper Plane with Momentum Arc
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 transition-transform duration-200 group-hover:scale-105', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="plane-wing-light" x1="12" y1="12" x2="36" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        <linearGradient id="plane-wing-shadow" x1="20" y1="18" x2="36" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>

      {/* Trailing Momentum Swoop Arc */}
      <path
        d="M6 31C14 31 20 26 25 21"
        className="stroke-primary"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      {/* Origami Paper Plane - Top Wing (Illuminated) */}
      <polygon
        points="36,9 15,20 24,21"
        className="fill-primary"
      />

      {/* Origami Paper Plane - Lower Wing / Underbelly (Fold Shadow) */}
      <polygon
        points="36,9 24,21 21,28"
        className="fill-emerald-700 dark:fill-emerald-400"
        fillOpacity="0.85"
      />

      {/* Center Crease Hairline for tactile paper origami feel */}
      <line
        x1="36"
        y1="9"
        x2="24"
        y2="21"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="0.85"
        strokeLinecap="round"
      />

      {/* Subtle Launch Dust Accent */}
      <circle cx="9" cy="31" r="1.5" className="fill-primary" fillOpacity="0.6" />
      <circle cx="15" cy="28.5" r="1.2" className="fill-primary" fillOpacity="0.8" />
    </svg>
  )

  if (variant === 'icon') {
    return icon
  }

  // Full Wordmark Lockup
  return (
    <div className={cn('inline-flex flex-col select-none', className)}>
      <div className="inline-flex items-center gap-2">
        <div className="relative flex items-center">
          <span className="font-serif text-2xl tracking-tight text-foreground font-medium leading-none">
            Apply<span className="serif-accent text-primary">Flow</span>
          </span>

          {/* Soaring Mini Plane at the top-right of the wordmark */}
          <div className="relative -top-2.5 -right-1 ml-0.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 25C10 25 15 21 19 17"
                className="stroke-primary"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polygon points="28,7 12,16 19,17" className="fill-primary" />
              <polygon points="28,7 19,17 17,23" className="fill-emerald-700 dark:fill-emerald-400" />
            </svg>
          </div>
        </div>
      </div>

      {showTagline && (
        <span className="serif-accent text-[11px] text-muted-foreground tracking-wide mt-0.5">
          Apply. Track. Succeed.
        </span>
      )}
    </div>
  )
}
