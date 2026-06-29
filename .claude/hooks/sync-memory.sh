#!/usr/bin/env bash
# Post-tool hook: auto-commit and push memory/ changes after Edit or Write
set -euo pipefail

# Data dir is PAI_DATA_DIR if set, otherwise fall back to the pai-core repo root
CORE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DATA_ROOT="${PAI_DATA_DIR:-$CORE_ROOT}"

MEMORY_ROOT="$DATA_ROOT/memory"

# Read tool input from stdin, extract file_path
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Exit if no file_path or not under memory/
[[ -z "$FILE_PATH" ]] && exit 0
[[ "$FILE_PATH" != "$MEMORY_ROOT/"* ]] && exit 0

cd "$DATA_ROOT"

# Exit if no uncommitted changes to this file
git diff --quiet -- "$FILE_PATH" && git diff --cached --quiet -- "$FILE_PATH" && exit 0

RELATIVE_PATH="${FILE_PATH#$DATA_ROOT/}"
git add "$FILE_PATH"
git commit -m "memory: auto-sync $RELATIVE_PATH" --no-verify
git push || true