#!/bin/sh

if [ -n "${VERCEL_GIT_COMMIT_SHA:-}" ] && [ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ]; then
  exit 1
fi

BASE_SHA=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
TARGET_SHA=${VERCEL_GIT_COMMIT_SHA:-HEAD}

git cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null || exit 1
git cat-file -e "${TARGET_SHA}^{commit}" 2>/dev/null || exit 1

git diff --quiet "$BASE_SHA" "$TARGET_SHA" -- . \
  ':!*.md' \
  ':!**/*.md' \
  ':!**/__tests__/**' \
  ':!**/*.test.*' \
  ':!**/*.spec.*' \
  ':!.claude/**' \
  ':!.codex/**' \
  ':!.cursor/**' \
  ':!.github/**' \
  ':!.vscode/**' \
  ':!docs/**' \
  ':!e2e/**' \
  ':!.coderabbit.yaml' \
  ':!crowdin.yml' \
  ':!knip.json' \
  ':!playwright.config.ts' \
  ':!renovate.json' \
  ':!vitest.config.ts' \
  ':!vitest.setup.ts'
