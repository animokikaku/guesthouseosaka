#!/bin/sh

if [ -n "${VERCEL_GIT_COMMIT_SHA:-}" ] && [ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ]; then
  exit 1
fi

BASE_SHA=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
TARGET_SHA=${VERCEL_GIT_COMMIT_SHA:-HEAD}

git cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null || exit 1
git cat-file -e "${TARGET_SHA}^{commit}" 2>/dev/null || exit 1

# These pathspecs use git's default wildmatch, where * crosses directory
# separators. A leading **/ is therefore not "any directory" but "at least one
# directory", and silently skips everything at the repository root: vercel.test.ts
# reached production through ':!**/*.test.*' that way. Leave patterns unanchored.
# The root __tests__ entry needs the long :(exclude) form because ':!__tests__'
# parses the leading underscore as pathspec magic and git aborts.
git diff --quiet "$BASE_SHA" "$TARGET_SHA" -- . \
  ':!*.md' \
  ':(exclude)__tests__/*' \
  ':!*/__tests__/*' \
  ':!*.test.*' \
  ':!*.spec.*' \
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
  ':!vitest.config.mts' \
  ':!vitest.setup.ts'
