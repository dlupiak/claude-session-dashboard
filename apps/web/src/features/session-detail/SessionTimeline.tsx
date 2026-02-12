import { useState } from 'react'
import type {
  Turn,
  AgentInvocation,
  SkillInvocation,
} from '@/lib/parsers/types'
import { formatTokenCount, formatDuration } from '@/lib/utils/format'
import { format } from 'date-fns'

interface Props {
  turns: Turn[]
  agents?: AgentInvocation[]
  skills?: SkillInvocation[]
}

export function SessionTimeline({ turns, agents = [], skills = [] }: Props) {
  const agentByToolUseId = new Map<string, AgentInvocation>()
  for (const a of agents) {
    if (a.toolUseId) agentByToolUseId.set(a.toolUseId, a)
  }
  const skillByToolUseId = new Map<string, SkillInvocation>()
  for (const s of skills) {
    if (s.toolUseId) skillByToolUseId.set(s.toolUseId, s)
  }

  // Filter to meaningful turns: must have text content OR tool calls
  const meaningful = turns.filter((t) => {
    if (t.type !== 'user' && t.type !== 'assistant') return false
    if (t.message && t.message.trim().length > 0) return true
    if (t.toolCalls.length > 0) return true
    if (t.tokens) return true
    return false
  })

  if (meaningful.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No conversation turns found
      </div>
    )
  }

  // Compute summary stats
  const userTurns = meaningful.filter((t) => t.type === 'user' && t.message?.trim())
  const assistantTurns = meaningful.filter((t) => t.type === 'assistant')

  return (
    <div className="space-y-1">
      {/* Summary bar */}
      <div className="mb-2 flex items-center gap-3 text-[11px] text-gray-500">
        <span>{userTurns.length} user message{userTurns.length !== 1 ? 's' : ''}</span>
        <span className="text-gray-700">&middot;</span>
        <span>{assistantTurns.length} AI response{assistantTurns.length !== 1 ? 's' : ''}</span>
      </div>

      {meaningful.map((turn, i) => (
        <TimelineTurn
          key={turn.uuid || i}
          turn={turn}
          agentByToolUseId={agentByToolUseId}
          skillByToolUseId={skillByToolUseId}
        />
      ))}
    </div>
  )
}

function TimelineTurn({
  turn,
  agentByToolUseId,
  skillByToolUseId,
}: {
  turn: Turn
  agentByToolUseId: Map<string, AgentInvocation>
  skillByToolUseId: Map<string, SkillInvocation>
}) {
  const isUser = turn.type === 'user'
  const time = turn.timestamp
    ? format(new Date(turn.timestamp), 'HH:mm:ss')
    : ''

  // Classify tool calls
  const agentCalls: AgentInvocation[] = []
  const skillCalls: SkillInvocation[] = []
  const regularToolFreq: Record<string, number> = {}

  for (const tc of turn.toolCalls) {
    const agent = agentByToolUseId.get(tc.toolUseId)
    const skill = skillByToolUseId.get(tc.toolUseId)
    if (agent) {
      agentCalls.push(agent)
    } else if (skill) {
      skillCalls.push(skill)
    } else {
      regularToolFreq[tc.toolName] = (regularToolFreq[tc.toolName] ?? 0) + 1
    }
  }

  const regularToolEntries = Object.entries(regularToolFreq).sort(
    ([, a], [, b]) => b - a,
  )
  const hasMessage = turn.message && turn.message.trim().length > 0
  const hasContent = hasMessage || regularToolEntries.length > 0 || agentCalls.length > 0 || skillCalls.length > 0 || turn.tokens

  if (!hasContent) return null

  return (
    <div
      className={`flex gap-3 rounded-lg p-2.5 ${
        isUser ? 'bg-blue-950/20' : 'bg-gray-900/40'
      }`}
    >
      <div className="flex w-14 shrink-0 flex-col items-center">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
            isUser
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-purple-500/20 text-purple-400'
          }`}
        >
          {isUser ? 'user' : 'AI'}
        </span>
        <span className="mt-1 text-[10px] text-gray-600">{time}</span>
      </div>

      <div className="min-w-0 flex-1">
        {hasMessage && (
          <p className="whitespace-pre-wrap text-xs text-gray-300 line-clamp-4">
            {turn.message}
          </p>
        )}

        {/* Grouped regular tool calls */}
        {regularToolEntries.length > 0 && (
          <div className={`flex flex-wrap gap-1 ${hasMessage ? 'mt-1.5' : ''}`}>
            {regularToolEntries.map(([name, count]) => (
              <span
                key={name}
                className="inline-flex items-center gap-0.5 rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400"
              >
                {name}
                {count > 1 && (
                  <span className="text-gray-500">&times;{count}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Agent dispatches — collapsible */}
        {agentCalls.map((agent, j) => (
          <CollapsibleAgentBlock key={`agent-${j}`} agent={agent} />
        ))}

        {/* Skill invocation badges */}
        {skillCalls.length > 0 && (
          <div className={`flex flex-wrap gap-1 ${hasMessage || regularToolEntries.length > 0 ? 'mt-1.5' : ''}`}>
            {skillCalls.map((skill, j) => (
              <span
                key={`skill-${j}`}
                className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300"
              >
                /{skill.skill}
                {skill.args && (
                  <span className="font-normal text-amber-400/60">
                    {skill.args}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {turn.tokens && (
          <span className="mt-1 inline-block text-[10px] text-gray-600">
            {formatTokenCount(turn.tokens.inputTokens + turn.tokens.outputTokens)}{' '}
            tokens
            {turn.model && (
              <span className="ml-1 text-gray-700">
                ({turn.model.replace(/^claude-/, '').split('-202')[0]})
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

function CollapsibleAgentBlock({ agent }: { agent: AgentInvocation }) {
  const [isOpen, setIsOpen] = useState(false)

  const tokenCount =
    agent.totalTokens ??
    (agent.tokens
      ? agent.tokens.inputTokens + agent.tokens.outputTokens
      : undefined)

  const toolEntries = agent.toolCalls
    ? Object.entries(agent.toolCalls).sort(([, a], [, b]) => b - a)
    : []

  return (
    <div className="mt-2 rounded-lg border-l-2 border-indigo-500/40 bg-indigo-950/20">
      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 p-2 text-left hover:bg-indigo-950/30 rounded-lg transition-colors"
      >
        <span className="text-[10px] text-gray-500 select-none">
          {isOpen ? '▼' : '▶'}
        </span>
        <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
          {agent.subagentType}
        </span>
        <span className="truncate text-xs text-gray-400">
          {agent.description}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {tokenCount != null && tokenCount > 0 && (
            <span className="text-[10px] font-mono text-indigo-400/80">
              {formatTokenCount(tokenCount)}
            </span>
          )}
          {agent.totalToolUseCount != null && (
            <span className="text-[10px] text-gray-500">
              {agent.totalToolUseCount} tools
            </span>
          )}
          {agent.durationMs != null && (
            <span className="text-[10px] text-gray-600">
              {formatDuration(agent.durationMs)}
            </span>
          )}
        </div>
      </button>

      {/* Collapsible tool detail */}
      {isOpen && toolEntries.length > 0 && (
        <div className="px-2 pb-2 pt-0">
          <div className="flex flex-wrap gap-1">
            {toolEntries.map(([name, count]) => (
              <span
                key={name}
                className="inline-flex items-center gap-0.5 rounded bg-indigo-900/30 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300/70"
              >
                {name}
                {count > 1 && (
                  <span className="text-indigo-400/50">&times;{count}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
