# CLAUDE.md

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
