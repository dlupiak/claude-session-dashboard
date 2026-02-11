import { createServerFn } from '@tanstack/react-start'
import { scanAllSessions, getActiveSessions } from '@/lib/scanner/session-scanner'

export const getSessionList = createServerFn({ method: 'GET' }).handler(
  async () => {
    return scanAllSessions()
  },
)

export const getActiveSessionList = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getActiveSessions()
  },
)
