'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Briefcase, Columns, Calendar,
  Bell, FileText, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const nav = [
  { href: '/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/applications', label: 'Applications',  icon: Briefcase },
  { href: '/kanban',       label: 'Kanban',         icon: Columns },
  { href: '/calendar',     label: 'Calendar',       icon: Calendar },
  { href: '/follow-ups',   label: 'Follow-ups',     icon: Bell },
  { href: '/resumes',      label: 'Resume Library', icon: FileText },
  { href: '/settings',     label: 'Settings',       icon: Settings },
]

interface MobileNavProps {
  user?: { name?: string | null; email?: string | null }
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="md:hidden h-14 border-b flex items-center px-4 gap-3 bg-card">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <span className="font-bold">ApplyFlow</span>

      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="h-14 border-b flex items-center px-4 gap-3">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
            <span className="font-bold">ApplyFlow</span>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{user?.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
