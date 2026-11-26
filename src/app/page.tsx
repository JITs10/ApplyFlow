import { auth, signIn } from '@/auth'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Download,
  Clock,
  Calendar,
  Layers,
  FileText,
  Lock,
  ChevronRight,
  Database,
  EyeOff,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InteractiveProductPreview } from '@/components/landing/InteractiveProductPreview'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Logo } from '@/components/brand/Logo'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background">
      {/* WCAG Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-foreground text-background font-mono text-xs rounded shadow-lg"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-card text-foreground flex items-center justify-center border border-border shadow-xs transition-transform group-hover:scale-105">
              <Logo size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-foreground font-medium leading-none">
                Apply<span className="serif-accent text-primary">Flow</span>
              </span>
              <span className="serif-accent text-[10px] text-muted-foreground mt-0.5 tracking-wide hidden sm:inline-block">
                Apply. Track. Succeed.
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground" aria-label="Main Navigation">
            <a href="#preview" className="hidden sm:inline-block hover:text-foreground transition-colors">
              Preview
            </a>
            <a href="#why" className="hidden sm:inline-block hover:text-foreground transition-colors">
              Why ApplyFlow
            </a>
            <a href="#capabilities" className="hidden md:inline-block hover:text-foreground transition-colors">
              Capabilities
            </a>
            <a href="#comparison" className="hidden md:inline-block hover:text-foreground transition-colors">
              Comparison
            </a>
            <a href="#manifesto" className="hidden lg:inline-block hover:text-foreground transition-colors">
              Manifesto
            </a>
            <a href="#faq" className="hidden lg:inline-block hover:text-foreground transition-colors">
              FAQ
            </a>

            <ThemeToggle />

            {isLoggedIn ? (
              <Button asChild size="sm" className="gap-1.5 font-medium">
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <form
                  action={async () => {
                    'use server'
                    await signIn('guest', { redirectTo: '/dashboard' })
                  }}
                >
                  <Button variant="ghost" size="sm" type="submit" className="gap-1.5 font-medium text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Guest Demo
                  </Button>
                </form>
                <Button asChild variant="ghost" size="sm" className="font-medium text-xs">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <form
                  action={async () => {
                    'use server'
                    await signIn('github', { redirectTo: '/dashboard' })
                  }}
                >
                  <Button size="sm" type="submit" className="gap-1.5 font-medium text-xs">
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                </form>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto w-full relative">
          {/* Subtle architectural spotlight */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 -z-10 w-[850px] h-[360px] bg-gradient-to-b from-foreground/[0.05] via-foreground/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-muted/60 backdrop-blur-xs text-xs text-muted-foreground mb-8 font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>KEEP YOUR JOB SEARCH ORGANIZED</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] mb-6 text-foreground font-serif">
            Every job, interview, and follow-up.{' '}
            <span className="serif-accent text-emerald-600 dark:text-emerald-400">All in one place.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Stop juggling messy spreadsheets and searching through old emails. ApplyFlow makes it simple to track where you applied, stay on top of upcoming interviews, and never forget to send a follow-up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isLoggedIn ? (
              <Button asChild size="lg" className="gap-2.5 px-6 font-medium shadow-sm hover:shadow-md active:translate-y-px transition-all">
                <Link href="/dashboard">
                  Open Your Dashboard
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <>
                <form
                  action={async () => {
                    'use server'
                    await signIn('github', { redirectTo: '/dashboard' })
                  }}
                >
                  <Button size="lg" type="submit" className="gap-2.5 px-6 font-medium shadow-sm hover:shadow-md active:translate-y-px transition-all cursor-pointer">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Get Started with GitHub
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </form>

                <form
                  action={async () => {
                    'use server'
                    await signIn('guest', { redirectTo: '/dashboard' })
                  }}
                >
                  <Button variant="outline" size="lg" type="submit" className="gap-2 px-5 font-medium shadow-xs hover:bg-muted/60 transition-all cursor-pointer">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Explore as Guest
                  </Button>
                </form>
              </>
            )}

            <Button asChild variant="ghost" size="lg" className="font-medium text-muted-foreground hover:text-foreground transition-all">
              <a href="#preview">
                See Preview &darr;
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-muted-foreground mt-8 font-mono">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Visual Stage Tracking
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Follow-Up &amp; Interview Reminders
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 shadow-xs">
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Save Resumes per Job
            </span>
          </div>
        </section>

        {/* Embedded Live Preview Mockup Section */}
        <section id="preview" className="max-w-5xl mx-auto px-6 pb-20 w-full" aria-label="Interactive Product Preview">
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Interactive Product Preview
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              Test drive the interface below — toggle views to see urgency triage, Kanban workflows, and resume binding.
            </p>
          </div>

          <InteractiveProductPreview />
        </section>

        {/* Section: Why ApplyFlow Exists */}
        <section id="why" className="border-t bg-muted/20 py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-2 font-medium tracking-wider">01 / THE PROBLEMS WE SOLVE</div>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight mb-4">
              Job hunting is hard enough. Keeping track of it <span className="serif-accent">shouldn&apos;t be.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              Most people start with good intentions and a blank spreadsheet. But after a few weeks and dozens of applications, things get messy. Here is why we built ApplyFlow:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3.5 card-interactive relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <div className="w-8 h-8 rounded-lg bg-muted/80 border border-border/80 flex items-center justify-center font-mono text-xs font-bold text-foreground shadow-xs">
                  01
                </div>
                <h3 className="font-semibold text-base text-foreground">Messy, Outdated Spreadsheets</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  A spreadsheet starts clean, but quickly becomes cluttered. Columns get messy, dates slip, and updating it feels like homework. ApplyFlow gives you a clean visual board where moving an application takes one click.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3.5 card-interactive relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <div className="w-8 h-8 rounded-lg bg-muted/80 border border-border/80 flex items-center justify-center font-mono text-xs font-bold text-foreground shadow-xs">
                  02
                </div>
                <h3 className="font-semibold text-base text-foreground">Forgetting Which Resume You Sent</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  When a company reaches out weeks later, trying to remember whether you sent Resume v1, v2, or a tailored version is stressful. ApplyFlow links your exact resume file to each job card so you are always prepared.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3.5 card-interactive relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <div className="w-8 h-8 rounded-lg bg-muted/80 border border-border/80 flex items-center justify-center font-mono text-xs font-bold text-foreground shadow-xs">
                  03
                </div>
                <h3 className="font-semibold text-base text-foreground">Missing Important Dates &amp; Follow-Ups</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Forgetting to follow up after an interview or missing a preparation deadline can cost you an offer. Automatic date reminders show you what needs your attention today, tomorrow, and this week.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Core Capabilities */}
        <section id="capabilities" className="py-20 px-6 max-w-5xl mx-auto w-full">
          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-2 font-medium tracking-wider">02 / HOW IT WORKS</div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight mb-4">
            Everything you need to run an <span className="serif-accent">organized job search.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Designed to be fast, clear, and easy to use — so you spend less time tracking and more time interviewing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3 card-interactive relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                </div>
                <span>INTERVIEW REMINDERS</span>
              </div>
              <h3 className="font-semibold text-base text-foreground">Smart Follow-Up &amp; Deadline Alerts</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Knowing you applied is only half the battle. ApplyFlow highlights when to follow up, warns you before upcoming interviews, and shows you exactly what needs your attention next.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3 card-interactive relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                </div>
                <span>RESUME MATCHING</span>
              </div>
              <h3 className="font-semibold text-base text-foreground">Save the Exact Resume You Sent</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Upload your tailored resumes and link the specific file to each application. Review the exact document you submitted with one click before your interview begins.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3 card-interactive relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center shadow-xs">
                  <Calendar className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                </div>
                <span>FLEXIBLE VIEWS</span>
              </div>
              <h3 className="font-semibold text-base text-foreground">Visual Board &amp; Clean List Views</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Switch between a visual board to move jobs across hiring stages (Applied, Interview, Offer, Rejected) or a clean table view to scan all your applications at once.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3 card-interactive relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center shadow-xs">
                  <Download className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                </div>
                <span>NO LOCK-IN</span>
              </div>
              <h3 className="font-semibold text-base text-foreground">Your Data Stays Yours (1-Click Export)</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                No subscription paywalls to get your information out. Download your entire job search history to an Excel/CSV file anytime with a single click.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Comparison Matrix */}
        <section id="comparison" className="border-t bg-muted/20 py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-2 font-medium tracking-wider">03 / COMPARISON</div>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight mb-4">
              How ApplyFlow compares to <span className="serif-accent">spreadsheets and paid apps</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              See why job seekers prefer a simple, dedicated tracker over messy spreadsheets or expensive monthly tools.
            </p>

            <div className="rounded-xl border border-border/80 bg-card surface-depth overflow-hidden relative shadow-xs">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" aria-hidden="true" />
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" aria-label="Comparison Table">
                  <thead>
                    <tr className="border-b bg-muted/50 font-mono text-[11px] text-muted-foreground">
                      <th scope="col" className="p-4 font-semibold text-foreground">CAPABILITY</th>
                      <th scope="col" className="p-4 font-semibold text-foreground bg-primary/10 border-x border-border/80">
                        APPLYFLOW
                      </th>
                      <th scope="col" className="p-4 font-semibold">GOOGLE SHEETS / EXCEL</th>
                      <th scope="col" className="p-4 font-semibold">OTHER TRACKER APPS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px]">
                    <tr>
                      <td className="p-4 font-medium text-foreground">Cost</td>
                      <td className="p-4 font-semibold text-emerald-500 bg-primary/5 border-x border-border/80">
                        100% Free Forever
                      </td>
                      <td className="p-4 text-muted-foreground">Free</td>
                      <td className="p-4 text-rose-500">\$30 &ndash; \$50 / month</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Data Privacy</td>
                      <td className="p-4 font-semibold text-emerald-500 bg-primary/5 border-x border-border/80">
                        100% Confidential (No recruiter access)
                      </td>
                      <td className="p-4 text-muted-foreground">Private (Your personal account)</td>
                      <td className="p-4 text-rose-500">Often shared with recruiter networks</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Save Resumes per Job</td>
                      <td className="p-4 font-semibold text-emerald-500 bg-primary/5 border-x border-border/80">
                        Attach exact file to each job
                      </td>
                      <td className="p-4 text-muted-foreground">Manual cloud drive links</td>
                      <td className="p-4 text-muted-foreground">Only one global resume</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Interview &amp; Follow-Up Alerts</td>
                      <td className="p-4 font-semibold text-emerald-500 bg-primary/5 border-x border-border/80">
                        Built-in automatic reminders
                      </td>
                      <td className="p-4 text-muted-foreground">Requires manual formulas</td>
                      <td className="p-4 text-muted-foreground">Basic or locked behind paywall</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Visual Board &amp; Stages</td>
                      <td className="p-4 font-semibold text-emerald-500 bg-primary/5 border-x border-border/80">
                        1-Click Kanban &amp; list views
                      </td>
                      <td className="p-4 text-muted-foreground">Text rows only</td>
                      <td className="p-4 text-muted-foreground">Cluttered interfaces</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-foreground">Data Export &amp; Portability</td>
                      <td className="p-4 font-semibold text-emerald-500 bg-primary/5 border-x border-border/80">
                        1-Click Excel/CSV &amp; JSON export
                      </td>
                      <td className="p-4 text-muted-foreground">Manual download</td>
                      <td className="p-4 text-rose-500">Often paywalled or restricted</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Manifesto / Our Promise */}
        <section id="manifesto" className="py-20 px-6 max-w-3xl mx-auto w-full space-y-6">
          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-2 font-medium tracking-wider">04 / OUR PROMISE</div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight">
            Built for job seekers. <span className="serif-accent">No expensive subscriptions, no spam.</span>
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              Finding a job is already stressful. You shouldn&apos;t have to pay \$30 to \$50 every month just to keep track of where you applied, or worry about your search data being shared with recruiters.
            </p>
            <p>
              ApplyFlow was created to do the opposite: give every job seeker a clean, reliable, and completely free workspace to manage their interviews and follow-ups with peace of mind.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth font-mono text-xs text-foreground space-y-1.5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
            <div className="font-semibold text-foreground">The ApplyFlow Promise:</div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              We will never sell or share your job search data. We will never lock basic tracking features behind paywalls. 
              Your data is always yours to keep or export anytime.
            </p>
          </div>

          <div className="pt-4">
            {isLoggedIn ? (
              <Button asChild size="lg" className="gap-2 font-medium">
                <Link href="/dashboard">
                  Open Your Dashboard
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <form
                action={async () => {
                  'use server'
                  await signIn('github', { redirectTo: '/dashboard' })
                }}
              >
                <Button size="lg" type="submit" className="gap-2 font-medium">
                  Get Started with GitHub
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* Section: Frequently Asked Questions */}
        <section id="faq" className="border-t bg-muted/20 py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-2 font-medium tracking-wider">05 / FREQUENTLY ASKED QUESTIONS</div>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight mb-8">
              Straightforward answers. <span className="serif-accent">No marketing spin.</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-5 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-2 card-interactive hover:border-foreground/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <h3 className="font-semibold text-foreground text-sm">
                  Why is ApplyFlow completely free? What is the catch?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  There is no catch. ApplyFlow is built as a free, candidate-first project. We believe job hunting is stressful enough without having to pay a monthly subscription just to keep track of where you applied. All tracking features are free forever.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-2 card-interactive hover:border-foreground/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <h3 className="font-semibold text-foreground text-sm">
                  What permissions does GitHub sign-in request?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Only read-only identity access (your public GitHub profile and verified email address). We never request access to your private repositories, code, organizations, or personal SSH keys.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-2 card-interactive hover:border-foreground/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <h3 className="font-semibold text-foreground text-sm">
                  Can I export my data or delete my account?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes. You can download your entire application history into an Excel/CSV or JSON file at any time with a single click from the Settings page. You can also delete your account and all associated resumes permanently.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-2 card-interactive hover:border-foreground/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                <h3 className="font-semibold text-foreground text-sm">
                  How does saving resumes per job work?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can upload different versions of your resume to your account. Whenever you add or edit a job application, you can select the exact resume version you sent. That way, you can open and review it with one click before your interview starts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 px-6 max-w-4xl mx-auto text-center w-full">
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight mb-4">
            Take the stress out of your <span className="serif-accent text-emerald-600 dark:text-emerald-400">job search.</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8">
            Keep every application, interview deadline, and resume version organized in one simple, free dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isLoggedIn ? (
              <Button asChild size="lg" className="gap-2 font-medium">
                <Link href="/dashboard">
                  Open Your Dashboard
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <form
                action={async () => {
                  'use server'
                  await signIn('github', { redirectTo: '/dashboard' })
                }}
              >
                <Button size="lg" type="submit" className="gap-2 font-medium">
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Get Started with GitHub
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </form>
            )}

            <Button asChild variant="outline" size="lg" className="font-medium">
              <Link href="/sign-in">
                Sign In to Account &rarr;
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-card text-foreground flex items-center justify-center border border-border shadow-xs">
              <Logo size={16} />
            </div>
            <span className="font-serif text-base text-foreground font-medium">
              Apply<span className="serif-accent text-primary">Flow</span>
            </span>
            <span className="text-muted-foreground">&mdash; Apply. Track. Succeed.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              All Systems Operational
            </span>
            <span>100% Free & Open</span>
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-foreground hover:underline">
                Dashboard &rarr;
              </Link>
            ) : (
              <Link href="/sign-in" className="text-foreground hover:underline">
                Sign In &rarr;
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
