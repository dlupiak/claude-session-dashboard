import * as fs from 'node:fs'
import { getStatsPath } from '../utils/claude-path'
import { StatsCacheSchema, type StatsCache } from './types'

let cachedStats: { mtimeMs: number; data: StatsCache } | null = null

export async function parseStats(): Promise<StatsCache | null> {
  const statsPath = getStatsPath()

  const stat = await fs.promises.stat(statsPath).catch(() => null)
  if (!stat) return null

  // Return cached if mtime unchanged
  if (cachedStats && cachedStats.mtimeMs === stat.mtimeMs) {
    return cachedStats.data
  }

  const raw = await fs.promises.readFile(statsPath, 'utf-8')
  const parsed = JSON.parse(raw)
  const result = StatsCacheSchema.parse(parsed)

  cachedStats = { mtimeMs: stat.mtimeMs, data: result }
  return result
}
