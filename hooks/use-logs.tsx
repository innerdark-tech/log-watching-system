"use client"

import { useState, useEffect } from "react"

export function useLogs({ page = 1, perPage = 20, filters = {}, searchTerm = "" } = {}) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [stats, setStats] = useState({ total: 0, success: 0, errors: 0, pending: 0 })
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage !== 'all' ? perPage.toString() : null,
        })

        if (filters.apiName) params.append("api_name", filters.apiName)
        if (filters.method) params.append("method", filters.method)
        if (filters.domain) params.append("domain", filters.domain)
        if (searchTerm) params.append("search", searchTerm)

        const response = await fetch(`/api/logs?${params.toString()}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        console.log(data);
        
        setLogs(data.data || [])
        setTotalCount(data.meta?.total || 0)
        setTotalPages(data.meta?.last_page || 0)
        setStats(data.meta?.stats || { total: 0, success: 0, errors: 0, pending: 0 })
      } catch (err) {
        setError(err.message)
        setLogs([])
        setStats({ total: 0, success: 0, errors: 0, pending: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [page, perPage, filters.apiName, filters.method, filters.url, searchTerm])

  return { logs, loading, error, totalCount, totalPages, stats }
}
