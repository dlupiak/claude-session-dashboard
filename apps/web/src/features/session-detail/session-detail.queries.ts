import { queryOptions } from '@tanstack/react-query'
import { getSessionDetail, getSessionMessages } from './session-detail.server'

export function sessionDetailQuery(sessionId: string, projectPath: string) {
  return queryOptions({
    queryKey: ['session', 'detail', sessionId],
    queryFn: () => getSessionDetail({ data: { sessionId, projectPath } }),
    staleTime: 30_000,
  })
}

export function sessionMessagesQuery(
  sessionId: string,
  projectPath: string,
  offset: number,
  limit: number,
) {
  return queryOptions({
    queryKey: ['session', 'messages', sessionId, offset, limit],
    queryFn: () =>
      getSessionMessages({ data: { sessionId, projectPath, offset, limit } }),
  })
}
