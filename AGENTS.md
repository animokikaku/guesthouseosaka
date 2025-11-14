# Repository Guidelines

## Project Structure & Module Organization
- `app/` drives the Next.js App Router; page-level logic lives in locale folders under `app/[locale]` and shared layout in `app/layout.tsx`.
- `components/` contains reusable UI (including `components/ui` for primitives) plus navigation shells; update `lib/config.ts` for site metadata consumed here.
- `hooks/` and `lib/` hold client utilities, types, and config; keep shared logic here rather than inside route files.
- `messages/` and `i18n/` power localization; each locale JSON mirrors the keys used in `messages/en.json`, and assets belong in `public/`.

## Build, Test, and Development Commands
- `bun install` installs dependencies (Bun lockfile is canonical); if you need npm, run `npm install` but commit no new lockfile.
- `bun dev` starts the local server on http://localhost:3000.
- `bun lint` runs ESLint via `eslint.config.mjs`; fix issues with `bun lint --fix`.
- `bun run build` produces a production build; `bun start` serves the compiled app.

## Coding Style & Naming Conventions
- TypeScript is required; keep `.tsx` for components and prefer named exports for shared utilities.
- Prettier enforces single quotes, no semicolons, and Tailwind class sorting; run `bunx prettier --write .` before large patches.
- Use 2-space indentation, camelCase for variables/functions, PascalCase for React components, and kebab-case route segments.

## Testing Guidelines
- No automated suite exists yet; add tests alongside features using Jest or Testing Library under `__tests__/` or `*.test.tsx`.
- For manual QA, verify locale switches (`messages/*`) and responsive states by exercising the navigation (mobile + desktop) in `bun dev`.
- Document any new test command in `package.json` and update this guide when adopting it.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`) as seen in history; scope optional but encouraged.
- One logical change per commit; include updated screenshots or GIFs for UI tweaks in PR descriptions.
- Pull requests should link tracking issues, summarize locale/domain shifts, and note any config or content updates in `lib/config.ts` or `messages/*`.

## Localization & Content Updates
- Keep locale JSON keys consistent; regenerate derived `*.d.json.ts` files when adding translations.
- When adjusting external links or SEO fields, update `lib/config.ts` and re-check social previews via `bun run build`.
