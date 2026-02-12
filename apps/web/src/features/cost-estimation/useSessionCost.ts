import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { TokenUsage } from '@/lib/parsers/types'
import { settingsQuery } from '@/features/settings/settings.queries'
import { calculateSessionCost, getMergedPricing } from './cost-calculator'
import type { CostBreakdown } from './cost-estimation.types'

export function useSessionCost(tokensByModel: Record<string, TokenUsage>): {
  cost: CostBreakdown | null
  isLoading: boolean
} {
  const { data: settings, isLoading } = useQuery(settingsQuery)

  const cost = useMemo(() => {
    if (!settings) return null
    if (Object.keys(tokensByModel).length === 0) return null

    const pricingTable = getMergedPricing(settings)
    return calculateSessionCost(tokensByModel, pricingTable)
  }, [settings, tokensByModel])

  return { cost, isLoading }
}
