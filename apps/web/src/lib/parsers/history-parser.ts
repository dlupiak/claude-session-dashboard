import * as fs from 'node:fs'
import * as readline from 'node:readline'
import { getHistoryPath } from '../utils/claude-path'
import type { HistoryEntry } from './types'

/**
 * Stream-parse history.jsonl and return entries (most recent first).
 * Optionally limit to last N entries.
 */
export async function parseHistory(limit?: number): Promise<HistoryEntry[]> {
  const historyPath = getHistoryPath()

  const stat = await fs.promises.stat(historyPath).catch(() => null)
  if (!stat) return []

  const entries: HistoryEntry[] = []

  const stream = fs.createReadStream(historyPath, { encoding: 'utf-8' })
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line) as HistoryEntry
      if (entry.display && entry.timestamp && entry.sessionId) {
        entries.push(entry)
      }
    } catch {
      // Skip malformed lines
    }
  }

  // Sort by timestamp descending (most recent first)
  entries.sort((a, b) => b.timestamp - a.timestamp)

  return limit ? entries.slice(0, limit) : entries
}
