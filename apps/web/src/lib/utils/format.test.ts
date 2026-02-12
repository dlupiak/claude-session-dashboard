import { describe, it, expect } from 'vitest'
import { formatUSD } from './format'

describe('formatUSD', () => {
  it('formats small amounts as <$0.01', () => {
    expect(formatUSD(0.001)).toBe('<$0.01')
    expect(formatUSD(0.004)).toBe('<$0.01')
    expect(formatUSD(0.0049)).toBe('<$0.01')
  })

  it('formats normal amounts with 2 decimals', () => {
    expect(formatUSD(0.01)).toBe('$0.01')
    expect(formatUSD(0.5)).toBe('$0.50')
    expect(formatUSD(1.23)).toBe('$1.23')
    expect(formatUSD(10.5)).toBe('$10.50')
    expect(formatUSD(99.99)).toBe('$99.99')
  })

  it('formats zero as <$0.01', () => {
    // Zero is less than 0.005, so it shows as <$0.01
    expect(formatUSD(0)).toBe('<$0.01')
    expect(formatUSD(0.0)).toBe('<$0.01')
  })

  it('formats large amounts (≥100) without decimals', () => {
    expect(formatUSD(100)).toBe('$100')
    expect(formatUSD(100.5)).toBe('$101')
    expect(formatUSD(150.75)).toBe('$151')
    expect(formatUSD(999.99)).toBe('$1000')
    expect(formatUSD(1234.56)).toBe('$1235')
  })

  it('handles edge case at boundary (exactly $0.005)', () => {
    // 0.005 rounds to 0.01 in toFixed(2), so should show $0.01
    expect(formatUSD(0.005)).toBe('$0.01')
  })

  it('handles NaN as $0.00', () => {
    expect(formatUSD(NaN)).toBe('$0.00')
  })

  it('handles Infinity as $0.00', () => {
    expect(formatUSD(Infinity)).toBe('$0.00')
    expect(formatUSD(-Infinity)).toBe('$0.00')
  })

  it('handles negative amounts', () => {
    // Negative amounts are less than 0.005, so they show as <$0.01
    expect(formatUSD(-0.001)).toBe('<$0.01')
    expect(formatUSD(-1.23)).toBe('<$0.01')
    expect(formatUSD(-100)).toBe('<$0.01')
  })

  it('handles very large amounts', () => {
    expect(formatUSD(1_000_000)).toBe('$1000000')
    expect(formatUSD(1_234_567.89)).toBe('$1234568')
  })

  it('handles very small positive amounts', () => {
    expect(formatUSD(0.00001)).toBe('<$0.01')
    expect(formatUSD(0.0000001)).toBe('<$0.01')
  })

  it('rounds correctly at boundaries', () => {
    // Just below $100
    expect(formatUSD(99.994)).toBe('$99.99')
    expect(formatUSD(99.995)).toBe('$100.00') // Rounds up in toFixed(2)

    // Just at $100
    expect(formatUSD(99.999)).toBe('$100.00')

    // Above $100
    expect(formatUSD(100.001)).toBe('$100')
    expect(formatUSD(100.499)).toBe('$100')
    expect(formatUSD(100.5)).toBe('$101')
  })
})
