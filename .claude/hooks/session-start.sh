#!/usr/bin/env bash
# Hook: SessionStart
# Assigns a unique task list ID per Claude Code session
set -euo pipefail

TASK_ID="session-$(date +%s)-$$"

if [[ -n "${CLAUDE_ENV_FILE:-}" ]]; then
  echo "export CLAUDE_CODE_TASK_LIST_ID=\"$TASK_ID\"" >> "$CLAUDE_ENV_FILE"
fi

echo "Task session: $TASK_ID"
