import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sessionMessagesQuery } from './session-detail.queries'

const PAGE_SIZE = 50

export function RawLogViewer({
  sessionId,
  projectPath,
}: {
  sessionId: string
  projectPath: string
}) {
  const [page, setPage] = useState(0)
  const offset = page * PAGE_SIZE

  const { data, isLoading } = useQuery(
    sessionMessagesQuery(sessionId, projectPath, offset, PAGE_SIZE),
  )

  const messages = data?.messages ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Raw Log</h3>
        <span className="text-xs text-gray-500">{total} messages</span>
      </div>

      {isLoading ? (
        <div className="mt-3 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 animate-pulse rounded bg-gray-800"
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 max-h-96 space-y-1 overflow-auto font-mono text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="rounded bg-gray-950/50 p-2 text-gray-400"
            >
              <span
                className={`mr-2 font-semibold ${
                  msg.type === 'user'
                    ? 'text-blue-400'
                    : msg.type === 'assistant'
                      ? 'text-purple-400'
                      : msg.type === 'system'
                        ? 'text-amber-400'
                        : 'text-gray-500'
                }`}
              >
                [{msg.type}]
              </span>
              <span className="text-gray-600">
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString()
                  : ''}
              </span>
              {msg.uuid && (
                <span className="ml-2 text-gray-700">
                  {msg.uuid.slice(0, 8)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded bg-gray-800 px-3 py-1 text-xs text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded bg-gray-800 px-3 py-1 text-xs text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
