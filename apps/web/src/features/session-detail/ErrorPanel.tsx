import type { SessionError } from '@/lib/parsers/types'
import { formatDateTime } from '@/lib/utils/format'

export function ErrorPanel({ errors }: { errors: SessionError[] }) {
  if (errors.length === 0) return null

  return (
    <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
      <h3 className="text-sm font-semibold text-red-400">
        Errors ({errors.length})
      </h3>

      <div className="mt-3 space-y-2">
        {errors.map((error, i) => (
          <div key={i} className="rounded-lg bg-red-950/30 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-red-300">
                {error.type}
              </span>
              {error.timestamp && (
                <span className="text-xs text-gray-500">
                  {formatDateTime(error.timestamp)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-red-200/80">{error.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
