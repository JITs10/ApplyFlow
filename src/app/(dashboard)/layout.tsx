import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/sign-in')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={session.user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileNav user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
