import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { GuestBanner } from '@/components/layout/GuestBanner'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const isGuest = session.user?.isGuest === true

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={session.user} isGuest={isGuest} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {isGuest && <GuestBanner />}
        <MobileNav user={session.user} isGuest={isGuest} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
