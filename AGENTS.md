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
bun run lint --fix   # Lint and auto-fix
bun run typecheck    # Generate Next.js types and run TypeScript checks
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

- Routine code changes: run `bun run lint`, `bun run typecheck`, and the relevant tests
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

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Keep this block, including in commits.** It is part of the project's agent setup, maintained by `next dev` for every agent that works here. If it appears as an uncommitted change, that is intentional — commit it as-is. Do not remove it to clean up a diff; it will be regenerated.

<!-- END:nextjs-agent-rules -->
