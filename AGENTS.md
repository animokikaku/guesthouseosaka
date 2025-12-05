# Repository Guidelines

## Project Structure & Module Organization

Use the Next.js App Router under `app/[locale]` for all page logic, keeping shared wrappers inside `app/layout.tsx`. Reusable UI, layout shells, and primitives live in `components/` (with atoms in `components/ui`). Place shared hooks, configs, and helpers inside `hooks/` and `lib/`, and keep locale JSON plus translation helpers inside `messages/` and `i18n/`. Static assets belong strictly in `public/`. Co-locate any new tests beside their feature files or under `__tests__/` to match the surrounding code.

## Build, Test, and Development Commands

Install dependencies with `bun install` (the Bun lockfile is canonical; avoid adding an npm lock). Run `bun dev` to serve the app on http://localhost:3000, and keep `bun run build` handy for production-style checks before a PR. Execute `bun lint` to run ESLint via `eslint.config.mjs`; apply fixes with `bun lint --fix`. `bun start` boots the already-built output. When adding scripts or manual QA steps, document the workflow in `README.md`.

## Coding Style & Naming Conventions

All application code is TypeScript; use `.tsx` for components and prefer named exports for anything reusable. Follow 2-space indentation, camelCase for variables/functions, PascalCase for React components, and kebab-case for route folders. Prettier enforces single quotes, no semicolons, and Tailwind class sorting—run `bunx prettier --write .` before sending larger patches. Keep logic inside shared modules instead of embedding utilities inside route files.

## Testing Guidelines

There is no global test suite yet, so add Jest or Testing Library specs under `__tests__/` or `*.test.tsx` near the feature you touch. Manual QA should always cover locale switching (`messages/*`) and responsive navigation states via `bun dev`. If you introduce a new testing tool or npm script, record it in `package.json` and note it here for the next contributor.

## Commit & Pull Request Guidelines

Use Conventional Commits such as `feat: booking widget` or `fix: locale switch`. Keep commits focused on one logical change. Pull requests must link the relevant issue, summarize any locale or content shifts, and call out updates to `lib/config.ts` or translation files. Include screenshots or GIFs whenever UI changes impact layout, navigation, or localization behavior, and mention any manual verification performed.

## Localization & Content Notes

Translation IDs are extracted from the source code and auto-generated, so keep user-facing copy inline and avoid manually editing IDs in `messages/*`. Ensure every locale file mirrors `messages/en.json`, and regenerate derived `*.d.json.ts` assets when translation keys change. When editing SEO fields or external links, update `lib/config.ts` and verify previews with `bun run build`.
