---
name: review
description: Run quality gates (typecheck, lint, test, build) then code review all changes against project standards
user_invocable: true
---

# Review Pipeline

Two phases: quality gates first, then code review via the reviewer agent.

## Phase 1 — Quality Gates (you run this directly)

Run each gate from `apps/web/`:

```bash
cd apps/web && npm run typecheck
cd apps/web && npm run build
```

**ALL gates must pass before Phase 2.** If any fail, report the errors and stop.

## Phase 2 — Code Review (dispatch `reviewer` agent)

Only after all quality gates pass, dispatch the reviewer agent:

```
Task(
  subagent_type: "reviewer",
  description: "Code review current changes",
  prompt: "Review all uncommitted and staged changes in this repository.

Run these commands to gather changes:
- git diff
- git diff --cached
- git status --short

Review against these criteria:

**Architecture**: Vertical Slice Architecture compliance, no cross-slice imports except via src/lib/
**TypeScript**: No `any` types, proper error handling, Zod schemas for external data
**React**: Named exports, TanStack Query for data fetching, no useEffect for fetching
**Security**: No secrets in code, RLS on new tables, validated responses

Return a structured review:
## Review Summary
- Files reviewed: N
- Issues found: N (critical: N, warning: N, info: N)

## Issues
### [CRITICAL/WARNING/INFO] filename:line — description
Suggested fix: ...

Be concise — focus on real issues, not style nitpicks."
)
```

Present the reviewer's findings to the user. If CRITICAL issues exist, they must be fixed before proceeding.

## RULES

- **NEVER perform code review yourself** — always dispatch the reviewer agent
- You MAY run quality gate commands directly
- Report both quality gate results and reviewer findings to the user
