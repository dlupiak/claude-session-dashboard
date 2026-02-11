import type { AgentInvocation, SkillInvocation } from '@/lib/parsers/types'
import { format } from 'date-fns'

export function AgentsSkillsPanel({
  agents,
  skills,
}: {
  agents: AgentInvocation[]
  skills: SkillInvocation[]
}) {
  if (agents.length === 0 && skills.length === 0) return null

  // Count agent types
  const agentCounts = new Map<string, number>()
  for (const a of agents) {
    agentCounts.set(a.subagentType, (agentCounts.get(a.subagentType) ?? 0) + 1)
  }
  const sortedAgents = [...agentCounts.entries()].sort(([, a], [, b]) => b - a)

  // Count skills
  const skillCounts = new Map<string, number>()
  for (const s of skills) {
    skillCounts.set(s.skill, (skillCounts.get(s.skill) ?? 0) + 1)
  }
  const sortedSkills = [...skillCounts.entries()].sort(([, a], [, b]) => b - a)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h3 className="text-sm font-semibold text-gray-300">
        Agents & Skills
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        {agents.length} agent dispatch{agents.length !== 1 ? 'es' : ''}
        {skills.length > 0 && `, ${skills.length} skill invocation${skills.length !== 1 ? 's' : ''}`}
      </p>

      {/* Agent type summary */}
      {sortedAgents.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Agents
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sortedAgents.map(([type, count]) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-300"
              >
                {type}
                {count > 1 && (
                  <span className="text-indigo-400/60">&times;{count}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skill summary */}
      {sortedSkills.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sortedSkills.map(([skill, count]) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300"
              >
                /{skill}
                {count > 1 && (
                  <span className="text-amber-400/60">&times;{count}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timeline of dispatches */}
      <div className="mt-3 max-h-48 space-y-1 overflow-auto">
        {agents.map((a, i) => (
          <div
            key={`a-${i}`}
            className="flex items-start gap-2 rounded bg-gray-950/40 px-2 py-1.5"
          >
            <span className="shrink-0 rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
              {a.subagentType}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-gray-400">
              {a.description}
            </span>
            {a.timestamp && (
              <span className="shrink-0 text-[10px] text-gray-600">
                {format(new Date(a.timestamp), 'HH:mm:ss')}
              </span>
            )}
          </div>
        ))}
        {skills.map((s, i) => (
          <div
            key={`s-${i}`}
            className="flex items-start gap-2 rounded bg-gray-950/40 px-2 py-1.5"
          >
            <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
              /{s.skill}
            </span>
            {s.args && (
              <span className="min-w-0 flex-1 truncate text-xs font-mono text-gray-500">
                {s.args}
              </span>
            )}
            {s.timestamp && (
              <span className="shrink-0 text-[10px] text-gray-600">
                {format(new Date(s.timestamp), 'HH:mm:ss')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
