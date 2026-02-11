import { queryOptions } from '@tanstack/react-query'
import { getSessionList, getActiveSessionList } from './sessions.server'

export const sessionListQuery = queryOptions({
  queryKey: ['sessions', 'list'],
  queryFn: () => getSessionList(),
  refetchInterval: 30_000,
})

export const activeSessionsQuery = queryOptions({
  queryKey: ['sessions', 'active'],
  queryFn: () => getActiveSessionList(),
  refetchInterval: 3_000,
})
