'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Bell,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const nav = [
  { href: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/applications', label: 'Applications',   icon: Briefcase },
  { href: '/calendar',     label: 'Calendar',        icon: Calendar },
  { href: '/follow-ups',   label: 'Follow-ups',      icon: Bell },
  { href: '/resumes',      label: 'Resume Library',  icon: FileText },
  { href: '/settings',     label: 'Settings',        icon: Settings },
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
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
                  pathname === href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
