#!/usr/bin/env bash
# Hook: TaskCompleted
# Quality gate: typecheck + lint must pass after task completion
set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
APP_DIR="$PROJECT_DIR/apps/web"

if [[ ! -d "$APP_DIR" ]]; then
  exit 0
fi

cd "$APP_DIR"

ERRORS=0

echo "=== Quality Gate: Post-Task Check ==="

# Typecheck
echo "Running typecheck..."
if ! npx tsc --noEmit 2>&1 | tail -5; then
  echo "FAIL: TypeScript errors found"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS: typecheck"
fi

# Lint
echo "Running lint..."
if ! npx eslint src/ --quiet 2>&1 | tail -5; then
  echo "FAIL: Lint errors found"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS: lint"
fi

echo "=== Quality Gate Complete: $ERRORS failures ==="

# Hard-block: exit 1 when quality checks fail
if [[ $ERRORS -gt 0 ]]; then
  echo "BLOCKED: Fix $ERRORS quality gate failure(s) before completing task."
  exit 1
fi

exit 0
