import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { paginatedSessionListQuery, activeSessionsQuery } from './sessions.queries'
import { SessionCard } from './SessionCard'
import { SessionFilters } from './SessionFilters'
import { PaginationControls } from './PaginationControls'
import { Route } from '@/routes/_dashboard/sessions/index'

export function SessionList() {
  const navigate = useNavigate()
  const { page, pageSize, search, status, project } = Route.useSearch()

  const { data: paginatedData, isLoading } = useQuery(
    paginatedSessionListQuery({ page, pageSize, search, status, project }),
  )
  const { data: activeSessions = [] } = useQuery(activeSessionsQuery)

  // Merge active session status from the fast-polling query into current page results
  const mergedSessions = useMemo(() => {
    if (!paginatedData) return []
    const activeIds = new Set(activeSessions.map((s) => s.sessionId))
    return paginatedData.sessions.map((s) => ({
      ...s,
      isActive: activeIds.has(s.sessionId) || s.isActive,
    }))
  }, [paginatedData, activeSessions])

  function handlePageChange(newPage: number) {
    navigate({
      to: '/sessions',
      search: (prev) => ({ ...prev, page: newPage }),
    })
  }

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

  const totalCount = paginatedData?.totalCount ?? 0
  const totalPages = paginatedData?.totalPages ?? 1
  const projects = paginatedData?.projects ?? []
  const activeCount = activeSessions.length

  return (
    <div>
      <SessionFilters projects={projects} activeCount={activeCount} />

      <div className="mt-4 space-y-2">
        {mergedSessions.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            {totalCount === 0 && !search && status === 'all' && !project
              ? 'No sessions found in ~/.claude'
              : 'No sessions match your filters'}
          </div>
        ) : (
          mergedSessions.map((session) => (
            <SessionCard key={session.sessionId} session={session} />
          ))
        )}
      </div>

      <div className="mt-4">
        <PaginationControls
          page={paginatedData?.page ?? page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
