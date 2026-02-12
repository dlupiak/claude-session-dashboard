#!/usr/bin/env bash
# Hook: SessionStart
# Sets CLAUDE_CODE_TASK_LIST_ID based on current git branch for per-branch task sessions
set -euo pipefail

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# Sanitize branch name for use as task list ID
TASK_ID=$(echo "$BRANCH" | tr '/' '-' | tr -cd '[:alnum:]-_')

# Write to CLAUDE_ENV_FILE so the variable propagates to the Claude Code session
if [[ -n "${CLAUDE_ENV_FILE:-}" ]]; then
  echo "export CLAUDE_CODE_TASK_LIST_ID=\"$TASK_ID\"" >> "$CLAUDE_ENV_FILE"
fi

echo "Task session: $TASK_ID (branch: $BRANCH)"
