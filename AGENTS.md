# AGENTS.md

Next.js guesthouse website with Sanity CMS, internationalization (en/ja/fr), and embedded Studio.

## Package Manager

Use `bun` exclusively. The version is pinned in `package.json`, and the lockfile is `bun.lock`.

## Commands

```bash
bun install          # Install dependencies
bun dev              # Dev server at localhost:3000
bun run build        # Production build (run before PRs)
bun run typegen      # Regenerate Sanity types after schema changes
bun run test --run   # Run tests once without watch mode
bun run knip         # Detect unused deps/exports
bun run check        # Generate Next.js types, lint, and run TypeScript checks
bun run format:check # Check formatting without modifying files
```

## Key Rules

- Use the `vercel-react-best-practices` skill when writing, reviewing, or refactoring React or Next.js code
- Use the `web-design-guidelines` skill when auditing UI, UX, or accessibility
- Follow Conventional Commits, including `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `perf:`, `ci:`, and `build:`
- Put all user-facing strings in `messages/en.json`; never hardcode them in components
- Keep `messages/fr.json` and `messages/ja.json` structurally synchronized with `messages/en.json`

## Change Boundaries

- Keep changes narrowly scoped to the user's request
- Preserve unrelated working-tree changes
- Ask before adding a production dependency
- Do not commit, push, deploy, or open a pull request unless the user explicitly requests it

## Validation

- Routine code changes: run `bun run check` and the relevant tests
- Formatting: run `bun run format:check`
- Sanity schema or query changes: run `bun run typegen`
- User-facing flow changes: run the relevant Playwright tests with `bun run test:e2e`
- Before a pull request: run `bun run build`

## Documentation

- [Architecture & Project Structure](docs/architecture.md)
- [Sanity Workflow](docs/sanity-workflow.md)
- [Internationalization](docs/i18n.md)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
