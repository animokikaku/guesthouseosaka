#!/bin/sh

git diff --quiet HEAD^ HEAD -- . \
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
