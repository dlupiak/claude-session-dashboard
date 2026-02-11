import type { Turn } from '@/lib/parsers/types'
import { formatTokenCount } from '@/lib/utils/format'
import { format } from 'date-fns'

export function SessionTimeline({ turns }: { turns: Turn[] }) {
  // Only show user/assistant turns (skip system/progress noise)
  const meaningful = turns.filter(
    (t) => t.type === 'user' || t.type === 'assistant',
  )

  if (meaningful.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No conversation turns found
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {meaningful.map((turn, i) => (
        <TimelineTurn key={turn.uuid || i} turn={turn} />
      ))}
    </div>
  )
}

function TimelineTurn({ turn }: { turn: Turn }) {
  const isUser = turn.type === 'user'
  const time = turn.timestamp
    ? format(new Date(turn.timestamp), 'HH:mm:ss')
    : ''

  return (
    <div
      className={`flex gap-3 rounded-lg p-2.5 ${
        isUser ? 'bg-blue-950/20' : 'bg-gray-900/40'
      }`}
    >
      <div className="flex w-14 shrink-0 flex-col items-center">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
            isUser
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-purple-500/20 text-purple-400'
          }`}
        >
          {isUser ? 'user' : 'AI'}
        </span>
        <span className="mt-1 text-[10px] text-gray-600">{time}</span>
      </div>

      <div className="min-w-0 flex-1">
        {turn.message && (
          <p className="whitespace-pre-wrap text-xs text-gray-300 line-clamp-4">
            {turn.message}
          </p>
        )}

        {turn.toolCalls.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {turn.toolCalls.map((tc, j) => (
              <span
                key={j}
                className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400"
              >
                {tc.toolName}
              </span>
            ))}
          </div>
        )}

        {turn.tokens && (
          <span className="mt-1 inline-block text-[10px] text-gray-600">
            {formatTokenCount(turn.tokens.inputTokens + turn.tokens.outputTokens)} tokens
            {turn.model && (
              <span className="ml-1 text-gray-700">
                ({turn.model.replace(/^claude-/, '').split('-202')[0]})
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}
