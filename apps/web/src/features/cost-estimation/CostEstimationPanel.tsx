import { Link } from '@tanstack/react-router'
import type { TokenUsage } from '@/lib/parsers/types'
import { formatUSD, formatTokenCount } from '@/lib/utils/format'
import { useSessionCost } from './useSessionCost'
import type { CostBreakdown } from './cost-estimation.types'

interface CostEstimationPanelProps {
  tokensByModel: Record<string, TokenUsage>
}

export function CostEstimationPanel({ tokensByModel }: CostEstimationPanelProps) {
  const { cost, isLoading } = useSessionCost(tokensByModel)

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-800" />
      </div>
    )
  }

  if (!cost || cost.totalUSD === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <h3 className="text-sm font-semibold text-gray-300">Cost Estimation</h3>
        <p className="mt-2 text-xs text-gray-500">No token data available</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Cost Estimation</h3>
        <span className="font-mono text-lg font-bold text-white">
          ~{formatUSD(cost.totalUSD)}
        </span>
      </div>

      {/* Category breakdown */}
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-400">By Category</p>
        <CategoryBreakdown cost={cost} />
        <CostBar cost={cost} />
      </div>

      {/* Model breakdown */}
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-400">By Model</p>
        <ModelBreakdown cost={cost} />
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-3">
        <p className="text-[10px] text-gray-600">
          Estimated based on API pricing. Actual costs may vary.
        </p>
        <Link
          to="/settings"
          className="text-[10px] text-gray-500 hover:text-gray-300"
        >
          Configure pricing
        </Link>
      </div>
    </div>
  )
}

function CategoryBreakdown({ cost }: { cost: CostBreakdown }) {
  const categories = [
    { label: 'Input tokens', value: cost.byCategory.input, color: 'text-blue-400' },
    { label: 'Output tokens', value: cost.byCategory.output, color: 'text-emerald-400' },
    { label: 'Cache read', value: cost.byCategory.cacheRead, color: 'text-amber-400' },
    { label: 'Cache write', value: cost.byCategory.cacheWrite, color: 'text-purple-400' },
  ]

  return (
    <div className="mt-2 space-y-1">
      {categories.map((cat) => (
        <div key={cat.label} className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{cat.label}</span>
          <span className={`font-mono text-xs ${cat.color}`}>
            {formatUSD(cat.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function CostBar({ cost }: { cost: CostBreakdown }) {
  if (cost.totalUSD === 0) return null

  const segments = [
    { key: 'input', value: cost.byCategory.input, color: 'bg-blue-400' },
    { key: 'output', value: cost.byCategory.output, color: 'bg-emerald-400' },
    { key: 'cacheRead', value: cost.byCategory.cacheRead, color: 'bg-amber-400' },
    { key: 'cacheWrite', value: cost.byCategory.cacheWrite, color: 'bg-purple-400' },
  ]

  return (
    <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-gray-800">
      {segments.map((seg) => {
        const pct = (seg.value / cost.totalUSD) * 100
        if (pct < 0.5) return null
        return (
          <div
            key={seg.key}
            className={`${seg.color} opacity-60`}
            style={{ width: `${pct}%` }}
          />
        )
      })}
    </div>
  )
}

function ModelBreakdown({ cost }: { cost: CostBreakdown }) {
  const models = Object.values(cost.byModel).sort(
    (a, b) => b.totalCost - a.totalCost,
  )

  if (models.length === 0) return null

  return (
    <div className="mt-2 space-y-1">
      {models.map((model) => {
        const pct =
          cost.totalUSD > 0
            ? Math.round((model.totalCost / cost.totalUSD) * 100)
            : 0
        return (
          <div key={model.modelId} className="flex items-center justify-between">
            <span className="font-mono text-xs text-gray-300">
              {model.displayName}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gray-300">
                {formatUSD(model.totalCost)}
              </span>
              <span className="text-[10px] text-gray-500">
                ({pct}%)
              </span>
              <span className="text-[10px] text-gray-600">
                {formatTokenCount(
                  model.tokens.inputTokens +
                    model.tokens.outputTokens +
                    model.tokens.cacheReadInputTokens +
                    model.tokens.cacheCreationInputTokens,
                )}{' '}
                tok
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
