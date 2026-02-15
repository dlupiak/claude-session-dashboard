import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { parseDetail } from './session-parser'

describe('parseSubagentSkills', () => {
  let tempDir: string
  let testFiles: string[]

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-subagent-skills-'))
    testFiles = []
  })

  afterEach(() => {
    // Clean up test files
    for (const file of testFiles) {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file)
        }
      } catch {
        // Ignore cleanup errors
      }
    }

    // Clean up temp directory
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true })
      }
    } catch {
      // Ignore cleanup errors
    }
  })

  function createSessionJSONL(lines: string[]): string {
    const filePath = path.join(tempDir, `session-${Date.now()}-${Math.random()}.jsonl`)
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
    testFiles.push(filePath)
    return filePath
  }

  describe('empty file', () => {
    it('should return empty array for empty file', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Do work' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-001' },
        }),
      ])

      // Create empty subagent file
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const emptySubagentPath = path.join(subagentsDir, 'agent-agent-001.jsonl')
      fs.writeFileSync(emptySubagentPath, '', 'utf-8')
      testFiles.push(emptySubagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBe('agent-001')
      expect(result.agents[0].skills).toEqual([])
    })
  })

  describe('file with no Skill blocks', () => {
    it('should return empty array when file has no Skill tool_use blocks', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Do work' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-002' },
        }),
      ])

      // Create subagent file with only non-Skill tool calls
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-002.jsonl')
      fs.writeFileSync(
        subagentPath,
        [
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:02:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Read',
                  id: 'read1',
                  input: { file_path: '/test.ts' },
                },
              ],
            },
          }),
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:03:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Edit',
                  id: 'edit1',
                  input: { file_path: '/test.ts', old_string: 'a', new_string: 'b' },
                },
              ],
            },
          }),
        ].join('\n'),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBe('agent-002')
      expect(result.agents[0].skills).toEqual([])
    })
  })

  describe('file with one Skill block', () => {
    it('should return single SkillInvocation when file has one Skill tool_use', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'qa', description: 'Run tests' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-003' },
        }),
      ])

      // Create subagent file with one Skill invocation
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-003.jsonl')
      fs.writeFileSync(
        subagentPath,
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:02:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Skill',
                id: 'skill1',
                input: { skill: 'testing', args: '--coverage' },
              },
            ],
          },
        }),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBe('agent-003')
      expect(result.agents[0].skills).toHaveLength(1)

      const skill = result.agents[0].skills![0]
      expect(skill.skill).toBe('testing')
      expect(skill.args).toBe('--coverage')
      expect(skill.timestamp).toBe('2026-01-01T10:02:00Z')
      expect(skill.toolUseId).toBe('skill1')
    })

    it('should handle Skill with null args', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'qa', description: 'Run tests' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-004' },
        }),
      ])

      // Create subagent file with Skill that has no args
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-004.jsonl')
      fs.writeFileSync(
        subagentPath,
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:02:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Skill',
                id: 'skill1',
                input: { skill: 'typescript-rules' },
              },
            ],
          },
        }),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].skills).toHaveLength(1)

      const skill = result.agents[0].skills![0]
      expect(skill.skill).toBe('typescript-rules')
      expect(skill.args).toBeNull()
    })
  })

  describe('file with multiple Skill blocks', () => {
    it('should return all SkillInvocations when file has multiple Skill tool_use blocks', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Build feature' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-005' },
        }),
      ])

      // Create subagent file with multiple Skill invocations
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-005.jsonl')
      fs.writeFileSync(
        subagentPath,
        [
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:02:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill1',
                  input: { skill: 'typescript-rules', args: '' },
                },
              ],
            },
          }),
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:03:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill2',
                  input: { skill: 'react-rules' },
                },
              ],
            },
          }),
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:04:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill3',
                  input: { skill: 'uiux', args: '--dark-mode' },
                },
              ],
            },
          }),
        ].join('\n'),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBe('agent-005')
      expect(result.agents[0].skills).toHaveLength(3)

      const skills = result.agents[0].skills!
      expect(skills[0].skill).toBe('typescript-rules')
      expect(skills[0].args).toBeNull()
      expect(skills[0].toolUseId).toBe('skill1')

      expect(skills[1].skill).toBe('react-rules')
      expect(skills[1].args).toBeNull()
      expect(skills[1].toolUseId).toBe('skill2')

      expect(skills[2].skill).toBe('uiux')
      expect(skills[2].args).toBe('--dark-mode')
      expect(skills[2].toolUseId).toBe('skill3')
    })

    it('should handle Skills mixed with other tool calls', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Build feature' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-006' },
        }),
      ])

      // Create subagent file with Skills interspersed with other tools
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-006.jsonl')
      fs.writeFileSync(
        subagentPath,
        [
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:02:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill1',
                  input: { skill: 'testing' },
                },
              ],
            },
          }),
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:03:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Read',
                  id: 'read1',
                  input: { file_path: '/test.ts' },
                },
              ],
            },
          }),
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:04:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill2',
                  input: { skill: 'typescript-rules', args: '--strict' },
                },
              ],
            },
          }),
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:05:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Edit',
                  id: 'edit1',
                  input: { file_path: '/test.ts', old_string: 'a', new_string: 'b' },
                },
              ],
            },
          }),
        ].join('\n'),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].skills).toHaveLength(2)

      const skills = result.agents[0].skills!
      expect(skills[0].skill).toBe('testing')
      expect(skills[1].skill).toBe('typescript-rules')
      expect(skills[1].args).toBe('--strict')
    })
  })

  describe('malformed JSON lines', () => {
    it('should skip malformed JSON lines and return valid Skills', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'qa', description: 'Run tests' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-007' },
        }),
      ])

      // Create subagent file with malformed JSON mixed with valid Skills
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-007.jsonl')
      fs.writeFileSync(
        subagentPath,
        [
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:02:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill1',
                  input: { skill: 'testing' },
                },
              ],
            },
          }),
          'invalid json line {{{', // Malformed line
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:03:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill2',
                  input: { skill: 'typescript-rules' },
                },
              ],
            },
          }),
          'another bad line', // Malformed line
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:04:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill3',
                  input: { skill: 'react-rules' },
                },
              ],
            },
          }),
        ].join('\n'),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].skills).toHaveLength(3)

      const skills = result.agents[0].skills!
      expect(skills[0].skill).toBe('testing')
      expect(skills[1].skill).toBe('typescript-rules')
      expect(skills[2].skill).toBe('react-rules')
    })
  })

  describe('agentId extraction', () => {
    it('should extract agentId from progress message data', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Build feature' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-alpha' },
        }),
      ])

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBe('agent-alpha')
    })

    it('should handle missing agentId gracefully (no progress message)', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Build feature' },
              },
            ],
          },
        }),
      ])

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBeUndefined()
      expect(result.agents[0].skills).toBeUndefined()
    })

    it('should handle progress message without agentId field', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Build feature' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { someOtherField: 'value' },
        }),
      ])

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBeUndefined()
      expect(result.agents[0].skills).toBeUndefined()
    })
  })

  describe('multiple agents in one session', () => {
    it('should parse skills for multiple agents correctly', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Implement feature' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-impl' },
        }),
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T11:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task2',
                input: { subagent_type: 'qa', description: 'Test feature' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T11:01:00Z',
          parentToolUseID: 'task2',
          data: { agentId: 'agent-qa' },
        }),
      ])

      // Create subagent files for both agents
      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })

      const implPath = path.join(subagentsDir, 'agent-agent-impl.jsonl')
      fs.writeFileSync(
        implPath,
        [
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:02:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill1',
                  input: { skill: 'typescript-rules' },
                },
              ],
            },
          }),
          JSON.stringify({
            type: 'assistant',
            timestamp: '2026-01-01T10:03:00Z',
            message: {
              model: 'claude-opus-4-6',
              content: [
                {
                  type: 'tool_use',
                  name: 'Skill',
                  id: 'skill2',
                  input: { skill: 'react-rules' },
                },
              ],
            },
          }),
        ].join('\n'),
        'utf-8',
      )
      testFiles.push(implPath)

      const qaPath = path.join(subagentsDir, 'agent-agent-qa.jsonl')
      fs.writeFileSync(
        qaPath,
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T11:02:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Skill',
                id: 'skill3',
                input: { skill: 'testing', args: '--coverage' },
              },
            ],
          },
        }),
        'utf-8',
      )
      testFiles.push(qaPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(2)

      const implAgent = result.agents.find((a) => a.agentId === 'agent-impl')
      expect(implAgent).toBeDefined()
      expect(implAgent!.skills).toHaveLength(2)
      expect(implAgent!.skills![0].skill).toBe('typescript-rules')
      expect(implAgent!.skills![1].skill).toBe('react-rules')

      const qaAgent = result.agents.find((a) => a.agentId === 'agent-qa')
      expect(qaAgent).toBeDefined()
      expect(qaAgent!.skills).toHaveLength(1)
      expect(qaAgent!.skills![0].skill).toBe('testing')
      expect(qaAgent!.skills![0].args).toBe('--coverage')
    })
  })

  describe('edge cases', () => {
    it('should handle non-existent subagent file gracefully', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'implementer', description: 'Do work' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-nonexistent' },
        }),
      ])

      // Don't create the subagent file
      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].agentId).toBe('agent-nonexistent')
      expect(result.agents[0].skills).toBeUndefined()
    })

    it('should handle Skill block without input field', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'qa', description: 'Run tests' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-008' },
        }),
      ])

      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-008.jsonl')
      fs.writeFileSync(
        subagentPath,
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:02:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Skill',
                id: 'skill1',
                // Missing input field
              },
            ],
          },
        }),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].skills).toEqual([])
    })

    it('should handle Skill block with input but missing skill field', async () => {
      const sessionPath = createSessionJSONL([
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:00:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Task',
                id: 'task1',
                input: { subagent_type: 'qa', description: 'Run tests' },
              },
            ],
          },
        }),
        JSON.stringify({
          type: 'progress',
          timestamp: '2026-01-01T10:01:00Z',
          parentToolUseID: 'task1',
          data: { agentId: 'agent-009' },
        }),
      ])

      const subagentDir = sessionPath.replace(/\.jsonl$/, '')
      const subagentsDir = path.join(subagentDir, 'subagents')
      fs.mkdirSync(subagentsDir, { recursive: true })
      const subagentPath = path.join(subagentsDir, 'agent-agent-009.jsonl')
      fs.writeFileSync(
        subagentPath,
        JSON.stringify({
          type: 'assistant',
          timestamp: '2026-01-01T10:02:00Z',
          message: {
            model: 'claude-opus-4-6',
            content: [
              {
                type: 'tool_use',
                name: 'Skill',
                id: 'skill1',
                input: { args: '--coverage' }, // Missing skill field
              },
            ],
          },
        }),
        'utf-8',
      )
      testFiles.push(subagentPath)

      const result = await parseDetail(sessionPath, 'test-session', '/test', 'test-project')

      expect(result.agents).toHaveLength(1)
      expect(result.agents[0].skills).toEqual([])
    })
  })
})
