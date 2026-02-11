import type { TokenUsage } from '@/lib/parsers/types'
import { formatTokenCount } from '@/lib/utils/format'

export function TokenSummary({ tokens }: { tokens: TokenUsage }) {
  const total =
    tokens.inputTokens +
    tokens.outputTokens +
    tokens.cacheReadInputTokens +
    tokens.cacheCreationInputTokens

  const items = [
    { label: 'Input', value: tokens.inputTokens, color: 'text-blue-400' },
    { label: 'Output', value: tokens.outputTokens, color: 'text-emerald-400' },
    {
      label: 'Cache Read',
      value: tokens.cacheReadInputTokens,
      color: 'text-amber-400',
    },
    {
      label: 'Cache Create',
      value: tokens.cacheCreationInputTokens,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h3 className="text-sm font-semibold text-gray-300">Token Usage</h3>
      <p className="mt-1 text-2xl font-bold text-white">
        {formatTokenCount(total)}
      </p>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{item.label}</span>
            <span className={`text-xs font-mono ${item.color}`}>
              {formatTokenCount(item.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Visual bar */}
      {total > 0 && (
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-800">
          {items
            .filter((i) => i.value > 0)
            .map((item) => (
              <div
                key={item.label}
                className={`${item.color.replace('text-', 'bg-')} opacity-60`}
                style={{ width: `${(item.value / total) * 100}%` }}
              />
            ))}
        </div>
      )}
    </div>
  )
}
