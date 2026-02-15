import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PrivacyProvider, usePrivacy } from './PrivacyContext'

// Test component that exposes privacy context values
function TestComponent({ onRender }: { onRender?: (state: unknown) => void }) {
  const {
    privacyMode,
    togglePrivacyMode,
    anonymizePath,
    anonymizeProjectName,
    anonymizeBranch,
  } = usePrivacy()

  if (onRender) {
    onRender({
      privacyMode,
      togglePrivacyMode,
      anonymizePath,
      anonymizeProjectName,
      anonymizeBranch,
    })
  }

  return (
    <div>
      <div data-testid="privacy-mode">{String(privacyMode)}</div>
      <button data-testid="toggle-privacy" onClick={togglePrivacyMode}>
        Toggle
      </button>
      <div data-testid="test-path">
        {anonymizePath('/Users/john/projects/foo')}
      </div>
      <div data-testid="test-path-with-project">
        {anonymizePath('/Users/john/projects/foo', 'my-project')}
      </div>
      <div data-testid="test-project-1">
        {anonymizeProjectName('my-project')}
      </div>
      <div data-testid="test-project-2">
        {anonymizeProjectName('other-project')}
      </div>
      <div data-testid="test-project-1-again">
        {anonymizeProjectName('my-project')}
      </div>
      <div data-testid="test-branch-1">
        {anonymizeBranch('feature/HEATMAP-123')}
      </div>
      <div data-testid="test-branch-2">
        {anonymizeBranch('main')}
      </div>
      <div data-testid="test-branch-1-again">
        {anonymizeBranch('feature/HEATMAP-123')}
      </div>
    </div>
  )
}

describe('PrivacyContext', () => {
  beforeEach(() => {
    // localStorage is cleared in setup.ts
  })

  describe('initial state', () => {
    it('should initialize with privacyMode false when localStorage is empty', () => {
      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('privacy-mode').textContent).toBe('false')
    })

    it('should initialize with privacyMode true when localStorage has "true"', () => {
      localStorage.setItem('claude-dashboard:privacy-mode', 'true')

      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('privacy-mode').textContent).toBe('true')
    })

    it('should initialize with privacyMode false when localStorage has "false"', () => {
      localStorage.setItem('claude-dashboard:privacy-mode', 'false')

      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('privacy-mode').textContent).toBe('false')
    })

    it('should initialize with privacyMode false when localStorage has invalid value', () => {
      localStorage.setItem('claude-dashboard:privacy-mode', 'invalid')

      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('privacy-mode').textContent).toBe('false')
    })
  })

  describe('togglePrivacyMode', () => {
    it('should toggle from false to true', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(getByTestId('privacy-mode').textContent).toBe('false')

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('privacy-mode').textContent).toBe('true')
        expect(localStorage.getItem('claude-dashboard:privacy-mode')).toBe('true')
      })
    })

    it('should toggle from true to false', async () => {
      localStorage.setItem('claude-dashboard:privacy-mode', 'true')

      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(getByTestId('privacy-mode').textContent).toBe('true')

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('privacy-mode').textContent).toBe('false')
        expect(localStorage.getItem('claude-dashboard:privacy-mode')).toBe('false')
      })
    })

    it('should toggle multiple times correctly', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      for (let i = 0; i < 4; i++) {
        const expectedValue = i % 2 === 0 ? 'true' : 'false'
        getByTestId('toggle-privacy').click()

        await waitFor(() => {
          expect(getByTestId('privacy-mode').textContent).toBe(expectedValue)
          expect(localStorage.getItem('claude-dashboard:privacy-mode')).toBe(expectedValue)
        })
      }
    })
  })

  describe('anonymizePath', () => {
    it('should return raw path when privacy mode is off', () => {
      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('test-path').textContent).toBe('/Users/john/projects/foo')
    })

    it('should anonymize username when privacy mode is on', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-path').textContent).toBe('/Users/user/projects/foo')
      })
    })

    it('should return raw path with project when privacy mode is off', () => {
      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('test-path-with-project').textContent).toBe('/Users/john/projects/foo')
    })

    it('should anonymize path with project name when privacy mode is on', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-path-with-project').textContent).toBe('.../project-1')
      })
    })
  })

  describe('anonymizeProjectName', () => {
    it('should return raw name when privacy mode is off', () => {
      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('test-project-1').textContent).toBe('my-project')
      expect(screen.getByTestId('test-project-2').textContent).toBe('other-project')
    })

    it('should anonymize project names when privacy mode is on', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-project-1').textContent).toBe('project-1')
        expect(getByTestId('test-project-2').textContent).toBe('project-2')
      })
    })

    it('should return same anonymized name for same input', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        const first = getByTestId('test-project-1').textContent
        const again = getByTestId('test-project-1-again').textContent
        expect(first).toBe('project-1')
        expect(again).toBe('project-1')
      })
    })

    it('should increment index for different project names', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-project-1').textContent).toBe('project-1')
        expect(getByTestId('test-project-2').textContent).toBe('project-2')
      })
    })
  })

  describe('anonymizeBranch', () => {
    it('should return raw branch name when privacy mode is off', () => {
      render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      expect(screen.getByTestId('test-branch-1').textContent).toBe('feature/HEATMAP-123')
      expect(screen.getByTestId('test-branch-2').textContent).toBe('main')
    })

    it('should anonymize branch names when privacy mode is on', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-branch-1').textContent).toBe('branch-1')
        expect(getByTestId('test-branch-2').textContent).toBe('branch-2')
      })
    })

    it('should return same anonymized name for same branch input', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        const first = getByTestId('test-branch-1').textContent
        const again = getByTestId('test-branch-1-again').textContent
        expect(first).toBe('branch-1')
        expect(again).toBe('branch-1')
      })
    })

    it('should increment index for different branch names', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-branch-1').textContent).toBe('branch-1')
        expect(getByTestId('test-branch-2').textContent).toBe('branch-2')
      })
    })
  })

  describe('map reset on toggle', () => {
    it('should reset project name map when privacy mode is toggled', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      // Turn privacy on
      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-project-1').textContent).toBe('project-1')
      })

      // Turn privacy off and back on
      getByTestId('toggle-privacy').click()
      await waitFor(() => {
        expect(getByTestId('privacy-mode').textContent).toBe('false')
      })

      getByTestId('toggle-privacy').click()
      await waitFor(() => {
        // Index should reset to 1 after toggle cycle
        expect(getByTestId('test-project-1').textContent).toBe('project-1')
      })
    })

    it('should reset branch name map when privacy mode is toggled', async () => {
      const { getByTestId } = render(
        <PrivacyProvider>
          <TestComponent />
        </PrivacyProvider>
      )

      // Turn privacy on
      getByTestId('toggle-privacy').click()

      await waitFor(() => {
        expect(getByTestId('test-branch-1').textContent).toBe('branch-1')
      })

      // Turn privacy off and back on
      getByTestId('toggle-privacy').click()
      await waitFor(() => {
        expect(getByTestId('privacy-mode').textContent).toBe('false')
      })

      getByTestId('toggle-privacy').click()
      await waitFor(() => {
        // Index should reset to 1 after toggle cycle
        expect(getByTestId('test-branch-1').textContent).toBe('branch-1')
      })
    })
  })

  describe('usePrivacy hook error handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test since we expect an error
      const originalError = console.error
      console.error = () => {}

      expect(() => {
        render(<TestComponent />)
      }).toThrow('usePrivacy must be used within a PrivacyProvider')

      console.error = originalError
    })
  })
})
