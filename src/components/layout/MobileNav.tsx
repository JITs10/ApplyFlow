'use client'

import { useState } from 'react'
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
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from '@/components/brand/Logo'

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
      { href: '/applications', label: 'Applications', icon: Briefcase },
      { href: '/kanban',       label: 'Kanban Board', icon: Kanban },
      { href: '/calendar',     label: 'Calendar',     icon: Calendar },
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

interface MobileNavProps {
  user?: { name?: string | null; email?: string | null }
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="md:hidden h-14 border-b border-sidebar-border flex items-center justify-between px-4 bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-card/70"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-card text-foreground flex items-center justify-center border border-border shadow-xs">
            <Logo size={18} />
          </div>
          <span className="font-serif text-lg tracking-tight font-medium text-foreground">
            Apply<span className="serif-accent text-primary">Flow</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md flex flex-col">
          <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-sidebar">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-card text-foreground flex items-center justify-center border border-border">
                <Logo size={18} />
              </div>
              <span className="font-serif text-lg tracking-tight font-medium text-foreground">
                Apply<span className="serif-accent text-primary">Flow</span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-5">
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
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold border border-primary/25 shadow-2xs'
                          : 'text-muted-foreground hover:bg-card/70 hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-4.5 w-4.5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                      <span>{label}</span>
                      {isActive && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>

          <div className="px-4 py-3 border-t border-border bg-card/60">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>100% Confidential • Private Job Tracker</span>
            </div>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between text-sm bg-sidebar">
            <p className="text-muted-foreground truncate max-w-[200px] font-mono text-xs">{user?.email}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
