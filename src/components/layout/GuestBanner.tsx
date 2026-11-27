import { Sparkles, ArrowRight } from 'lucide-react'
import { GitHubSignInButton } from '@/components/auth/AuthButtons'

export function GuestBanner() {
  return (
    <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-950 dark:text-emerald-200 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2.5 z-20 shrink-0">
      <div className="flex items-center gap-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          <strong className="font-semibold text-foreground">Guest Demo Mode:</strong> You are exploring with sample data. Read-only preview.
        </span>
      </div>
      <GitHubSignInButton
        size="sm"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-[11px] font-semibold transition-all shadow-2xs cursor-pointer h-7"
      >
        <span>Connect GitHub to track your real jobs</span>
        <ArrowRight className="w-3 h-3" />
      </GitHubSignInButton>
    </div>
  )
}
