'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  Calendar,
  Bell,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from '@/components/brand/Logo'

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { href: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
      { href: '/applications', label: 'Applications',   icon: Briefcase },
      { href: '/kanban',       label: 'Kanban Board',   icon: Kanban },
      { href: '/calendar',     label: 'Calendar',       icon: Calendar },
    ],
  },
  {
    title: 'Resumes & Follow-ups',
    items: [
      { href: '/resumes',    label: 'Resume Library', icon: FileText },
      { href: '/follow-ups', label: 'Follow-ups',     icon: Bell },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null; isGuest?: boolean }
  isGuest?: boolean
}

export function Sidebar({ user, isGuest }: SidebarProps) {
  const pathname = usePathname()
  const guestActive = isGuest || user?.isGuest

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-card text-foreground flex items-center justify-center border border-border shadow-xs transition-transform group-hover:scale-105 relative">
            <Logo size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary ring-2 ring-sidebar" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-tight text-foreground font-medium leading-none">
              Apply<span className="serif-accent text-primary">Flow</span>
            </span>
            <span className="text-xs text-muted-foreground font-mono mt-1 tracking-wider uppercase">
              Personal Tracker
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <div className="px-3 py-1 text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase">
              {group.title}
            </div>
            {group.items.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={true}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all relative',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold border border-primary/25 shadow-2xs'
                      : 'text-muted-foreground hover:bg-card/70 hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4.5 w-4.5 shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-primary shadow-xs" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Zero Surveillance Trust Box */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="p-3 rounded-lg border border-border bg-card/60 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-foreground">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>100% Confidential</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your job search is private. No recruiter access or sold data.
          </p>
        </div>
      </div>

      {/* User Profile & Theme Toggle Footer */}
      <div className="p-3.5 border-t border-sidebar-border bg-sidebar flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {guestActive ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          ) : user?.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User profile'}
              width={32}
              height={32}
              className="rounded-full shrink-0 ring-1 ring-border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-xs font-mono font-bold shrink-0 text-foreground">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-foreground leading-none">
              {guestActive ? 'Guest Explorer' : user?.name || 'Candidate'}
            </p>
            <p className="text-xs text-muted-foreground truncate font-mono mt-1">
              {guestActive ? 'demo@applyflow.dev' : user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-card/70 transition-colors"
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
