import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://applyflow.dev'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'ApplyFlow — The Candidate Command Center',
    template: '%s | ApplyFlow',
  },
  description:
    'The calm, high-density job application tracker for thoughtful engineers. Triage urgent follow-ups, lock resume versions, and master your interview loops with zero recruiter surveillance.',
  keywords: [
    'job tracker',
    'job application tracker',
    'developer job search',
    'software engineer interview',
    'resume versioning',
    'kanban job board',
    'candidate command center',
  ],
  authors: [{ name: 'ApplyFlow Team' }],
  creator: 'ApplyFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    title: 'ApplyFlow — The Candidate Command Center',
    description:
      'Spreadsheets decay by week three. ApplyFlow gives engineers keyboard speed, actionable triage, and exact resume-to-role traceability — 100% free with zero recruiter surveillance.',
    siteName: 'ApplyFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApplyFlow — The Candidate Command Center',
    description:
      'High-density candidate command center for thoughtful engineers. Keyboard speed, urgency triage, and exact resume version tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
