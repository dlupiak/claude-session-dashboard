import type { TokenUsage } from '@/lib/parsers/types'
import type { ModelPricing, Settings } from '@/features/settings/settings.types'
import { DEFAULT_PRICING, normalizeModelId } from '@/features/settings/settings.types'
import type { CostBreakdown, ModelCostBreakdown, CategoryCosts } from './cost-estimation.types'

/** Build a complete pricing lookup from defaults + user overrides. */
export function getMergedPricing(settings: Settings): Record<string, ModelPricing> {
  const table: Record<string, ModelPricing> = {}

  for (const model of DEFAULT_PRICING) {
    const override = settings.pricingOverrides[model.modelId]
    table[model.modelId] = override
      ? { ...model, ...override }
      : { ...model }
  }

  return table
}

/** The fallback model used when a raw model ID cannot be matched. */
const FALLBACK_MODEL_ID = 'claude-sonnet-4'

/**
 * Calculate estimated USD cost for a session based on per-model token usage and pricing.
 *
 * Model IDs from JSONL files include date suffixes (e.g. claude-sonnet-4-20250514).
 * This function normalizes them to match the pricing table.
 */
export function calculateSessionCost(
  tokensByModel: Record<string, TokenUsage>,
  pricingTable: Record<string, ModelPricing>,
): CostBreakdown {
  const byModel: Record<string, ModelCostBreakdown> = {}
  const byCategory: CategoryCosts = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
  }

  for (const [rawModelId, tokens] of Object.entries(tokensByModel)) {
    const normalized = normalizeModelId(rawModelId)
    const pricing = pricingTable[normalized] ?? pricingTable[FALLBACK_MODEL_ID]

    if (!pricing) continue

    const inputCost = (tokens.inputTokens / 1_000_000) * pricing.inputPerMTok
    const outputCost = (tokens.outputTokens / 1_000_000) * pricing.outputPerMTok
    const cacheReadCost =
      (tokens.cacheReadInputTokens / 1_000_000) * pricing.cacheReadPerMTok
    const cacheWriteCost =
      (tokens.cacheCreationInputTokens / 1_000_000) * pricing.cacheWritePerMTok
    const totalCost = inputCost + outputCost + cacheReadCost + cacheWriteCost

    // If the same normalized model appears under different raw IDs, accumulate
    const existing = byModel[normalized]
    if (existing) {
      existing.inputCost += inputCost
      existing.outputCost += outputCost
      existing.cacheReadCost += cacheReadCost
      existing.cacheWriteCost += cacheWriteCost
      existing.totalCost += totalCost
      existing.tokens.inputTokens += tokens.inputTokens
      existing.tokens.outputTokens += tokens.outputTokens
      existing.tokens.cacheReadInputTokens += tokens.cacheReadInputTokens
      existing.tokens.cacheCreationInputTokens += tokens.cacheCreationInputTokens
    } else {
      byModel[normalized] = {
        modelId: normalized,
        displayName: pricing.displayName,
        inputCost,
        outputCost,
        cacheReadCost,
        cacheWriteCost,
        totalCost,
        tokens: { ...tokens },
      }
    }

    byCategory.input += inputCost
    byCategory.output += outputCost
    byCategory.cacheRead += cacheReadCost
    byCategory.cacheWrite += cacheWriteCost
  }

  const totalUSD =
    byCategory.input + byCategory.output + byCategory.cacheRead + byCategory.cacheWrite

  return { totalUSD, byModel, byCategory }
}
