# RAPID

**Tech stack:** TanStack Start, React, TypeScript, Supabase, Tailwind CSS, Vercel

Run `/workflow` for commands and pipeline overview.

## Agents

Use the Task tool to dispatch these agents:

| subagent_type | When to use |
|---------------|-------------|
| `product-owner` | Creating GitHub issues with acceptance criteria |
| `architect` | Design docs, data flow, schema design (read-only, no code) |
| `implementer` | Writing production code slice by slice |
| `reviewer` | Read-only code review after implementation |
| `qa` | Writing tests, running quality checks |
| `devops` | CI/CD pipelines, GitHub Actions, deployment |

## Conventions

- Vertical Slice Architecture — organize by feature, not by layer
- App code lives in `apps/web/src/`
- Import alias: `@/` maps to `apps/web/src/`
- Env vars: `VITE_` prefix = client-side, no prefix = server-only
- Branch naming: `feature/<STORY-ID>-description`
- Quality gates before PR: typecheck, lint, test, build (all must pass)
- Never push directly to main — always feature branches and PRs

## Task Sessions

- `CLAUDE_CODE_TASK_LIST_ID` is set per-branch via the `SessionStart` hook
- Tasks are scoped to the current feature branch — switching branches starts a fresh task list

## Browser Automation

- Use `playwright-cli` (CLI-based) instead of Playwright MCP plugin — more token-efficient
- See `.claude/skills/playwright-cli/SKILL.md` for full command reference
- Common: `playwright-cli open`, `goto`, `snapshot`, `screenshot`, `console`, `close`
