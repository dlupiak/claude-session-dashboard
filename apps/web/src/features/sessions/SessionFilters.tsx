import type { SessionSummary } from '@/lib/parsers/types'

interface SessionFiltersProps {
  sessions: SessionSummary[]
  search: string
  onSearchChange: (value: string) => void
  statusFilter: 'all' | 'active' | 'completed'
  onStatusFilterChange: (value: 'all' | 'active' | 'completed') => void
  projectFilter: string
  onProjectFilterChange: (value: string) => void
}

export function SessionFilters({
  sessions,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  projectFilter,
  onProjectFilterChange,
}: SessionFiltersProps) {
  const projects = Array.from(new Set(sessions.map((s) => s.projectName))).sort()
  const activeCount = sessions.filter((s) => s.isActive).length

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search sessions..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />

      <div className="flex rounded-lg border border-gray-700 text-xs">
        {(['all', 'active', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`px-3 py-1.5 capitalize transition-colors ${
              statusFilter === status
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-gray-200'
            } ${status === 'all' ? 'rounded-l-lg' : ''} ${status === 'completed' ? 'rounded-r-lg' : ''}`}
          >
            {status}
            {status === 'active' && activeCount > 0 && (
              <span className="ml-1 text-emerald-400">({activeCount})</span>
            )}
          </button>
        ))}
      </div>

      {projects.length > 1 && (
        <select
          value={projectFilter}
          onChange={(e) => onProjectFilterChange(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm text-gray-200 outline-none focus:border-blue-500"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
