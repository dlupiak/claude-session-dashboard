import { useState, useEffect } from 'react'
import { formatDuration } from '@/lib/utils/format'

export function RunningTimer({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState(() =>
    Date.now() - new Date(startedAt).getTime(),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - new Date(startedAt).getTime())
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  return (
    <span className="text-emerald-400">
      {formatDuration(elapsed)}
    </span>
  )
}
