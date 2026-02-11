import { z } from 'zod'

// --- Session summary (derived from first/last N lines of JSONL) ---

export interface SessionSummary {
  sessionId: string
  projectPath: string
  projectName: string
  branch: string | null
  cwd: string | null
  startedAt: string
  lastActiveAt: string
  durationMs: number
  messageCount: number
  userMessageCount: number
  assistantMessageCount: number
  isActive: boolean
  model: string | null
  version: string | null
  fileSizeBytes: number
}

// --- Session detail (full streaming parse) ---

export interface Turn {
  uuid: string
  type: 'user' | 'assistant' | 'system' | 'progress'
  timestamp: string
  message?: string
  model?: string
  toolCalls: ToolCall[]
  tokens?: TokenUsage
  stopReason?: string
}

export interface ToolCall {
  toolName: string
  toolUseId: string
  input?: unknown
}

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  cacheReadInputTokens: number
  cacheCreationInputTokens: number
}

export interface AgentInvocation {
  subagentType: string
  description: string
  timestamp: string
}

export interface SkillInvocation {
  skill: string
  args: string | null
  timestamp: string
}

export interface SessionDetail {
  sessionId: string
  projectPath: string
  projectName: string
  branch: string | null
  turns: Turn[]
  totalTokens: TokenUsage
  toolFrequency: Record<string, number>
  errors: SessionError[]
  models: string[]
  agents: AgentInvocation[]
  skills: SkillInvocation[]
}

export interface SessionError {
  timestamp: string
  message: string
  type: string
}

// --- Stats cache (from ~/.claude/stats-cache.json) ---

export const DailyActivitySchema = z.object({
  date: z.string(),
  messageCount: z.number(),
  sessionCount: z.number(),
  toolCallCount: z.number(),
})

export const DailyModelTokensSchema = z.object({
  date: z.string(),
  tokensByModel: z.record(z.string(), z.number()),
})

export const ModelUsageSchema = z.record(
  z.string(),
  z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    cacheReadInputTokens: z.number(),
    cacheCreationInputTokens: z.number(),
    webSearchRequests: z.number().optional(),
    costUSD: z.number().optional(),
  }),
)

export const LongestSessionSchema = z.object({
  sessionId: z.string(),
  duration: z.number(),
  messageCount: z.number(),
  timestamp: z.string(),
})

export const StatsCacheSchema = z.object({
  version: z.number(),
  lastComputedDate: z.string(),
  dailyActivity: z.array(DailyActivitySchema),
  dailyModelTokens: z.array(DailyModelTokensSchema),
  modelUsage: ModelUsageSchema,
  totalSessions: z.number(),
  totalMessages: z.number(),
  longestSession: LongestSessionSchema,
  firstSessionDate: z.string(),
  hourCounts: z.record(z.string(), z.number()),
  totalSpeculationTimeSavedMs: z.number().optional(),
})

export type StatsCache = z.infer<typeof StatsCacheSchema>
export type DailyActivity = z.infer<typeof DailyActivitySchema>
export type ModelUsage = z.infer<typeof ModelUsageSchema>

// --- History (from ~/.claude/history.jsonl) ---

export interface HistoryEntry {
  display: string
  timestamp: number
  project: string
  sessionId: string
}

// --- JSONL message types (raw file format) ---

export interface RawJsonlMessage {
  type: 'user' | 'assistant' | 'system' | 'progress' | 'file-history-snapshot'
  uuid?: string
  parentUuid?: string
  sessionId?: string
  timestamp?: string
  cwd?: string
  gitBranch?: string
  version?: string
  message?: {
    model?: string
    role?: string
    content?: Array<{
      type: string
      text?: string
      name?: string
      id?: string
      input?: unknown
    }>
    usage?: {
      input_tokens?: number
      output_tokens?: number
      cache_read_input_tokens?: number
      cache_creation_input_tokens?: number
    }
    stop_reason?: string
  }
  data?: {
    type?: string
  }
  slug?: string
  subtype?: string
  level?: string
}
