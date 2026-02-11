import * as path from 'node:path'
import * as fs from 'node:fs'
import { createServerFn } from '@tanstack/react-start'
import { getProjectsDir, decodeProjectDirName, extractProjectName } from '@/lib/utils/claude-path'
import { parseDetail, readSessionMessages } from '@/lib/parsers/session-parser'

export const getSessionDetail = createServerFn({ method: 'GET' })
  .inputValidator((input: { sessionId: string; projectPath: string }) => input)
  .handler(async ({ data }) => {
    const filePath = findSessionFile(data.sessionId, data.projectPath)
    if (!filePath) {
      throw new Error(`Session not found: ${data.sessionId}`)
    }

    const projectName = extractProjectName(data.projectPath)
    return parseDetail(filePath.path, data.sessionId, data.projectPath, projectName)
  })

export const getSessionMessages = createServerFn({ method: 'GET' })
  .inputValidator(
    (input: { sessionId: string; projectPath: string; offset: number; limit: number }) => input,
  )
  .handler(async ({ data }) => {
    const filePath = findSessionFile(data.sessionId, data.projectPath)
    if (!filePath) {
      throw new Error(`Session not found: ${data.sessionId}`)
    }

    return readSessionMessages(filePath.path, data.offset, data.limit)
  })

function findSessionFile(
  sessionId: string,
  projectPath: string,
): { path: string; dirName: string } | null {
  const projectsDir = getProjectsDir()

  // Try to find via projectPath
  let entries: string[]
  try {
    entries = fs.readdirSync(projectsDir)
  } catch {
    return null
  }

  for (const dirName of entries) {
    const decoded = decodeProjectDirName(dirName)
    if (decoded === projectPath || dirName === projectPath) {
      const filePath = path.join(projectsDir, dirName, `${sessionId}.jsonl`)
      if (fs.existsSync(filePath)) {
        return { path: filePath, dirName }
      }
    }
  }

  // Fallback: search all projects
  for (const dirName of entries) {
    const filePath = path.join(projectsDir, dirName, `${sessionId}.jsonl`)
    if (fs.existsSync(filePath)) {
      return { path: filePath, dirName }
    }
  }

  return null
}
