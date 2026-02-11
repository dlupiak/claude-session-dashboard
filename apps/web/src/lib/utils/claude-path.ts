import * as path from 'node:path'
import * as os from 'node:os'

const CLAUDE_DIR = path.join(os.homedir(), '.claude')

export function getClaudeDir(): string {
  return CLAUDE_DIR
}

export function getProjectsDir(): string {
  return path.join(CLAUDE_DIR, 'projects')
}

export function getStatsPath(): string {
  return path.join(CLAUDE_DIR, 'stats-cache.json')
}

export function getHistoryPath(): string {
  return path.join(CLAUDE_DIR, 'history.jsonl')
}

/**
 * Decode a project directory name back to a filesystem path.
 * ~/.claude/projects stores dirs like "-Users-dmytro-Documents-GitHub-foo"
 * which maps to "/Users/dmytro/Documents/GitHub/foo"
 */
export function decodeProjectDirName(dirName: string): string {
  // Replace leading dash with / and all other dashes with /
  return dirName.replace(/^-/, '/').replace(/-/g, '/')
}

/**
 * Extract a short project name from a decoded path.
 * "/Users/dmytro/Documents/GitHub/myproject" -> "myproject"
 */
export function extractProjectName(decodedPath: string): string {
  return path.basename(decodedPath)
}

/**
 * Extract session ID from a JSONL filename.
 * "abc-123.jsonl" -> "abc-123"
 */
export function extractSessionId(filename: string): string {
  return filename.replace(/\.jsonl$/, '')
}
