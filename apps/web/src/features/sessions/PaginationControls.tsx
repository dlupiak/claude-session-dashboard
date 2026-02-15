import { VALID_SIZES } from './usePageSizePreference'

interface PaginationControlsProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function PaginationControls({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  if (totalCount === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  const showNavigation = totalPages > 1
  const pageNumbers = showNavigation ? buildPageNumbers(page, totalPages) : []

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-3">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-gray-700 bg-gray-800/50 px-2 py-1 text-xs text-gray-200 outline-none focus:border-brand-500"
        >
          {VALID_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        <p className="text-xs text-gray-400">
          Showing{' '}
          <span className="font-mono text-gray-300">
            {start}-{end}
          </span>{' '}
          of{' '}
          <span className="font-mono text-gray-300">{totalCount}</span> sessions
        </p>
      </div>

      {showNavigation && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-800 disabled:hover:text-gray-400"
          >
            Previous
          </button>

          {pageNumbers.map((item, i) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${i}`}
                className="px-1.5 text-xs text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`min-w-[2rem] rounded-lg px-2 py-1.5 text-xs font-mono transition-colors ${
                  item === page
                    ? 'bg-brand-600 text-white'
                    : 'border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-800 disabled:hover:text-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

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
