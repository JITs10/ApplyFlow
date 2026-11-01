'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, SlidersHorizontal } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'ASSESSMENT', label: 'Assessment' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
]

const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Newest Added' },
  { value: 'created_asc', label: 'Oldest Added' },
  { value: 'company_asc', label: 'Company (A–Z)' },
  { value: 'date_desc', label: 'Applied Date (Recent)' },
]

export function ApplicationFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentQ = searchParams.get('q') || ''
  const currentStatus = searchParams.get('status') || 'ALL'
  const currentSort = searchParams.get('sort') || 'created_desc'

  const [searchValue, setSearchValue] = useState(currentQ)

  // Sync internal state if URL search param changes externally
  useEffect(() => {
    setSearchValue(currentQ)
  }, [currentQ])

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    // When filters change, reset back to page 1
    params.delete('page')

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'ALL' || (key === 'sort' && value === 'created_desc')) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    startTransition(() => {
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  // Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentQ) {
        updateFilters({ q: searchValue.trim() || null })
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [searchValue])

  const hasActiveFilters = Boolean(currentQ || (currentStatus && currentStatus !== 'ALL') || (currentSort && currentSort !== 'created_desc'))

  const handleClear = () => {
    setSearchValue('')
    startTransition(() => {
      router.push(pathname)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search company, role, or location..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 pr-8"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-[150px]">
          <Select
            value={currentStatus}
            onValueChange={(val) => updateFilters({ status: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[170px]">
          <Select
            value={currentSort}
            onValueChange={(val) => updateFilters({ sort: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
