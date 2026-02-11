import * as fs from 'node:fs'
import * as path from 'node:path'
import { getProjectsDir, decodeProjectDirName, extractProjectName } from '../utils/claude-path'

export interface ProjectInfo {
  dirName: string
  decodedPath: string
  projectName: string
  sessionFiles: string[]
}

export async function scanProjects(): Promise<ProjectInfo[]> {
  const projectsDir = getProjectsDir()

  let entries: string[]
  try {
    entries = await fs.promises.readdir(projectsDir)
  } catch {
    return []
  }

  const projects: ProjectInfo[] = []

  for (const dirName of entries) {
    const dirPath = path.join(projectsDir, dirName)
    const stat = await fs.promises.stat(dirPath).catch(() => null)
    if (!stat?.isDirectory()) continue

    const files = await fs.promises.readdir(dirPath).catch(() => [] as string[])
    const sessionFiles = files.filter((f) => f.endsWith('.jsonl'))

    if (sessionFiles.length === 0) continue

    const decodedPath = decodeProjectDirName(dirName)
    projects.push({
      dirName,
      decodedPath,
      projectName: extractProjectName(decodedPath),
      sessionFiles,
    })
  }

  return projects
}
