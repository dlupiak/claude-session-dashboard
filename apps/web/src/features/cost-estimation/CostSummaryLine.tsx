import type { TokenUsage } from '@/lib/parsers/types'
import { formatUSD } from '@/lib/utils/format'
import { useSessionCost } from './useSessionCost'

interface CostSummaryLineProps {
  tokensByModel: Record<string, TokenUsage>
}

export function CostSummaryLine({ tokensByModel }: CostSummaryLineProps) {
  const { cost, isLoading } = useSessionCost(tokensByModel)

  if (isLoading || !cost || cost.totalUSD === 0) return null

  return (
    <span
      className="font-mono text-xs text-emerald-400"
      title="Estimated cost based on API pricing"
    >
      ~{formatUSD(cost.totalUSD)}
    </span>
  )
}
