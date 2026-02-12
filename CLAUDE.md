# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A read-only, local-only observability dashboard for Claude Code sessions. It scans `~/.claude` to detect active/historical sessions, parse JSONL logs, and display session details, tool usage, token consumption, and aggregate stats. **Must never modify any files in `~/.claude`.** There is no deployment target — this runs on localhost only.

## Commands

All commands run from `apps/web/`:

```bash
cd apps/web
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build (output in .output/)
npm run start        # Run production build
npm run typecheck    # TypeScript type checking (tsc --noEmit)
```

No monorepo tooling — `apps/web` is the only package with its own `package-lock.json`.

## Missing Tooling

No linter, test runner, or formatter is configured yet. CI (`.github/workflows/ci.yml`) is stubbed and has no active jobs — when jobs are added, it should only run lints.

## Architecture

**Tech stack:** TanStack Start (SSR framework on Vite), TanStack Router (file-based routing), TanStack React Query, Tailwind CSS v4, Recharts, Zod.

### Data Flow

```
~/.claude/projects/*/*.jsonl  ──►  Scanner  ──►  Parsers  ──►  Server Functions  ──►  React Query  ──►  UI
~/.claude/stats-cache.json    ──►  stats-parser  ──►  ...
~/.claude/history.jsonl       ──►  history-parser  ──►  ...
```

Server functions (`createServerFn`) in `*.server.ts` files run server-side and are called from React Query hooks defined in `*.queries.ts` files. No database — all state is derived from filesystem reads with in-memory mtime-based caches.

### Key Layers

- **`lib/scanner/`** — Discovers projects and session files under `~/.claude/projects/`, detects active sessions via mtime + lock directory presence (2-minute threshold)
- **`lib/parsers/`** — Parses JSONL session files (head/tail sampling for summaries, full stream for detail), `stats-cache.json` (Zod-validated), and `history.jsonl`
- **`lib/utils/`** — Path helpers (`claude-path.ts` decodes encoded directory names like `-Users-foo-bar` → `/Users/foo/bar`), formatting utilities
- **`features/`** — Vertical slices: `sessions/` (list + filters), `session-detail/` (timeline, tokens, tools, agents, errors, raw logs), `stats/` (charts)
- **`routes/`** — TanStack Router file-based routes under `_dashboard` layout; `/` redirects to `/sessions`

### Route Structure

- `/_dashboard/sessions/` — Session list with active/all filtering
- `/_dashboard/sessions/$sessionId` — Session detail view
- `/_dashboard/stats` — Aggregate usage charts from stats-cache.json

### Server Function Pattern

Each feature slice follows: `*.server.ts` (defines `createServerFn`) → `*.queries.ts` (wraps in `queryOptions` with refetch intervals) → components consume via `useQuery`.

## Conventions

- Vertical Slice Architecture — organize by feature, not by layer
- Import alias: `@/` maps to `apps/web/src/`
- Env vars: `VITE_` prefix = client-side, no prefix = server-only
- Branch naming: `feature/<STORY-ID>-description`
- Quality gates before PR: typecheck, lint, test, build (all must pass)
- Never push directly to main — always feature branches and PRs
- Tailwind v4 (CSS-first config via `@import 'tailwindcss'` in `app.css`)
- Dark theme: `bg-gray-950` body, `border-gray-800` borders, `text-gray-100` base text
- See `.claude/skills/uiux/SKILL.md` for the full design system (colors, components, visual rules)

## Product Spec

See `docs/claude-session-dashboard.md` for the full product specification.

## Workflow — MUST FOLLOW

This project has a defined SDLC workflow. **You MUST use the skills and agents below instead of doing everything inline.** Run `/workflow` to see all available commands.

### For new features: `/feature <STORY-ID>`

This invokes the full pipeline: plan → implement → review → PR. The skill orchestrates the correct agents automatically. **Always use this for non-trivial feature work.**

### For bug fixes: `/fix-issue <number>`

Fetches the GitHub issue, creates a branch, implements the fix, runs quality gates, and creates a PR.

### For creating issues: `/open-issue <description>`

Dispatches the `product-owner` agent to analyze the codebase, ask clarifying questions, and create a structured GitHub issue with acceptance criteria.

### For reviewing changes: `/review`

Runs quality gates (typecheck, lint, test, build) then performs a structured code review against project standards.

### For quality checks: `/quality-check`

Runs typecheck, lint, test, and build sequentially and reports pass/fail.

### For investigating UI: `/investigate <url>`

Opens a browser via playwright-cli, takes screenshots, checks console/network, and reports findings.

### For pipeline status: `/sdlc`

Shows current branch, CI status, quality gate results, open PRs and issues.

## Agents

**You MUST use the Task tool to dispatch these agents for their designated responsibilities.** Do not implement architecture, write production code, run reviews, or write tests inline — delegate to the appropriate agent.

| subagent_type | When to dispatch | What it does |
|---------------|-----------------|--------------|
| `product-owner` | When creating GitHub issues | Asks clarifying questions, writes structured issues with acceptance criteria |
| `architect` | When designing new features or data flow | Produces design docs and ASCII diagrams (read-only, no code) |
| `implementer` | When writing production code | Implements slice-by-slice, follows TanStack patterns, runs typecheck after each change |
| `reviewer` | After implementation is complete | Read-only code review against project standards (TypeScript, React, architecture) |
| `qa` | When writing tests or checking quality | Writes Vitest unit tests and Playwright E2E tests, runs all quality gates |
| `devops` | When modifying CI/CD or GitHub Actions | Configures workflows, PR checks, deployment |

### Agent dispatch rules

1. **Architecture decisions** — Always dispatch `architect` before implementing a non-trivial feature. Get the design approved before writing code.
2. **Production code** — Dispatch `implementer` for writing feature code. It has access to `tanstack-start`, `uiux`, and `playwright-cli` skills.
3. **Code review** — After implementation, dispatch `reviewer` to check changes. It enforces TypeScript rules, React patterns, and Vertical Slice Architecture.
4. **Tests** — Dispatch `qa` to write tests. It has access to `testing` and `uiux` skills.
5. **Simple fixes** (typos, one-line changes, config tweaks) — You may do these directly without dispatching an agent.

## Skills Reference

Skills are loaded by agents automatically via their config. Key skills:

| Skill | Description | Used by |
|-------|-------------|---------|
| `tanstack-start` | TanStack Start/Router/Query patterns | implementer, architect |
| `uiux` | Dashboard design system (colors, components, visual rules) | implementer, qa |
| `typescript-rules` | TypeScript conventions (no `any`, Zod validation, error handling) | implementer, reviewer, qa |
| `react-rules` | React patterns (named exports, TanStack Query, no useEffect fetching) | implementer, reviewer, qa |
| `testing` | Vitest and Playwright patterns | qa |
| `playwright-cli` | Browser automation CLI commands | implementer, qa, devops |

## Task Sessions

- `CLAUDE_CODE_TASK_LIST_ID` is set per-branch via the `SessionStart` hook
- Tasks are scoped to the current feature branch — switching branches starts a fresh task list

## Browser Automation

- Use `playwright-cli` (CLI-based) instead of Playwright MCP plugin — more token-efficient
- See `.claude/skills/playwright-cli/SKILL.md` for full command reference
- Common: `playwright-cli open`, `goto`, `snapshot`, `screenshot`, `console`, `close`
