import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Check, ShieldCheck, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Logo } from '@/components/brand/Logo'
import { GuestSignInButton, GitHubSignInButton } from '@/components/auth/AuthButtons'

export const metadata = {
  title: 'Sign In — ApplyFlow',
  description: 'Sign in to track your job applications, interviews, and resume versions.',
}

export const dynamic = 'force-dynamic'

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const authError = params?.error

  try {
    const session = await auth()
    if (session?.user && !session.user.isGuest && !authError) {
      redirect('/dashboard')
    }
  } catch (error) {
    const digest = (error as { digest?: string })?.digest
    if (digest?.startsWith('NEXT_REDIRECT') || digest === 'DYNAMIC_SERVER_USAGE') {
      throw error
    }
    console.warn('Session check failed or DB unreachable on SignInPage:', error)
  }

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-12 bg-background text-foreground selection:bg-emerald-500/20">
      {/* Left Column: Dossier Context, Live Triage Telemetry & Candidate Ethos */}
      <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border bg-muted/20 relative overflow-hidden">
        {/* Subtle Ambient Background Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl"
        />

        <div className="relative z-10">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-10 sm:mb-14">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-card border border-border shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
                <Logo size={22} variant="icon" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-tight text-foreground font-medium leading-none">
                  Apply<span className="serif-accent text-primary">Flow</span>
                </span>
                <span className="serif-accent text-xs text-muted-foreground mt-0.5 tracking-wide">
                  Apply. Track. Succeed.
                </span>
              </div>
            </Link>

            {/* Mobile / Tablet Theme Toggle */}
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>

          {/* Dossier Headline & Overview */}
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Private &bull; Your Personal Job Tracker
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
              Stay organized and confident throughout your{' '}
              <span className="serif-accent text-emerald-700 dark:text-emerald-400">job search.</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              No messy spreadsheets, no lost emails, and no recruiter surveillance. Track every application, upcoming interview, and resume version in one private place.
            </p>

            {/* Live Candidate Triage Card Preview */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3.5 transition-all">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Upcoming Interview
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  URGENT
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <span>Stripe</span>
                    <span className="text-muted-foreground font-normal">&bull;</span>
                    <span className="font-normal text-muted-foreground">Staff Infrastructure</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                    <span>Technical Screen</span>
                    <span>&bull;</span>
                    <span>Resume:</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium">v2.4-systems.pdf</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-semibold text-foreground px-2 py-1 rounded bg-muted/60 border border-border/50">
                    In 36 hrs
                  </span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Stage 3 of 5</span>
                <span>&bull;</span>
                <span>Take-home review approved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ethos Quote */}
        <div className="relative z-10 mt-12 pt-6 border-t border-border/60 text-xs font-mono text-muted-foreground">
          &ldquo;The best way to stay calm during a job hunt is knowing you haven&apos;t dropped a single ball.&rdquo;
        </div>
      </div>

      {/* Right Column: Sign-In Action & Sovereign Assurances */}
      <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-card">
        {/* Desktop Theme Toggle in Top Right */}
        <div className="hidden lg:flex justify-end">
          <ThemeToggle />
        </div>

        {/* Center Sign-In Box */}
        <div className="w-full max-w-sm mx-auto my-auto space-y-6 py-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground">
              Sign in to ApplyFlow
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sign in with your GitHub account to access your applications, interviews, and resumes.
            </p>
          </div>

          {/* GitHub Sign-In Form */}
          <div className="space-y-4">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 space-y-1">
                <p className="font-semibold">Sign In Notice</p>
                <p className="leading-relaxed">
                  {authError === 'Configuration'
                    ? 'Authentication service configuration error. Check that AUTH_SECRET, AUTH_GITHUB_ID, and AUTH_GITHUB_SECRET are set in your deployment.'
                    : 'Sign-in could not be completed. You can try again or explore immediately using Guest Demo mode.'}
                </p>
              </div>
            )}

            <GitHubSignInButton
              size="lg"
              className="w-full h-11 gap-2.5 text-sm font-semibold rounded-xl shadow-xs transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </GitHubSignInButton>

            {/* Guest Sign-in Option */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/80" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2.5 text-muted-foreground font-mono text-[10px] tracking-wider">
                  or explore first
                </span>
              </div>
            </div>

            <GuestSignInButton
              variant="outline"
              size="lg"
              className="w-full h-11 gap-2 text-sm font-semibold rounded-xl border-border bg-card hover:bg-muted/50 transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Continue as Guest (Demo Mode)</span>
            </GuestSignInButton>

            {/* Value Checkpoints */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>100% Free Forever &bull; No paid tiers or credit card required</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Completely Confidential &bull; Your data is never shared with recruiters</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Instant Export &bull; Download your applications to Excel or CSV anytime</span>
              </div>
            </div>

            {/* Security Capsule */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Secure GitHub Sign-In</span>
              </div>
              <p className="leading-relaxed">
                ApplyFlow requests basic identity only (name and email). We never access your code, repositories, or organizations.
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 group">
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to home</span>
            </Link>
            <span className="font-mono text-[11px] text-muted-foreground">100% Private &amp; Confidential</span>
          </div>
        </div>

        {/* Empty bottom spacer for desktop balance */}
        <div className="hidden lg:block h-6" />
      </div>
    </div>
  )
}
