#!/usr/bin/env bash
# Hook: Stop
# Block stop if TypeScript errors exist in staged/modified files
set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
APP_DIR="$PROJECT_DIR/apps/web"

# Skip if apps/web doesn't exist (e.g. running from repo root without app)
if [[ ! -d "$APP_DIR" ]]; then
  exit 0
fi

cd "$APP_DIR"

# Run typecheck; exit 1 to block stop on type errors
if ! npx tsc --noEmit --pretty 2>&1 | head -20; then
  echo "BLOCKED: TypeScript errors detected. Fix before ending session."
  exit 1
fi

exit 0
