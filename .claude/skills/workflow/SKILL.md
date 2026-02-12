---
name: workflow
description: Show all available workflow commands, pipeline steps, and getting started info
user_invocable: true
---

# Workflow

Display this message exactly as shown:

```
Workflow
──────────────────────────────────────

Feature Development:
  /feature <STORY-ID>      Full pipeline: plan → implement → review → PR
                            1. Architect agent designs implementation
                            2. Creates feature branch, implements slice-by-slice
                            3. Runs quality gates + code review (/review)
                            4. Commits, pushes, creates PR

Issue Workflows:
  /open-issue <desc>        Clarifying Qs → structured GitHub issue with ACs
  /fix-issue <number>       Fetch issue → branch → fix → quality check → PR

Quality & Review:
  /quality-check             Run typecheck, lint, test, build (all four gates)
  /review                    Quality gates + structured code review

Debugging:
  /fix-ci [run-id]           Investigate and fix failing CI workflow
  /investigate <url>         Browser inspection (screenshots, console, network)

Status:
  /sdlc                      Pipeline dashboard (branch, CI, PRs, issues)
  /workflow                  This help message

Reference Skills:
  /tanstack-start            TanStack Start/Router/Query patterns
  /supabase                  Supabase Auth, Postgres, RLS patterns
  /testing                   Vitest and Playwright testing patterns
  /playwright-cli            Browser automation CLI commands

Built-in:
  /help                      Claude Code CLI help
  /compact                   Compress conversation context
  /skills                    List all loaded skills
  /agents                    List all loaded agents

Agents (dispatched automatically by skills):
  Product Owner (Opus)       Requirements, issues           read-only
  Architect (Opus)           Design, data flow, diagrams    read-only
  Implementer (Opus)         Production code, slice by slice writes code
  Reviewer (Sonnet)          Code review                    read-only
  QA (Sonnet)                Tests and edge cases           writes code
  DevOps (Sonnet)            CI/CD pipelines and infra      writes code

Auto-loaded Skills (used by agents, not invoked directly):
  typescript-rules           No any, Zod validation, error handling
  react-rules                Named exports, TanStack Query, no useEffect fetch
  database-rules             Migrations, RLS, query patterns
  uiux                       Dark theme design system, component classes
──────────────────────────────────────
```

Do NOT add any commentary before or after. Just display the message.
