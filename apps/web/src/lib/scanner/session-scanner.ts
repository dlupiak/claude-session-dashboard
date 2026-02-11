import * as fs from 'node:fs'
import * as path from 'node:path'
import { getProjectsDir, extractSessionId } from '../utils/claude-path'
import { scanProjects } from './project-scanner'
import { isSessionActive } from './active-detector'
import { parseSummary } from '../parsers/session-parser'
import type { SessionSummary } from '../parsers/types'

// In-memory cache: sessionId -> { mtime, summary }
const summaryCache = new Map<
  string,
  { mtimeMs: number; summary: SessionSummary }
>()

export async function scanAllSessions(): Promise<SessionSummary[]> {
  const projects = await scanProjects()
  const summaries: SessionSummary[] = []

  for (const project of projects) {
    for (const file of project.sessionFiles) {
      const sessionId = extractSessionId(file)
      const filePath = path.join(
        getProjectsDir(),
        project.dirName,
        file,
      )

      const stat = await fs.promises.stat(filePath).catch(() => null)
      if (!stat) continue

      // Check cache
      const cached = summaryCache.get(sessionId)
      if (cached && cached.mtimeMs === stat.mtimeMs) {
        // Refresh active status even for cached entries
        const active = await isSessionActive(project.dirName, sessionId)
        summaries.push({ ...cached.summary, isActive: active })
        continue
      }

      // Parse summary from first/last lines
      const summary = await parseSummary(
        filePath,
        sessionId,
        project.decodedPath,
        project.projectName,
        stat.size,
      )

      if (summary) {
        const active = await isSessionActive(project.dirName, sessionId)
        summary.isActive = active

        summaryCache.set(sessionId, {
          mtimeMs: stat.mtimeMs,
          summary,
        })
        summaries.push(summary)
      }
    }
  }

  // Sort by last active, newest first
  summaries.sort(
    (a, b) =>
      new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime(),
  )

  return summaries
}

export async function getActiveSessions(): Promise<SessionSummary[]> {
  const all = await scanAllSessions()
  return all.filter((s) => s.isActive)
}
