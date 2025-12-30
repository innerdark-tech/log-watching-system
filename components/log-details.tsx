"use client"

import { X, Copy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStatusColor, getMethodColor } from "@/lib/utils"

export function LogDetails({ log, onClose }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-semibold">Log Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Header Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">API Name</p>
            <span className={`text-sm font-mono font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400`}>
              {log.api_name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Method</p>
            <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${getMethodColor(log.method)}`}>
              {log.method}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Status</p>
            <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${getStatusColor(log.status)}`}>
              {log.status || "—"}
            </span>
          </div>
        </div>

        <div className="border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground mb-2">URL</p>
          <div className="flex items-center justify-between gap-2 p-2 bg-background/50 rounded text-xs font-mono break-all">
            <span className="text-muted-foreground truncate">{log.url}</span>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.url)} className="flex-shrink-0">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Request Payload */}
        {log.request_payload && (
          <div className="border-t border-border/50 pt-4">
            <p className="text-xs text-muted-foreground mb-2">Request Payload</p>
            <div className="bg-background/50 rounded p-3 max-h-48 overflow-y-auto">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                {typeof log.request_payload === "string"
                  ? log.request_payload
                  : JSON.stringify(log.request_payload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Response */}
        {log.response && (
          <div className="border-t border-border/50 pt-4">
            <p className="text-xs text-muted-foreground mb-2">Response</p>
            <div className="bg-background/50 rounded p-3 max-h-48 overflow-y-auto">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                {typeof log.response === "string" ? log.response : JSON.stringify(log.response, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Error Message */}
        {log.error_message && (
          <div className="border-t border-border/50 pt-4">
            <p className="text-xs text-muted-foreground mb-2">Error Message</p>
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
              <p className="text-xs text-red-400">{log.error_message}</p>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground">Timestamp</p>
          <p className="text-sm font-mono mt-1">{log.created_at ? new Date(log.created_at).toLocaleString() : "—"}</p>
        </div>
      </div>
    </Card>
  )
}
