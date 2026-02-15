import { useQuery } from '@tanstack/react-query'
import { activeSessionsQuery } from './sessions.queries'

export function ActiveSessionsBadge() {
  const { data: activeSessions } = useQuery(activeSessionsQuery)
  const count = activeSessions?.length ?? 0

  if (count === 0) return null

  return (
    <span className="ml-auto rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
      {count}
    </span>
  )
}
