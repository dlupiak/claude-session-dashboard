import { formatDistanceToNow, format } from 'date-fns'

export function formatDuration(ms: number): string {
  if (ms < 1000) return '<1s'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    const remainingMin = minutes % 60
    return remainingMin > 0 ? `${hours}h ${remainingMin}m` : `${hours}h`
  }
  if (minutes > 0) {
    const remainingSec = seconds % 60
    return remainingSec > 0 ? `${minutes}m ${remainingSec}s` : `${minutes}m`
  }
  return `${seconds}s`
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy HH:mm')
}

export function formatTokenCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`
  }
  return count.toString()
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) {
    return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  }
  if (bytes >= 1_048_576) {
    return `${(bytes / 1_048_576).toFixed(1)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${bytes} B`
}

export function formatUSD(amount: number): string {
  if (!Number.isFinite(amount)) return '$0.00'
  if (amount < 0.005) return '<$0.01'
  if (amount >= 100) return `$${Math.round(amount)}`
  return `$${amount.toFixed(2)}`
}
