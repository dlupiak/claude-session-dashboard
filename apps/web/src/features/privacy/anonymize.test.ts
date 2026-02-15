import { describe, it, expect } from 'vitest'
import { anonymizePath } from './anonymize'

describe('anonymizePath', () => {
  describe('without anonymizedProjectName parameter', () => {
    it('should anonymize macOS user path', () => {
      expect(anonymizePath('/Users/john/projects/foo')).toBe('/Users/user/projects/foo')
    })

    it('should anonymize Linux user path', () => {
      expect(anonymizePath('/home/dev/.config')).toBe('/home/user/.config')
    })

    it('should preserve non-user paths unchanged', () => {
      expect(anonymizePath('/var/log/app')).toBe('/var/log/app')
      expect(anonymizePath('/etc/config')).toBe('/etc/config')
      expect(anonymizePath('/tmp/file.txt')).toBe('/tmp/file.txt')
    })

    it('should handle paths with multiple segments after username', () => {
      expect(anonymizePath('/Users/alice/Documents/work/project/src')).toBe(
        '/Users/user/Documents/work/project/src'
      )
      expect(anonymizePath('/home/bob/.local/share/app/data')).toBe(
        '/home/user/.local/share/app/data'
      )
    })

    it('should handle username with special characters', () => {
      expect(anonymizePath('/Users/john.doe/project')).toBe('/Users/user/project')
      expect(anonymizePath('/home/dev-user/project')).toBe('/home/user/project')
    })

    it('should only replace the first occurrence of username pattern', () => {
      expect(anonymizePath('/Users/john/Users/other/file')).toBe('/Users/user/Users/other/file')
    })

    it('should handle edge case of username at path end', () => {
      expect(anonymizePath('/Users/john')).toBe('/Users/user')
      expect(anonymizePath('/home/dev')).toBe('/home/user')
    })

    it('should handle empty string', () => {
      expect(anonymizePath('')).toBe('')
    })

    it('should handle paths without slashes', () => {
      expect(anonymizePath('relative-path')).toBe('relative-path')
    })
  })

  describe('with anonymizedProjectName parameter', () => {
    it('should return shortened path format when anonymizedProjectName is provided', () => {
      expect(anonymizePath('/Users/john/projects/foo', 'project-1')).toBe('.../project-1')
    })

    it('should use anonymizedProjectName regardless of actual path', () => {
      expect(anonymizePath('/Users/john/Documents/work', 'project-2')).toBe('.../project-2')
      expect(anonymizePath('/home/dev/.config', 'project-3')).toBe('.../project-3')
      expect(anonymizePath('/var/log/app', 'project-4')).toBe('.../project-4')
    })

    it('should handle anonymizedProjectName with special characters', () => {
      expect(anonymizePath('/Users/john/project', 'project-1')).toBe('.../project-1')
      expect(anonymizePath('/Users/john/project', 'my-special-project')).toBe('.../my-special-project')
    })

    it('should work with empty path', () => {
      expect(anonymizePath('', 'project-1')).toBe('.../project-1')
    })

    it('should ignore username anonymization when anonymizedProjectName is provided', () => {
      // Path structure doesn't matter at all when anonymizedProjectName is provided
      expect(anonymizePath('/Users/john/projects/foo', 'project-1')).toBe('.../project-1')
      expect(anonymizePath('/this/does/not/matter', 'project-1')).toBe('.../project-1')
    })
  })

  describe('parameter precedence', () => {
    it('should prioritize anonymizedProjectName over username anonymization', () => {
      const path = '/Users/john/projects/my-project'
      const withoutProjectName = anonymizePath(path)
      const withProjectName = anonymizePath(path, 'project-1')

      expect(withoutProjectName).toBe('/Users/user/projects/my-project')
      expect(withProjectName).toBe('.../project-1')
      expect(withProjectName).not.toBe(withoutProjectName)
    })

    it('should handle undefined anonymizedProjectName as omitted', () => {
      expect(anonymizePath('/Users/john/project', undefined)).toBe('/Users/user/project')
    })
  })
})
