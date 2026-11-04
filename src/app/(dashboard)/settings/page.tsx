import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Download, ShieldCheck, Database, HardDrive, FileText, Briefcase } from 'lucide-react'

export const metadata = {
  title: 'Settings — ApplyFlow',
}

export default async function SettingsPage() {
  const user = await requireUser()

  const [appCount, resumeCount, interviewCount] = await Promise.all([
    db.application.count({ where: { userId: user.id } }),
    db.resume.count({ where: { userId: user.id } }),
    db.interview.count({ where: { userId: user.id } }),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account profile, storage usage, and data exports.
        </p>
      </div>

      {/* Account Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Account Profile
          </CardTitle>
          <CardDescription>
            Your account is authenticated via GitHub OAuth.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">{user.name || 'Not provided'}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Email Address</span>
            <span className="font-medium text-foreground">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Sign-in Provider</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              GitHub OAuth
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Workspace Storage & Stats
          </CardTitle>
          <CardDescription>
            Live count of resources stored in your cloud workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>Applications</span>
              </div>
              <p className="text-2xl font-bold">{appCount}</p>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <FileText className="h-4 w-4 text-primary" />
                <span>Resumes Stored</span>
              </div>
              <p className="text-2xl font-bold">{resumeCount}</p>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <HardDrive className="h-4 w-4 text-primary" />
                <span>Interviews Logged</span>
              </div>
              <p className="text-2xl font-bold">{interviewCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Portability / Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Data Export & Backup
          </CardTitle>
          <CardDescription>
            Export your entire job search history to an RFC 4180 compliant CSV spreadsheet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download all your applications, interview timelines, recruiter contact details, salary info, and notes into a CSV file compatible with Microsoft Excel, Apple Numbers, and Google Sheets.
          </p>

          <Button asChild className="gap-2">
            <a href="/api/applications/export" download>
              <Download className="h-4 w-4" />
              Download All Applications (.csv)
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
