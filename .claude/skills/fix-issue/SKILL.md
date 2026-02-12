---
name: fix-issue
description: Fix a GitHub issue end-to-end
user_invocable: true
arguments:
  - name: number
    description: "GitHub issue number"
    required: true
---

# Fix GitHub Issue Pipeline

You are orchestrating a bug fix for issue **#$ARGUMENTS.number**. You are the ORCHESTRATOR — delegate implementation and review work to agents.

## Step 1: Understand (you do this directly)

- Fetch issue: `gh issue view $ARGUMENTS.number`
- Read related code to understand the scope
- If unclear, ask the user for clarification

## Step 2: Branch (you do this directly)

```bash
git checkout -b feature/fix-$ARGUMENTS.number
```

## Step 3: Fix (dispatch `implementer` agent)

Use the Task tool to dispatch the implementer:

```
Task(
  subagent_type: "implementer",
  description: "Fix issue #$ARGUMENTS.number",
  prompt: "Fix GitHub issue #$ARGUMENTS.number.

## Issue details:
<paste the full issue details from gh issue view>

## Related code context:
<paste relevant code snippets or file paths you found in step 1>

## Instructions:
- Implement the minimal fix
- Run `npm run typecheck` from apps/web/ after changes
- Follow all conventions in CLAUDE.md
- Return a summary of what was changed and why"
)
```

## Step 4: Quality gates (you run this directly)

```bash
cd apps/web && npm run typecheck
cd apps/web && npm run build
```

If gates fail, dispatch implementer again with error output.

## Step 5: Review (dispatch `reviewer` agent)

```
Task(
  subagent_type: "reviewer",
  description: "Review fix for #$ARGUMENTS.number",
  prompt: "Review the fix for GitHub issue #$ARGUMENTS.number.

## Issue:
<paste issue details>

## Fix summary:
<paste implementer's summary>

Run git diff to see all changes. Check for:
- Correctness of the fix
- No regressions introduced
- TypeScript and React pattern compliance

Return a structured review with severity levels."
)
```

If CRITICAL issues found, dispatch implementer to fix, then re-review.

## Step 6: Commit & PR (you do this directly)

```bash
git add <specific files>
git commit -m "fix: <description> (closes #$ARGUMENTS.number)"
git push -u origin feature/fix-$ARGUMENTS.number
gh pr create --title "fix: <description>" --body "Closes #$ARGUMENTS.number\n\n## Summary\n<what was fixed and why>"
```

Report the PR URL.

## RULES

- **NEVER write the fix yourself** — dispatch the implementer agent
- **NEVER review code yourself** — dispatch the reviewer agent
- You MAY read files and run git/quality commands directly
