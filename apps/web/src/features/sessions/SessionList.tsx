import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sessionListQuery, activeSessionsQuery } from './sessions.queries'
import { SessionCard } from './SessionCard'
import { SessionFilters } from './SessionFilters'
import type { SessionSummary } from '@/lib/parsers/types'

export function SessionList() {
  const { data: sessions = [], isLoading } = useQuery(sessionListQuery)
  const { data: activeSessions = [] } = useQuery(activeSessionsQuery)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [projectFilter, setProjectFilter] = useState('')

  // Merge active status from the fast-polling active query
  const mergedSessions = useMemo(() => {
    const activeIds = new Set(activeSessions.map((s) => s.sessionId))
    return sessions.map((s) => ({
      ...s,
      isActive: activeIds.has(s.sessionId),
    }))
  }, [sessions, activeSessions])

  const filtered = useMemo(() => {
    return mergedSessions.filter((s: SessionSummary) => {
      if (statusFilter === 'active' && !s.isActive) return false
      if (statusFilter === 'completed' && s.isActive) return false
      if (projectFilter && s.projectName !== projectFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.projectName.toLowerCase().includes(q) ||
          s.branch?.toLowerCase().includes(q) ||
          s.sessionId.toLowerCase().includes(q) ||
          s.cwd?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [mergedSessions, search, statusFilter, projectFilter])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-gray-800 bg-gray-900/50"
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <SessionFilters
        sessions={mergedSessions}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
      />

      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            {sessions.length === 0
              ? 'No sessions found in ~/.claude'
              : 'No sessions match your filters'}
          </div>
        ) : (
          filtered.map((session) => (
            <SessionCard key={session.sessionId} session={session} />
          ))
        )}
      </div>

      <p className="mt-4 text-xs text-gray-600">
        {filtered.length} of {sessions.length} sessions
      </p>
    </div>
  )
}
