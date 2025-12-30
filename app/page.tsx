"use client"

import { useState, useMemo } from "react"
import { Search, Clock, AlertCircle, CheckCircle, Loader } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LogsHeader } from "@/components/logs-header"
import { LogsFilters } from "@/components/logs-filters"
import { LogsTable } from "@/components/logs-table"
import { LogDetails } from "@/components/log-details"
import { useLogs } from "@/hooks/use-logs"

const ITEMS_PER_PAGE = 20

export default function Page() {
  const [filters, setFilters] = useState({
    apiName: "",
    method: "",
    domain: "",
  })
  const [selectedLog, setSelectedLog] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)

  const { logs, loading, error, totalCount, totalPages, stats } = useLogs({
    page: currentPage,
    perPage: itemsPerPage,
    filters,
    searchTerm,
  })

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      setSelectedLog(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LogsHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Total Requests"
            value={stats.total}
            color="bg-blue-500/10 text-blue-400"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Successful"
            value={stats.success}
            color="bg-emerald-500/10 text-emerald-400"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="Errors"
            value={stats.errors}
            color="bg-red-500/10 text-red-400"
          />
          <StatCard
            icon={<Loader className="w-5 h-5" />}
            label="Pending"
            value={stats.pending}
            color="bg-amber-500/10 text-amber-400"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logs List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3 p-4 border-b border-border/50">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>

              {/* Filters */}
              <LogsFilters filters={filters} setFilters={setFilters} logs={logs} />
            </Card>

            {/* Logs Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <Card className="border-border/50 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 font-medium">Error loading logs</p>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </Card>
            ) : (
              <LogsTable
                logs={logs}
                selectedLog={selectedLog}
                onSelectLog={setSelectedLog}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            )}
          </div>

          {/* Right Sidebar - Details */}
          {selectedLog && (
            <div className="lg:col-span-1">
              <LogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <Card className={`border-border/50 p-4 ${color.split(" ")[0]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${color.split(" ")[1]}`}>{value}</p>
        </div>
        <div className={`${color.split(" ")[1]} p-2 rounded-lg`}>{icon}</div>
      </div>
    </Card>
  )
}
