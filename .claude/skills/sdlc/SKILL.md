---
name: sdlc
description: Show SDLC pipeline status dashboard
user_invocable: true
---

# SDLC Pipeline Status

Display the current state of the development pipeline.

## Gather Data

Collect the following information:

### Git Status
```bash
git branch --show-current
git status --short
git log --oneline -5
```

### Quality Status
Run from `apps/web/`:
```bash
npm run typecheck 2>&1 | tail -1
npm run lint 2>&1 | tail -1
```

### CI Status
```bash
gh run list --limit 3
```

### Open PRs
```bash
gh pr list --state open
```

### Open Issues
```bash
gh issue list --state open --limit 5
```

## Display Dashboard

Output a formatted dashboard:

```
========================================
  SDLC Pipeline Status
========================================

Branch:    <current branch>
Status:    <clean / N uncommitted changes>
Last CI:   <pass/fail — run ID>

Quality Gates:
  typecheck:  PASS / FAIL
  lint:       PASS / FAIL

Recent Commits:
  <last 5 commits>

Open PRs:
  <list or "none">

Open Issues:
  <list or "none">
========================================
```
