---
name: feature
description: Full SDLC workflow — plan, implement, review, test, PR
user_invocable: true
arguments:
  - name: story-id
    description: "Story ID (e.g., CHAT-001)"
    required: true
  - name: description
    description: "Short feature description"
    required: false
---

# Feature Development Workflow

You are executing the full SDLC pipeline for story **$ARGUMENTS.story-id**.

## Steps

### 1. Plan
- Read the story from `stories/` if it exists
- Read existing architecture designs from `docs/designs/` if available
- Use the `architect` agent (Task tool, subagent_type=architect) to design the implementation
- Present the plan and get user approval before proceeding

### 2. Implement
- Create a feature branch: `feature/$ARGUMENTS.story-id-description`
- Implement slice-by-slice following Vertical Slice Architecture
- Each slice: route → server functions → queries → UI
- Run `npm run typecheck` and `npm run lint` after each file change
- Preload skills: tanstack-start, supabase

### 3. Review and Quality
- Run `/review` — this runs quality gates first (typecheck, lint, test, build), then code review
- All quality gates must pass before the code review runs
- Fix any issues found, then re-run `/review` until clean

### 4. PR
- Commit all changes with a descriptive message
- Push the feature branch
- Create PR via `gh pr create` targeting `main`
- Report the PR URL

## Rules
- Follow CLAUDE.md conventions exactly
- Never skip quality checks
- One slice at a time — verify before moving to next
