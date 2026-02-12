import { describe, it, expect } from 'vitest'

/**
 * Build an array of page numbers with ellipsis gaps.
 * Shows first page, last page, and 2 pages around current.
 * Example for page 6 of 20: [1, 'ellipsis', 4, 5, 6, 7, 8, 'ellipsis', 20]
 */
function buildPageNumbers(
  current: number,
  total: number,
): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = new Set<number>()

  // Always include first and last
  pages.add(1)
  pages.add(total)

  // Include 2 pages around current
  for (let i = current - 2; i <= current + 2; i++) {
    if (i >= 1 && i <= total) {
      pages.add(i)
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: Array<number | 'ellipsis'> = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis')
    }
    result.push(sorted[i])
  }

  return result
}

describe('buildPageNumbers', () => {
  describe('small page ranges (7 or fewer pages)', () => {
    it('should return all pages for 1 page', () => {
      expect(buildPageNumbers(1, 1)).toEqual([1])
    })

    it('should return all pages for 2 pages', () => {
      expect(buildPageNumbers(1, 2)).toEqual([1, 2])
    })

    it('should return all pages for 7 pages', () => {
      expect(buildPageNumbers(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    it('should return all pages regardless of current page', () => {
      expect(buildPageNumbers(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
      expect(buildPageNumbers(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
    })
  })

  describe('large page ranges (8+ pages)', () => {
    it('should show ellipsis when current is near start', () => {
      // Page 1 of 20: [1, 2, 3, ..., 20]
      expect(buildPageNumbers(1, 20)).toEqual([
        1,
        2,
        3,
        'ellipsis',
        20,
      ])
    })

    it('should show ellipsis when current is near end', () => {
      // Page 20 of 20: [1, ..., 18, 19, 20]
      expect(buildPageNumbers(20, 20)).toEqual([
        1,
        'ellipsis',
        18,
        19,
        20,
      ])
    })

    it('should show ellipsis on both sides when current is in middle', () => {
      // Page 10 of 20: [1, ..., 8, 9, 10, 11, 12, ..., 20]
      expect(buildPageNumbers(10, 20)).toEqual([
        1,
        'ellipsis',
        8,
        9,
        10,
        11,
        12,
        'ellipsis',
        20,
      ])
    })

    it('should handle page 6 of 20 (example from docstring)', () => {
      expect(buildPageNumbers(6, 20)).toEqual([
        1,
        'ellipsis',
        4,
        5,
        6,
        7,
        8,
        'ellipsis',
        20,
      ])
    })

    it('should not show ellipsis when current is close to start', () => {
      // Page 3 of 20: [1, 2, 3, 4, 5, ..., 20]
      expect(buildPageNumbers(3, 20)).toEqual([
        1,
        2,
        3,
        4,
        5,
        'ellipsis',
        20,
      ])
    })

    it('should not show ellipsis when current is close to end', () => {
      // Page 18 of 20: [1, ..., 16, 17, 18, 19, 20]
      expect(buildPageNumbers(18, 20)).toEqual([
        1,
        'ellipsis',
        16,
        17,
        18,
        19,
        20,
      ])
    })
  })

  describe('boundary cases', () => {
    it('should handle page 1 of 8', () => {
      expect(buildPageNumbers(1, 8)).toEqual([
        1,
        2,
        3,
        'ellipsis',
        8,
      ])
    })

    it('should handle page 8 of 8', () => {
      expect(buildPageNumbers(8, 8)).toEqual([
        1,
        'ellipsis',
        6,
        7,
        8,
      ])
    })

    it('should handle page 4 of 8', () => {
      expect(buildPageNumbers(4, 8)).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
        'ellipsis',
        8,
      ])
    })

    it('should handle page 5 of 8', () => {
      expect(buildPageNumbers(5, 8)).toEqual([
        1,
        'ellipsis',
        3,
        4,
        5,
        6,
        7,
        8,
      ])
    })
  })

  describe('edge cases', () => {
    it('should handle page 2 showing no leading ellipsis', () => {
      // Page 2 of 10: [1, 2, 3, 4, ..., 10]
      expect(buildPageNumbers(2, 10)).toEqual([
        1,
        2,
        3,
        4,
        'ellipsis',
        10,
      ])
    })

    it('should handle second-to-last page showing no trailing ellipsis', () => {
      // Page 9 of 10: [1, ..., 7, 8, 9, 10]
      expect(buildPageNumbers(9, 10)).toEqual([
        1,
        'ellipsis',
        7,
        8,
        9,
        10,
      ])
    })

    it('should handle very large page ranges', () => {
      // Page 50 of 100
      expect(buildPageNumbers(50, 100)).toEqual([
        1,
        'ellipsis',
        48,
        49,
        50,
        51,
        52,
        'ellipsis',
        100,
      ])
    })

    it('should always include first and last page', () => {
      const result = buildPageNumbers(15, 30)
      expect(result[0]).toBe(1)
      expect(result[result.length - 1]).toBe(30)
    })

    it('should always include current page', () => {
      const current = 12
      const result = buildPageNumbers(current, 25)
      expect(result).toContain(current)
    })

    it('should include 2 pages before and after current', () => {
      const current = 15
      const result = buildPageNumbers(current, 30)
      expect(result).toContain(current - 2)
      expect(result).toContain(current - 1)
      expect(result).toContain(current)
      expect(result).toContain(current + 1)
      expect(result).toContain(current + 2)
    })
  })

  describe('ellipsis placement', () => {
    it('should not have consecutive ellipsis', () => {
      const testCases = [
        { current: 1, total: 20 },
        { current: 10, total: 20 },
        { current: 20, total: 20 },
        { current: 5, total: 15 },
        { current: 50, total: 100 },
      ]

      for (const { current, total } of testCases) {
        const result = buildPageNumbers(current, total)
        for (let i = 0; i < result.length - 1; i++) {
          if (result[i] === 'ellipsis') {
            expect(result[i + 1]).not.toBe('ellipsis')
          }
        }
      }
    })

    it('should have ellipsis between non-consecutive numbers', () => {
      const result = buildPageNumbers(10, 20)
      const ellipsisIndices = result.reduce((acc, item, i) => {
        if (item === 'ellipsis') acc.push(i)
        return acc
      }, [] as number[])

      for (const idx of ellipsisIndices) {
        const before = result[idx - 1] as number
        const after = result[idx + 1] as number
        expect(after - before).toBeGreaterThan(1)
      }
    })
  })

  describe('consistency', () => {
    it('should always return at least 1 page number', () => {
      const result = buildPageNumbers(1, 1)
      const numbers = result.filter((x) => typeof x === 'number')
      expect(numbers.length).toBeGreaterThanOrEqual(1)
    })

    it('should return numbers in ascending order', () => {
      const testCases = [
        { current: 1, total: 20 },
        { current: 10, total: 20 },
        { current: 20, total: 20 },
      ]

      for (const { current, total } of testCases) {
        const result = buildPageNumbers(current, total)
        const numbers = result.filter((x) => typeof x === 'number') as number[]
        for (let i = 0; i < numbers.length - 1; i++) {
          expect(numbers[i + 1]).toBeGreaterThan(numbers[i])
        }
      }
    })

    it('should not include duplicates', () => {
      const testCases = [
        { current: 1, total: 20 },
        { current: 10, total: 20 },
        { current: 20, total: 20 },
      ]

      for (const { current, total } of testCases) {
        const result = buildPageNumbers(current, total)
        const numbers = result.filter((x) => typeof x === 'number') as number[]
        const unique = new Set(numbers)
        expect(unique.size).toBe(numbers.length)
      }
    })

    it('should only include pages within valid range', () => {
      const testCases = [
        { current: 1, total: 20 },
        { current: 10, total: 20 },
        { current: 20, total: 20 },
      ]

      for (const { current, total } of testCases) {
        const result = buildPageNumbers(current, total)
        const numbers = result.filter((x) => typeof x === 'number') as number[]
        for (const num of numbers) {
          expect(num).toBeGreaterThanOrEqual(1)
          expect(num).toBeLessThanOrEqual(total)
        }
      }
    })
  })
})
