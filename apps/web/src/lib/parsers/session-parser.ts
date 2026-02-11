import * as fs from 'node:fs'
import * as readline from 'node:readline'
import type {
  SessionSummary,
  SessionDetail,
  Turn,
  ToolCall,
  TokenUsage,
  SessionError,
  AgentInvocation,
  SkillInvocation,
  RawJsonlMessage,
} from './types'

const HEAD_LINES = 15
const TAIL_LINES = 15

/**
 * Parse a session summary by reading only the first and last N lines.
 * This keeps memory usage minimal even for 500MB+ files.
 */
export async function parseSummary(
  filePath: string,
  sessionId: string,
  projectPath: string,
  projectName: string,
  fileSizeBytes: number,
): Promise<SessionSummary | null> {
  const headLines = await readHeadLines(filePath, HEAD_LINES)
  const tailLines = await readTailLines(filePath, TAIL_LINES)
  const allLines = [...headLines, ...tailLines]

  if (allLines.length === 0) return null

  let startedAt: string | null = null
  let lastActiveAt: string | null = null
  let branch: string | null = null
  let cwd: string | null = null
  let model: string | null = null
  let version: string | null = null
  let userMessageCount = 0
  let assistantMessageCount = 0
  let totalMessageCount = 0

  for (const line of allLines) {
    const msg = safeParse(line)
    if (!msg) continue
    if (msg.type === 'file-history-snapshot') continue

    const ts = msg.timestamp
    if (ts) {
      if (!startedAt || ts < startedAt) startedAt = ts
      if (!lastActiveAt || ts > lastActiveAt) lastActiveAt = ts
    }

    if (msg.gitBranch && !branch) branch = msg.gitBranch
    if (msg.cwd && !cwd) cwd = msg.cwd
    if (msg.version && !version) version = msg.version

    if (msg.type === 'user') userMessageCount++
    if (msg.type === 'assistant') {
      assistantMessageCount++
      if (msg.message?.model && !model) model = msg.message.model
    }
    if (msg.type === 'user' || msg.type === 'assistant' || msg.type === 'system') {
      totalMessageCount++
    }
  }

  if (!startedAt) return null

  const durationMs =
    startedAt && lastActiveAt
      ? new Date(lastActiveAt).getTime() - new Date(startedAt).getTime()
      : 0

  return {
    sessionId,
    projectPath,
    projectName,
    branch,
    cwd,
    startedAt,
    lastActiveAt: lastActiveAt ?? startedAt,
    durationMs,
    messageCount: totalMessageCount,
    userMessageCount,
    assistantMessageCount,
    isActive: false, // Will be set by caller
    model,
    version,
    fileSizeBytes,
  }
}

/**
 * Stream-parse the full session file for detail view.
 * Processes line-by-line to handle large files.
 */
export async function parseDetail(
  filePath: string,
  sessionId: string,
  projectPath: string,
  projectName: string,
): Promise<SessionDetail> {
  const turns: Turn[] = []
  const toolFrequency: Record<string, number> = {}
  const errors: SessionError[] = []
  const agents: AgentInvocation[] = []
  const skills: SkillInvocation[] = []
  const modelsSet = new Set<string>()
  let branch: string | null = null
  const totalTokens: TokenUsage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0,
  }

  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' })
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })

  for await (const line of rl) {
    const msg = safeParse(line)
    if (!msg || msg.type === 'file-history-snapshot') continue

    if (msg.gitBranch && !branch) branch = msg.gitBranch

    const toolCalls: ToolCall[] = []

    if (msg.type === 'assistant' && msg.message) {
      const content = msg.message.content ?? []
      for (const block of content) {
        if (block.type === 'tool_use' && block.name) {
          toolCalls.push({
            toolName: block.name,
            toolUseId: block.id ?? '',
            input: block.input,
          })
          toolFrequency[block.name] = (toolFrequency[block.name] ?? 0) + 1

          // Extract agent invocations from Task tool calls
          if (block.name === 'Task' && block.input) {
            const inp = block.input as Record<string, unknown>
            if (inp.subagent_type) {
              agents.push({
                subagentType: String(inp.subagent_type),
                description: String(inp.description ?? ''),
                timestamp: msg.timestamp ?? '',
              })
            }
          }

          // Extract skill invocations from Skill tool calls
          if (block.name === 'Skill' && block.input) {
            const inp = block.input as Record<string, unknown>
            if (inp.skill) {
              skills.push({
                skill: String(inp.skill),
                args: inp.args ? String(inp.args) : null,
                timestamp: msg.timestamp ?? '',
              })
            }
          }
        }
      }

      if (msg.message.model) modelsSet.add(msg.message.model)

      if (msg.message.usage) {
        const u = msg.message.usage
        const tokens: TokenUsage = {
          inputTokens: u.input_tokens ?? 0,
          outputTokens: u.output_tokens ?? 0,
          cacheReadInputTokens: u.cache_read_input_tokens ?? 0,
          cacheCreationInputTokens: u.cache_creation_input_tokens ?? 0,
        }
        totalTokens.inputTokens += tokens.inputTokens
        totalTokens.outputTokens += tokens.outputTokens
        totalTokens.cacheReadInputTokens += tokens.cacheReadInputTokens
        totalTokens.cacheCreationInputTokens += tokens.cacheCreationInputTokens

        turns.push({
          uuid: msg.uuid ?? '',
          type: msg.type,
          timestamp: msg.timestamp ?? '',
          model: msg.message.model,
          toolCalls,
          tokens,
          stopReason: msg.message.stop_reason,
        })
        continue
      }
    }

    // Collect errors from system messages
    if (msg.type === 'system' && msg.level === 'error') {
      errors.push({
        timestamp: msg.timestamp ?? '',
        message: msg.slug ?? msg.subtype ?? 'Unknown error',
        type: msg.subtype ?? 'system',
      })
    }

    if (msg.type === 'user' || msg.type === 'assistant' || msg.type === 'system') {
      const textContent = extractTextContent(msg)
      turns.push({
        uuid: msg.uuid ?? '',
        type: msg.type,
        timestamp: msg.timestamp ?? '',
        message: textContent,
        toolCalls,
      })
    }
  }

  return {
    sessionId,
    projectPath,
    projectName,
    branch,
    turns,
    totalTokens,
    toolFrequency,
    errors,
    models: Array.from(modelsSet),
    agents,
    skills,
  }
}

/**
 * Read paginated raw messages from a session file.
 */
export async function readSessionMessages(
  filePath: string,
  offset: number,
  limit: number,
): Promise<{ messages: RawJsonlMessage[]; total: number }> {
  const messages: RawJsonlMessage[] = []
  let lineIndex = 0
  let total = 0

  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' })
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })

  for await (const line of rl) {
    const msg = safeParse(line)
    if (!msg || msg.type === 'file-history-snapshot') continue
    total++

    if (lineIndex >= offset && lineIndex < offset + limit) {
      messages.push(msg)
    }
    lineIndex++

    // Early exit if we have enough
    if (lineIndex >= offset + limit + 1000) {
      // Keep counting for total estimate but don't parse
    }
  }

  return { messages, total }
}

// --- Helpers ---

async function readHeadLines(
  filePath: string,
  count: number,
): Promise<string[]> {
  const lines: string[] = []
  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' })
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })

  for await (const line of rl) {
    lines.push(line)
    if (lines.length >= count) break
  }

  stream.destroy()
  return lines
}

async function readTailLines(
  filePath: string,
  count: number,
): Promise<string[]> {
  // Read the last ~64KB to get tail lines (enough for any reasonable line length)
  const stat = await fs.promises.stat(filePath)
  const readSize = Math.min(stat.size, 65536)
  const buffer = Buffer.alloc(readSize)

  const fd = await fs.promises.open(filePath, 'r')
  try {
    await fd.read(buffer, 0, readSize, Math.max(0, stat.size - readSize))
  } finally {
    await fd.close()
  }

  const text = buffer.toString('utf-8')
  const lines = text.split('\n').filter(Boolean)
  return lines.slice(-count)
}

function safeParse(line: string): RawJsonlMessage | null {
  try {
    return JSON.parse(line) as RawJsonlMessage
  } catch {
    return null
  }
}

function extractTextContent(msg: RawJsonlMessage): string | undefined {
  if (!msg.message) return undefined
  const content = msg.message.content
  if (!Array.isArray(content)) return undefined

  const texts = content
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text!)

  return texts.length > 0 ? texts.join('\n').slice(0, 500) : undefined
}
