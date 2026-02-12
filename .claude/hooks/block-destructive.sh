#!/usr/bin/env bash
# Hook: PreToolUse (Bash)
# Block destructive commands: rm -rf /, force push main, DROP TABLE
set -euo pipefail

# The command is passed via stdin as JSON from Claude Code hooks
# Read the tool input from stdin
INPUT=$(cat)

# Extract the command from the JSON input
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || echo "")

if [[ -z "$COMMAND" ]]; then
  exit 0
fi

# Block rm -rf / or rm -rf /*
if echo "$COMMAND" | grep -qE 'rm\s+-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*\s+/($|\s|\*)'; then
  echo "BLOCKED: 'rm -rf /' is not allowed."
  exit 2
fi

# Block force push to main/master
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*--force.*\s+(main|master)'; then
  echo "BLOCKED: Force push to main/master is not allowed."
  exit 2
fi
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*\s+(main|master)\s+.*--force'; then
  echo "BLOCKED: Force push to main/master is not allowed."
  exit 2
fi

# Block DROP TABLE / DROP DATABASE
if echo "$COMMAND" | grep -qiE 'DROP\s+(TABLE|DATABASE)'; then
  echo "BLOCKED: DROP TABLE/DATABASE is not allowed."
  exit 2
fi

exit 0
