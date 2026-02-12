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

Getting Started:
  1. Bootstrap — describe your app in one big prompt,
     let Claude build the foundation (routing, auth, DB, CI, deploy)
  2. Then use the pipeline below to add features one at a time

Pipeline:
  1. Define       /open-issue <desc>     Clarifying Qs → GitHub issue with ACs
  2. Design       (automatic)            Architect agent → design doc in docs/designs/
  3. Implement    /feature <STORY-ID>    Feature branch → slice-by-slice code
  4. Review       /review                Quality gates → code review
  5. Ship         (automatic)            Commit → PR → CI checks
  6. Iterate      /fix-ci [run-id]       Fix failures, re-run /review until green

Other Commands:
  /fix-issue <number>    Fix a GitHub issue end-to-end
  /investigate <url>     Browser inspection (screenshots, console, network)
  /sdlc                  Pipeline status dashboard
  /workflow              This help message

Built-in:
  /help                  Claude Code CLI help
  /compact               Compress conversation context
  /skills                List all loaded skills
  /agents                List all loaded agents

Agents:
  Product Owner (Opus)     Requirements, issues           read-only
  Architect (Opus)         Design, data flow, diagrams    read-only
  Implementer (Opus)       Production code, slice by slice writes code
  Reviewer (Sonnet)        Code review                    read-only
  QA (Sonnet)              Tests and edge cases           writes code
  DevOps (Sonnet)          CI/CD pipelines and infra      writes code
──────────────────────────────────────
```

Do NOT add any commentary before or after. Just display the message.
