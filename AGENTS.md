# AGENTS.md

TanStack Start guesthouse website with Sanity CMS and internationalization (en/ja/fr/zh-CN/zh-TW).

## Package Manager

Use `bun` exclusively. The version is pinned in `package.json`, and the lockfile is `bun.lock`.

## Commands

```bash
bun install          # Install dependencies
bun dev              # Dev server at localhost:3000
bun run build        # Production build (run before PRs)
bun run start        # Preview the build in workerd at localhost:3000
bun run deploy       # Build and deploy the production Worker (Cloudflare)
bun run rooms:deploy # Migrate D1 and deploy the room sync Worker (docs/rooms.md)
bun run typegen      # Regenerate Sanity types after schema changes
bun run test --run   # Run tests once without watch mode
bun run knip         # Detect unused deps/exports
bun run check        # TypeScript checks and lint
bun run format:check # Check formatting without modifying files
```

## Key Rules

- Use the `vercel-react-best-practices` skill when writing, reviewing, or refactoring React code (skip its Next.js-only rules)
- Use the `web-design-guidelines` skill when auditing UI, UX, or accessibility
- React Compiler is enabled: skip manual-memoization advice (`useMemo`, `useCallback`, `memo`) from skills unless profiling shows a need
- Treat skill rules that introduce `swr`, `lru-cache`, or `better-all` as production dependency additions and ask first
- Follow Conventional Commits, including `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `perf:`, `ci:`, and `build:`
- Put all user-facing strings in `messages/en.json`; never hardcode them in components
- Keep `messages/fr.json`, `messages/ja.json`, `messages/zh-CN.json`, and `messages/zh-TW.json` structurally synchronized with `messages/en.json`

## Change Boundaries

- Keep changes narrowly scoped to the user's request
- Preserve unrelated working-tree changes
- Do not commit, push, deploy, or open a pull request unless the user explicitly requests it

## Validation

- Routine code changes: run `bun run check` and the relevant tests
- Formatting: run `bun run format:check`
- Sanity schema or query changes: run `bun run typegen`
- User-facing flow changes: run the relevant Playwright tests with `bun run test:e2e`
- Run the local E2E suite only through its managed server (`bun run test:e2e`, no `BASE_URL`). Pointing `BASE_URL` at a server you started yourself skips the Resend mocks, so form tests send real emails with the key in `.env.local`
- `bun run test:e2e:preview` sends one real email to Resend's test inbox (with the key in `.env.local`); run it only when asked, or when checking the Resend key or sending domain
- Stop a server you started by PID or port (`lsof -ti:<port> | xargs kill`), then check the port is free
- Before a pull request: run `bun run build`

## Skills

- The Playwright skills in `.claude/skills/playwright-*` are vendored from `node_modules/playwright-core/lib/tools/skills/`; after upgrading Playwright, re-sync them instead of editing them
- `.cursor/skills/vercel-react-best-practices` and `.codex/skills/vercel-react-best-practices` are symlinks to `.claude/skills/vercel-react-best-practices`
- Where skills use `npx playwright …` or `npm`, use `bunx playwright …` and `bun`
- Component tests (overrides the generic setup in `playwright-component-testing`): run with `bun run test:components`; config is `playwright.components.config.ts`, the gallery is a standalone Vite server in `playwright/gallery/` on port 3100, specs live in `playwright/components/`, and stories are `*.story.tsx` files next to components in `components/`
- Story ids are the full path from the repo root without `.story.tsx`, plus the export name (`components/gallery/gallery-page-content/WithModal`); unique suffixes are not resolved

## Documentation

- [Architecture & Project Structure](docs/architecture.md)
- [Sanity Workflow](docs/sanity-workflow.md)
- [Internationalization](docs/i18n.md)
- [Testing](docs/testing.md)
- [Room Availability](docs/rooms.md)
