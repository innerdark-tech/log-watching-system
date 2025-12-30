"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogsFilters({ filters, setFilters, logs }) {
  // Extract unique values
  const apiNames = Array.from(new Set(logs.map((l) => l.api_name).filter(Boolean)))
  const methods = Array.from(new Set(logs.map((l) => l.method).filter(Boolean)))
  const domains = Array.from(new Set(logs.map((l) => l.domain).filter(Boolean)))

  const handleReset = () => {
    setFilters({ apiName: "", method: "", domain: "" })
  }

  const hasFilters = filters.apiName || filters.method || filters.domain

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* API Name Filter */}
        <select
          value={filters.apiName}
          onChange={(e) => setFilters({ ...filters, apiName: e.target.value })}
          className="px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none"
        >
          <option value="">All APIs</option>
          {apiNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Method Filter */}
        <select
          value={filters.method}
          onChange={(e) => setFilters({ ...filters, method: e.target.value })}
          className="px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none"
        >
          <option value="">All Methods</option>
          {methods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>

        {/* Domain Filter */}
        <select
          value={filters.domain}
          onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
          className="px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none"
        >
          <option value="">All Domains</option>
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="w-full text-xs">
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
