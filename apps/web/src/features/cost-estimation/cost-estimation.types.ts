import type { TokenUsage } from '@/lib/parsers/types'

export interface ModelCostBreakdown {
  modelId: string
  displayName: string
  inputCost: number
  outputCost: number
  cacheReadCost: number
  cacheWriteCost: number
  totalCost: number
  tokens: TokenUsage
}

export interface CategoryCosts {
  input: number
  output: number
  cacheRead: number
  cacheWrite: number
}

export interface CostBreakdown {
  totalUSD: number
  byModel: Record<string, ModelCostBreakdown>
  byCategory: CategoryCosts
}
