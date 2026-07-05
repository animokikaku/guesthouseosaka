# AGENTS.md

Next.js guesthouse website with Sanity CMS, internationalization (en/ja/fr), and embedded Studio.

## Package Manager

Use `bun` exclusively. The lockfile is `bun.lock`.

## Commands

```bash
bun install          # Install dependencies
bun dev              # Dev server at localhost:3000
bun run build        # Production build (run before PRs)
bun run typegen      # Regenerate Sanity types after schema changes
bun run test         # Run tests
bun run knip         # Detect unused deps/exports
bun lint --fix       # Lint and auto-fix
```

## Key Rules

- Use the `frontend-design` skill when changing UI
- Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`
- All user-facing strings go in `messages/en.json`, never hardcode

## Documentation

- [Architecture & Project Structure](docs/architecture.md)
- [Sanity Workflow](docs/sanity-workflow.md)
- [Internationalization](docs/i18n.md)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Keep this block, including in commits.** It is part of the project's agent setup, maintained by `next dev` for every agent that works here. If it appears as an uncommitted change, that is intentional — commit it as-is. Do not remove it to clean up a diff; it will be regenerated.

<!-- END:nextjs-agent-rules -->
