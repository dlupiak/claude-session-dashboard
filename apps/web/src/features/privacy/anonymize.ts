/**
 * Pure utility functions for anonymizing paths and project names.
 * All anonymization is display-only — no server data is modified.
 */

const OS_USERNAME_PATTERN = /^(\/(?:Users|home))\/[^/]+/

/**
 * Detects the OS username segment in a path and replaces it with a generic placeholder.
 * Preserves everything after the username segment.
 *
 * When `anonymizedProjectName` is provided, returns `.../<anonymizedProjectName>`
 * instead of the full path, fully hiding the directory structure.
 *
 * Examples:
 *   anonymizePath("/Users/john/projects/foo")          -> "/Users/user/projects/foo"
 *   anonymizePath("/home/dev/.config")                 -> "/home/user/.config"
 *   anonymizePath("/var/log/app")                      -> "/var/log/app"  (unchanged)
 *   anonymizePath("/Users/john/projects/foo", "project-1") -> ".../<project-1>"
 */
export function anonymizePath(path: string, anonymizedProjectName?: string): string {
  if (anonymizedProjectName) {
    return `.../${anonymizedProjectName}`
  }
  return path.replace(OS_USERNAME_PATTERN, '$1/user')
}

