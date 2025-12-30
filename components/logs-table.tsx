"use client"

import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { getStatusColor, getMethodColor } from "@/lib/utils"
import { useState } from "react"

export function LogsTable({ logs, selectedLog, onSelectLog, currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage  }) {
  const [ dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <div className="space-y-4">
      {/* Logs */}
      <div className="space-y-2">
        {logs.length === 0 ? (
          <Card className="border-border/50 bg-card/50 p-8 text-center">
            <p className="text-muted-foreground">No logs found</p>
          </Card>
        ) : (
          logs.map((log) => (
            <Card
              key={log.id}
              className={`border-border/50 p-4 cursor-pointer transition-all hover:bg-card/80 ${
                selectedLog?.id === log.id ? "ring-2 ring-primary bg-card/80" : "bg-card/50"
              }`}
              onClick={() => onSelectLog(log)}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Status */}
                <div className="col-span-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                </div>

                {/* API Name */}
                <div className="col-span-5 space-y-1">
                  <p className="text-sm font-medium truncate">{log.api_name}
                    <span className='ms-3 text-xs font-mono'>
                      ({log.domain})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{log.url}</p>
                </div>

                {/* Method */}
                <div className="col-span-3">
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${getMethodColor(log.method)}`}>
                    {log.method}
                  </span>
                </div>

                {/* Status Code */}
                <div className="col-span-1">
                  <p className="text-sm font-mono text-emerald-500">{log.status || "—"}</p>
                </div>

                {/* Time */}
                <div className="col-span-2 text-right">
                  <p className="text-xs text-muted-foreground">
                    {log.created_at ? new Date(log.created_at).toLocaleTimeString() : "—"}
                    <br />
                    {log.created_at ? new Date(log.created_at).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {totalPages !== 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="relative flex space-x-3">
            <button
              onClick={() => setDropdownOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              { itemsPerPage.toString().toUpperCase() }
              <ChevronDown />
            </button>
            <div className={"absolute text-center bottom-0 right-0 mt-2 p-3 bg-white rounded-md shadow-xl " +(dropdownOpen ? "" : "hidden")}>
              <a onClick={() => setItemsPerPage(10)} href="#" className="block rounded-2xl px-4 py-2 text-gray-800 hover:bg-cyan-300 hover:text-white">10</a>
              <a onClick={() => setItemsPerPage(20)} href="#" className="block rounded-2xl px-4 py-2 text-gray-800 hover:bg-cyan-300 hover:text-white">20</a>
              <a onClick={() => setItemsPerPage(50)} href="#" className="block rounded-2xl px-4 py-2 text-gray-800 hover:bg-cyan-300 hover:text-white">50</a>
              <a onClick={() => setItemsPerPage(100)} href="#" className="block rounded-2xl px-4 py-2 text-gray-800 hover:bg-cyan-300 hover:text-white">100</a>
              <a onClick={() => setItemsPerPage('all')} href="#" className="block rounded-2xl px-4 py-2 text-gray-800 hover:bg-cyan-300 hover:text-white">ALL</a>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
