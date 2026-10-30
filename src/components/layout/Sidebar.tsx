'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Briefcase, Columns, Calendar,
  Bell, FileText, Settings, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const nav = [
  { href: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/applications',  label: 'Applications',  icon: Briefcase },
  { href: '/kanban',        label: 'Kanban',         icon: Columns },
  { href: '/calendar',      label: 'Calendar',       icon: Calendar },
  { href: '/follow-ups',    label: 'Follow-ups',     icon: Bell },
  { href: '/resumes',       label: 'Resume Library', icon: FileText },
  { href: '/settings',      label: 'Settings',       icon: Settings },
]

interface SidebarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 border-r bg-card shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <span className="font-bold text-lg tracking-tight">ApplyFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          {user?.image && (
            <Image src={user.image} alt="" width={32} height={32} className="rounded-full shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: '/sign-in' })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
