'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateApplicationStatus } from '@/actions/applications'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Plus,
  Table as TableIcon,
  Search,
  MoreVertical,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react'
import type { ApplicationStatus } from '@prisma/client'

export interface KanbanApplication {
  id: string
  company: string
  jobTitle: string
  status: ApplicationStatus
  location: string | null
  workMode: string | null
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  nextFollowUpAt: Date | string | null
  updatedAt: Date | string
  jobUrl: string | null
  resume?: { fileName: string } | null
  interviews?: Array<{ startAt: Date | string; title: string }>
}

const STAGE_ORDER: ApplicationStatus[] = ['WISHLIST', 'APPLIED', 'ASSESSMENT', 'INTERVIEW', 'OFFER']

function getStageStep(status: ApplicationStatus): number {
  if (status === 'REJECTED') return -1
  const idx = STAGE_ORDER.indexOf(status)
  return idx === -1 ? 0 : idx
}

function formatSalaryCompact(min: number | null, max: number | null, curr: string): string | null {
  if (!min && !max) return null
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)
  const sym = curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : `${curr} `
  if (min && max) return `${sym}${fmt(min)}–${fmt(max)}`
  if (min) return `${sym}${fmt(min)}+`
  if (max) return `<${sym}${fmt(max)}`
  return null
}

const COLUMNS: Array<{
  id: ApplicationStatus
  label: string
  color: string
  dotColor: string
}> = [
  { id: 'APPLIED', label: 'Applied', color: 'border-blue-500/20', dotColor: 'bg-blue-500' },
  { id: 'ASSESSMENT', label: 'Assessment', color: 'border-purple-500/20', dotColor: 'bg-purple-500' },
  { id: 'INTERVIEW', label: 'Interview', color: 'border-amber-500/20', dotColor: 'bg-amber-500' },
  { id: 'OFFER', label: 'Offer', color: 'border-emerald-500/20', dotColor: 'bg-emerald-500' },
  { id: 'REJECTED', label: 'Rejected', color: 'border-rose-500/20', dotColor: 'bg-rose-500' },
]

export function KanbanBoard({ initialApplications }: { initialApplications: KanbanApplication[] }) {
  const router = useRouter()
  const [applications, setApplications] = useState<KanbanApplication[]>(initialApplications)
  const [searchQuery, setSearchQuery] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [activeDropColumn, setActiveDropColumn] = useState<ApplicationStatus | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter applications by search query
  const filteredApps = applications.filter((app) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      app.company.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      (app.location && app.location.toLowerCase().includes(q))
    )
  })

  // Handle status change (drag-and-drop or dropdown select)
  async function handleMoveStatus(appId: string, newStatus: ApplicationStatus) {
    const targetApp = applications.find((a) => a.id === appId)
    if (!targetApp || targetApp.status === newStatus) return

    const previousStatus = targetApp.status

    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    )

    try {
      await updateApplicationStatus(appId, newStatus)
      toast.success(`Moved ${targetApp.company} to ${newStatus.toLowerCase()}`)
      startTransition(() => {
        router.refresh()
      })
    } catch {
      // Rollback on error
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: previousStatus } : app))
      )
      toast.error('Failed to update stage')
    }
  }

  // HTML5 Drag Handlers
  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(id)
  }

  function onDragEnd() {
    setDraggingId(null)
    setActiveDropColumn(null)
  }

  function onDragOver(e: React.DragEvent, colId: ApplicationStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (activeDropColumn !== colId) {
      setActiveDropColumn(colId)
    }
  }

  function onDragLeave(e: React.DragEvent, colId: ApplicationStatus) {
    e.preventDefault()
    if (activeDropColumn === colId) {
      setActiveDropColumn(null)
    }
  }

  function onDrop(e: React.DragEvent, colId: ApplicationStatus) {
    e.preventDefault()
    const appId = e.dataTransfer.getData('text/plain')
    setActiveDropColumn(null)
    setDraggingId(null)
    if (appId) {
      handleMoveStatus(appId, colId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">
            Kanban <span className="serif-accent text-emerald-700 dark:text-emerald-400">Board</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Drag and drop applications across your hiring stages.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/applications">
              <TableIcon className="w-3.5 h-3.5" />
              Table View
            </Link>
          </Button>

          <Button size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/applications/new">
              <Plus className="w-3.5 h-3.5" />
              New Application
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Filter by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-card"
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {filteredApps.length} applications
        </span>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = filteredApps.filter((a) => a.status === col.id)
          const isOver = activeDropColumn === col.id

          return (
            <div
              key={col.id}
              onDragOver={(e) => onDragOver(e, col.id)}
              onDragLeave={(e) => onDragLeave(e, col.id)}
              onDrop={(e) => onDrop(e, col.id)}
              className={`rounded-xl border border-border/80 bg-muted/30 p-2.5 flex flex-col min-h-[500px] shadow-inner transition-all duration-150 ${
                isOver ? 'border-primary ring-2 ring-primary/20 bg-muted/60' : 'border-border/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor} ring-1 ring-border/50 shadow-xs`} />
                  <span className="text-xs font-semibold text-foreground tracking-tight">
                    {col.label}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/80 border border-border/60 shadow-xs">
                  {colApps.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1">
                {colApps.length === 0 ? (
                  <div className="h-32 rounded-lg border border-dashed border-border/60 flex items-center justify-center text-center p-3 text-[11px] text-muted-foreground/80 font-mono">
                    Drop applications here
                  </div>
                ) : (
                  colApps.map((app) => {
                    const isDragging = draggingId === app.id
                    const nextDate = app.nextFollowUpAt ? new Date(app.nextFollowUpAt) : null
                    const stageStep = getStageStep(app.status)
                    const salaryTag = formatSalaryCompact(app.salaryMin, app.salaryMax, app.currency)

                    return (
                      <Card
                        key={app.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, app.id)}
                        onDragEnd={onDragEnd}
                        className={`rx-card p-3 rounded-lg surface-depth card-interactive hover:border-foreground/30 cursor-grab active:cursor-grabbing transition-all space-y-2.5 relative overflow-hidden group ${
                          isDragging ? 'opacity-40 scale-95' : 'opacity-100'
                        }`}
                      >
                        {/* Milestone Progress Stepper Hairline */}
                        {stageStep >= 0 ? (
                          <div className="flex items-center gap-1 w-full" title={`Stage step ${stageStep + 1} of 5`}>
                            {[0, 1, 2, 3, 4].map((step) => (
                              <div
                                key={step}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  step <= stageStep ? col.dotColor : 'bg-muted/80'
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="h-1 w-full rounded-full bg-rose-500/40" title="Application closed" />
                        )}

                        {/* Company & Quick Move Action */}
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/applications/${app.id}`}
                            className="font-semibold text-xs text-foreground hover:underline flex items-center gap-2 min-w-0"
                          >
                            <span className="w-5 h-5 rounded bg-muted/80 border border-border/80 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                              {app.company.charAt(0).toUpperCase()}
                            </span>
                            <span className="truncate">{app.company}</span>
                          </Link>

                          {/* Quick Stage Mover Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs">
                              <div className="px-2 py-1 text-[10px] font-mono text-muted-foreground uppercase">
                                Move to Stage:
                              </div>
                              {COLUMNS.map((target) => (
                                <DropdownMenuItem
                                  key={target.id}
                                  disabled={target.id === app.status}
                                  onClick={() => handleMoveStatus(app.id, target.id)}
                                  className="text-xs gap-2"
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${target.dotColor}`} />
                                  {target.label}
                                </DropdownMenuItem>
                              ))}
                              <div className="border-t my-1" />
                              <DropdownMenuItem asChild className="text-xs">
                                <Link href={`/applications/${app.id}`}>Open Details &rarr;</Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Job Title */}
                        <p className="text-[11px] text-muted-foreground line-clamp-1 font-medium">
                          {app.jobTitle}
                        </p>

                        {/* Details / Badges */}
                        <div className="pt-1.5 border-t border-border/50 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                          {salaryTag && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {salaryTag}
                            </span>
                          )}

                          {app.location && (
                            <span className="truncate max-w-[100px]">{app.location}</span>
                          )}

                          {nextDate && (
                            <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              <Clock className="w-2.5 h-2.5" />
                              {formatDate(nextDate)}
                            </span>
                          )}
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
