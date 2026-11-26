'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Table,
  Kanban,
  FileText,
  Clock,
  Terminal,
  Lock,
  Minus,
  Square,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Puzzle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'table' | 'kanban' | 'resumes'

export function InteractiveProductPreview() {
  const [activeTab, setActiveTab] = useState<TabType>('table')
  const [sliderPos, setSliderPos] = useState<number>(50) // 50% split by default
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Drag handler calculates split percentage based on pointer position (0% to 100%)
  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percent)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX)
      }
    }
    const onStopDragging = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onStopDragging)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onStopDragging)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onStopDragging)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onStopDragging)
    }
  }, [isDragging, handlePointerMove])

  return (
    <div className="w-full flex flex-col items-center">
      {/* Elevated interactive view switcher (outside clipped window to avoid occlusion) */}
      <div className="mb-5 flex items-center justify-center">
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Split-Slider Container */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true)
          handlePointerMove(e.clientX)
        }}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            setIsDragging(true)
            handlePointerMove(e.touches[0].clientX)
          }
        }}
        className="relative w-full rounded-xl border border-border/80 bg-card surface-window overflow-hidden select-none shadow-2xl cursor-ew-resize"
      >
        {/* Specular hairline top reflection */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20" aria-hidden="true" />

        {/* LAYER 1 (BASE): Google Chrome on Windows 11 */}
        <div className="w-full">
          {/* Windows Chrome Tab Bar */}
          <div className="px-3 pt-2 bg-muted/80 border-b border-border/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              {/* Chrome Active Tab */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-t-lg border-t border-x border-border/80 text-[11px] font-medium text-foreground max-w-[200px] shadow-xs">
                <div className="w-3.5 h-3.5 rounded-sm bg-primary/15 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 fill-primary" viewBox="0 0 40 40">
                    <polygon points="36,9 15,20 24,21" />
                    <polygon points="36,9 24,21 21,28" opacity="0.8" />
                  </svg>
                </div>
                <span className="truncate">ApplyFlow &mdash; Workspace</span>
                <X className="w-3 h-3 text-muted-foreground hover:text-foreground shrink-0 ml-1" />
              </div>

              {/* Chrome New Tab Button */}
              <div className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground text-xs font-bold">
                +
              </div>
            </div>

            {/* Windows 11 Window Controls */}
            <div className="hidden sm:flex items-center -mr-3 -mt-2 text-muted-foreground">
              <div className="w-10 h-7 flex items-center justify-center hover:bg-muted/80 text-foreground transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </div>
              <div className="w-10 h-7 flex items-center justify-center hover:bg-muted/80 text-foreground transition-colors">
                <Square className="w-3 h-3" />
              </div>
              <div className="w-10 h-7 flex items-center justify-center hover:bg-[#E81123] hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Windows Chrome Navigation / Omnibox Bar */}
          <div className="px-3 py-2 bg-card border-b border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowLeft className="w-3.5 h-3.5" />
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                <RotateCw className="w-3 h-3" />
              </div>

              {/* Windows Omnibox */}
              <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border/80 text-[11px] font-mono text-muted-foreground">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-foreground font-medium truncate">https://applyflow.dev/live-workspace</span>
              </div>

              <Puzzle className="w-3.5 h-3.5 text-muted-foreground hidden sm:block shrink-0" />
            </div>

            {/* Active View Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/60 text-[11px] font-mono text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeTab === 'table' ? 'Triage Table' : activeTab === 'kanban' ? 'Kanban Board' : 'Resume Vault'}</span>
            </div>
          </div>

          {/* Workspace Content (Windows Base) */}
          <WorkspaceContent activeTab={activeTab} os="windows" />
        </div>

        {/* LAYER 2 (CLIPPED TOP): Google Chrome on macOS */}
        <div
          className="absolute inset-0 overflow-hidden bg-card"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          {/* macOS Chrome Tab Bar */}
          <div className="px-3 pt-2 bg-muted/80 border-b border-border/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {/* macOS Traffic Lights */}
              <div className="flex items-center gap-1.5 pl-1" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-xs" />
              </div>

              {/* Chrome Active Tab (macOS) */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-card rounded-t-lg border-t border-x border-border/80 text-[11px] font-medium text-foreground max-w-[200px] shadow-xs">
                <div className="w-3.5 h-3.5 rounded-sm bg-primary/15 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 fill-primary" viewBox="0 0 40 40">
                    <polygon points="36,9 15,20 24,21" />
                    <polygon points="36,9 24,21 21,28" opacity="0.8" />
                  </svg>
                </div>
                <span className="truncate">ApplyFlow &mdash; Workspace</span>
                <X className="w-3 h-3 text-muted-foreground hover:text-foreground shrink-0 ml-1" />
              </div>

              {/* Chrome New Tab Button */}
              <div className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground text-xs font-bold">
                +
              </div>
            </div>

            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              macOS Mode
            </span>
          </div>

          {/* macOS Chrome Navigation / Omnibox Bar */}
          <div className="px-3 py-2 bg-card border-b border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowLeft className="w-3.5 h-3.5" />
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                <RotateCw className="w-3 h-3" />
              </div>

              {/* macOS Omnibox */}
              <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border/80 text-[11px] font-mono text-muted-foreground">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-foreground font-medium truncate">https://applyflow.dev/live-workspace</span>
              </div>

              <Puzzle className="w-3.5 h-3.5 text-muted-foreground hidden sm:block shrink-0" />
            </div>

            {/* Active View Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/60 text-[11px] font-mono text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeTab === 'table' ? 'Triage Table' : activeTab === 'kanban' ? 'Kanban Board' : 'Resume Vault'}</span>
            </div>
          </div>

          {/* Workspace Content (macOS Clipped Layer) */}
          <WorkspaceContent activeTab={activeTab} os="mac" />
        </div>

        {/* DRAGGABLE DIVIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical Divider Line with Emerald Glow */}
          <div className="absolute top-0 bottom-0 -left-[1.5px] w-[3px] bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />

          {/* Circular Grab Handle Knob */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation()
              setIsDragging(true)
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
              setIsDragging(true)
            }}
            style={{
              transform:
                sliderPos <= 2
                  ? 'translate(0, -50%)'
                  : sliderPos >= 98
                  ? 'translate(-100%, -50%)'
                  : 'translate(-50%, -50%)',
            }}
            className="absolute top-1/2 w-8 h-8 rounded-full bg-card border-2 border-emerald-500 shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize transition-transform hover:scale-110 active:scale-95 group select-none"
            role="slider"
            aria-label="Drag slider to compare Chrome on macOS and Windows"
            aria-valuenow={sliderPos}
            tabIndex={0}
          >
            <div className="flex items-center -space-x-0.5 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500">
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabSwitcher({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}) {
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      role="tablist"
      aria-label="Product preview views"
      className="inline-flex items-center p-1 rounded-lg bg-background/80 border border-border/80 shadow-inner text-xs font-medium"
    >
      <button
        role="tab"
        type="button"
        aria-selected={activeTab === 'table'}
        onClick={() => setActiveTab('table')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-mono text-[11px] cursor-pointer',
          activeTab === 'table'
            ? 'bg-foreground text-background shadow-xs font-semibold ring-1 ring-border/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        )}
      >
        <Table className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Triage Table</span>
      </button>

      <button
        role="tab"
        type="button"
        aria-selected={activeTab === 'kanban'}
        onClick={() => setActiveTab('kanban')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-mono text-[11px] cursor-pointer',
          activeTab === 'kanban'
            ? 'bg-foreground text-background shadow-xs font-semibold ring-1 ring-border/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        )}
      >
        <Kanban className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Kanban Board</span>
      </button>

      <button
        role="tab"
        type="button"
        aria-selected={activeTab === 'resumes'}
        onClick={() => setActiveTab('resumes')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-mono text-[11px] cursor-pointer',
          activeTab === 'resumes'
            ? 'bg-foreground text-background shadow-xs font-semibold ring-1 ring-border/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        )}
      >
        <FileText className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Resume Vault</span>
      </button>
    </div>
  )
}

function WorkspaceContent({ activeTab, os }: { activeTab: TabType; os: 'mac' | 'windows' }) {
  return (
    <div>
      {/* 1. Triage Table View */}
      {activeTab === 'table' && (
        <div id={`panel-table-${os}`} role="tabpanel" aria-label="Triage Table View">
          {/* Actionable Triage Strip */}
          <div className="p-4 sm:p-5 border-b bg-background">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                Action Required Today
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                2 urgent loops pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/[0.03] to-transparent surface-depth flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>Vercel</span>
                    <span className="text-muted-foreground">&mdash; Staff Frontend Engineer</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Architecture assessment deadline in 36 hours
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-500 border border-rose-500/30 shrink-0 shadow-xs">
                  Due Nov 8
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/[0.03] to-transparent surface-depth flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>Stripe</span>
                    <span className="text-muted-foreground">&mdash; Infrastructure Engineer</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Technical screen passed &bull; Follow-up with recruiter recommended
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0 shadow-xs">
                  5d Idle
                </span>
              </div>
            </div>
          </div>

          {/* High Density Applications Table */}
          <div className="divide-y text-xs overflow-x-auto">
            <div className="grid grid-cols-12 min-w-[640px] px-4 py-2 font-mono text-[11px] text-muted-foreground bg-muted/30">
              <div className="col-span-4">COMPANY & ROLE</div>
              <div className="col-span-2">STAGE</div>
              <div className="col-span-3">RESUME BOUND</div>
              <div className="col-span-2">NEXT ACTION</div>
              <div className="col-span-1 text-right">DATE</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-12 min-w-[640px] px-4 py-3 items-center hover:bg-muted/20 transition-colors">
              <div className="col-span-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-muted border font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  V
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">Vercel</span>
                  <span className="text-[11px] text-muted-foreground block truncate">Staff Frontend Engineer</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" aria-hidden="true" />
                <span className="truncate">Assessment</span>
              </div>
              <div className="col-span-3 font-mono text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                <FileText className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="truncate">Staff-Frontend-v4.pdf</span>
              </div>
              <div className="col-span-2 text-foreground font-medium text-[11px] truncate">
                Submit take-home
              </div>
              <div className="col-span-1 text-right font-mono text-[11px] text-muted-foreground">
                Nov 2
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 min-w-[640px] px-4 py-3 items-center hover:bg-muted/20 transition-colors">
              <div className="col-span-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-muted border font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  S
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">Stripe</span>
                  <span className="text-[11px] text-muted-foreground block truncate">Infrastructure Engineer</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
                <span className="truncate">Screening</span>
              </div>
              <div className="col-span-3 font-mono text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                <FileText className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="truncate">Systems-Core-v2.pdf</span>
              </div>
              <div className="col-span-2 text-foreground font-medium text-[11px] truncate">
                Follow-up on onsite
              </div>
              <div className="col-span-1 text-right font-mono text-[11px] text-muted-foreground">
                Oct 30
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-12 min-w-[640px] px-4 py-3 items-center hover:bg-muted/20 transition-colors">
              <div className="col-span-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-muted border font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  L
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">Linear</span>
                  <span className="text-[11px] text-muted-foreground block truncate">Fullstack Product Eng</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
                <span className="truncate">Technical</span>
              </div>
              <div className="col-span-3 font-mono text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                <FileText className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="truncate">Founding-Fullstack-2026.pdf</span>
              </div>
              <div className="col-span-2 text-foreground font-medium text-[11px] truncate">
                System design prep
              </div>
              <div className="col-span-1 text-right font-mono text-[11px] text-muted-foreground">
                Oct 26
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-12 min-w-[640px] px-4 py-3 items-center hover:bg-muted/20 transition-colors">
              <div className="col-span-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-muted border font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  D
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">Datadog</span>
                  <span className="text-[11px] text-muted-foreground block truncate">Distributed Systems</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                <span className="truncate">Offer Stage</span>
              </div>
              <div className="col-span-3 font-mono text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                <FileText className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="truncate">Systems-Core-v2.pdf</span>
              </div>
              <div className="col-span-2 text-emerald-500 font-medium text-[11px] truncate">
                Review equity terms
              </div>
              <div className="col-span-1 text-right font-mono text-[11px] text-muted-foreground">
                Oct 21
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Visual Kanban Board View */}
      {activeTab === 'kanban' && (
        <div id={`panel-kanban-${os}`} role="tabpanel" aria-label="Kanban Board View" className="p-4 sm:p-5 bg-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1: Applied */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  APPLIED
                </span>
                <span className="px-1.5 py-0.5 rounded bg-muted/80 border border-border/60 text-[10px] shadow-xs">2</span>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-card surface-depth space-y-2 card-interactive hover:border-foreground/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">Anthropic</span>
                  <span className="text-[10px] font-mono text-muted-foreground">3d ago</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Research Systems Engineer</div>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">Systems-Core-v2.pdf</span>
                  <span>$210k-$260k</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-card surface-depth space-y-2 card-interactive hover:border-foreground/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">Figma</span>
                  <span className="text-[10px] font-mono text-muted-foreground">5d ago</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Editor Platform Engineer</div>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">Staff-Frontend-v4.pdf</span>
                  <span>$195k-$245k</span>
                </div>
              </div>
            </div>

            {/* Column 2: Screening */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-blue-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  SCREENING
                </span>
                <span className="px-1.5 py-0.5 rounded bg-muted/80 border border-border/60 text-[10px] shadow-xs">1</span>
              </div>

              <div className="p-3 rounded-lg border border-blue-500/30 bg-card surface-depth space-y-2 card-interactive hover:border-blue-500">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">Stripe</span>
                  <span className="text-[10px] font-mono text-amber-500 font-medium">Follow-up</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Infrastructure Engineer</div>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">Systems-Core-v2.pdf</span>
                  <span>$220k-$270k</span>
                </div>
              </div>
            </div>

            {/* Column 3: Technical */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  TECHNICAL
                </span>
                <span className="px-1.5 py-0.5 rounded bg-muted/80 border border-border/60 text-[10px] shadow-xs">2</span>
              </div>

              <div className="p-3 rounded-lg border border-rose-500/40 bg-card surface-depth space-y-2 card-interactive hover:border-rose-500">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">Vercel</span>
                  <span className="text-[10px] font-mono text-rose-500 font-semibold">Due 36h</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Take-home architecture</div>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">Staff-Frontend-v4.pdf</span>
                  <span>$230k-$280k</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-card surface-depth space-y-2 card-interactive hover:border-foreground/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">Linear</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Nov 10</span>
                </div>
                <div className="text-[11px] text-muted-foreground">System design onsite</div>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">Founding-Fullstack-2026.pdf</span>
                  <span>$200k-$250k</span>
                </div>
              </div>
            </div>

            {/* Column 4: Offer */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  OFFER
                </span>
                <span className="px-1.5 py-0.5 rounded bg-muted/80 border border-border/60 text-[10px] shadow-xs">1</span>
              </div>

              <div className="p-3 rounded-lg border border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent surface-depth space-y-2 card-interactive hover:border-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">Datadog</span>
                  <span className="text-[10px] font-mono text-emerald-500 font-semibold">Offer in hand</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Staff Distributed Systems</div>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Decision: Nov 14
                  </span>
                  <span className="text-foreground font-semibold">$265k + Equity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Resume Vault Traceability View */}
      {activeTab === 'resumes' && (
        <div id={`panel-resumes-${os}`} role="tabpanel" aria-label="Resume Vault View" className="p-4 sm:p-5 bg-background space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <div className="text-xs font-semibold text-foreground">Saved Resume Versions</div>
              <p className="text-[11px] text-muted-foreground">
                Never guess which resume you submitted. Every application is linked to the exact file version you sent.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-muted/60 text-muted-foreground">
              3 Active Resumes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Resume 1 */}
            <div className="p-4 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3.5 card-interactive hover:border-foreground/30">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-medium shadow-xs">
                  Primary
                </span>
              </div>
              <div>
                <div className="font-mono text-xs font-semibold text-foreground truncate">
                  Staff-Frontend-v4.pdf
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  142 KB &bull; Updated 4d ago
                </div>
              </div>
              <div className="pt-2.5 border-t border-border/60 text-[11px] font-mono space-y-1.5 text-muted-foreground">
                <div className="text-foreground font-semibold text-[10px]">ATTACHED TO 2 ACTIVE ROLES:</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Vercel (Staff)</span>
                  <span className="text-purple-500 font-medium">Assessment</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Figma (Platform)</span>
                  <span className="text-zinc-400">Applied</span>
                </div>
              </div>
            </div>

            {/* Resume 2 */}
            <div className="p-4 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3.5 card-interactive hover:border-foreground/30">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/60 bg-muted/80 text-muted-foreground shadow-xs">
                  Specialized
                </span>
              </div>
              <div>
                <div className="font-mono text-xs font-semibold text-foreground truncate">
                  Systems-Core-v2.pdf
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  158 KB &bull; Updated Oct 22
                </div>
              </div>
              <div className="pt-2.5 border-t border-border/60 text-[11px] font-mono space-y-1.5 text-muted-foreground">
                <div className="text-foreground font-semibold text-[10px]">ATTACHED TO 3 ACTIVE ROLES:</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Datadog (Distributed)</span>
                  <span className="text-emerald-500 font-medium">Offer</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Stripe (Infra)</span>
                  <span className="text-blue-500 font-medium">Screening</span>
                </div>
              </div>
            </div>

            {/* Resume 3 */}
            <div className="p-4 rounded-xl border border-border/80 bg-gradient-to-b from-card to-card/70 surface-depth space-y-3.5 card-interactive hover:border-foreground/30">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/60 bg-muted/80 text-muted-foreground shadow-xs">
                  Startup
                </span>
              </div>
              <div>
                <div className="font-mono text-xs font-semibold text-foreground truncate">
                  Founding-Fullstack-2026.pdf
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  135 KB &bull; Updated Oct 15
                </div>
              </div>
              <div className="pt-2.5 border-t border-border/60 text-[11px] font-mono space-y-1.5 text-muted-foreground">
                <div className="text-foreground font-semibold text-[10px]">ATTACHED TO 1 ACTIVE ROLE:</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Linear (Product)</span>
                  <span className="text-amber-500 font-medium">Technical</span>
                </div>
                <div className="text-muted-foreground/60 text-[10px] pt-0.5">
                  Ready for seed & Series A loops
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Command Ribbon Footer */}
      <div className="px-4 py-2.5 border-t bg-muted/40 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-foreground">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium">Keyboard Driven:</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">
              {os === 'mac' ? '⌘K' : 'Ctrl+K'}
            </kbd>{' '}
            Quick Search
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">N</kbd> New Application
          </span>
          <span className="hidden md:inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border bg-background text-[10px]">G+K</kbd> Kanban
          </span>
        </div>

        <div className="flex items-center gap-2 text-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span>Zero Recruiter Tracking</span>
        </div>
      </div>
    </div>
  )
}
