# Repository Guidelines

## Project Structure & Module Organization

- App logic lives in `app/[locale]`; shared wrappers stay in `app/layout.tsx` and route folders use kebab-case.
- UI shells and primitives sit in `components/` (atoms in `components/ui`); keep pages lean by reusing these pieces.
- Shared hooks/config/helpers belong to `hooks/` and `lib/`; translation utilities and locale JSON live in `i18n/` and `messages/`.
- Static assets reside only in `public/`; avoid bundling local images elsewhere.
- Place tests beside features or under `__tests__/` to mirror the structure you touch.

## Build, Test, and Development Commands

- `bun install` installs dependencies (the canonical lockfile is `bun.lock`; avoid npm/pnpm/yarn locks).
- `bun dev` serves http://localhost:3000 for local QA, including locale toggles and responsive nav checks.
- `bun run build` performs a production-style build; run before PRs to catch config or env gaps.
- `bun lint` runs ESLint via `eslint.config.mjs`; apply fixes with `bun lint --fix`.
- `bun start` runs the already-built output; use after `bun run build` when staging or debugging SSR.
- Document any new scripts or manual QA steps in `README.md`.

## Coding Style & Naming Conventions

- TypeScript everywhere; components use `.tsx` and prefer named exports for reuse.
- 2-space indentation; camelCase for functions/vars, PascalCase for components, kebab-case for route segments.
- Prettier enforces single quotes, no semicolons, and Tailwind class sorting—run `bunx prettier --write .` before larger patches.
- Keep logic in shared modules rather than embedding utilities in route files; align with existing directory boundaries.

## Testing Guidelines

- No global suite yet; add Jest or Testing Library specs as `*.test.tsx` or under `__tests__/` near the feature you modify.
- Focus tests on behavior, mocking network/intl pieces as needed; run the tests you add.
- Manual QA must cover locale switching (`messages/*`) and responsive navigation states while running `bun dev`.
- Record any new testing tools or npm scripts in `package.json` and note the workflow in `README.md`.

## Commit & Pull Request Guidelines

- Follow Conventional Commits (e.g., `feat: booking widget`, `fix: locale switch`) and keep each change focused.
- PRs should link relevant issues, summarize locale/content updates, and call out changes to `lib/config.ts` or translation files.
- Include screenshots or GIFs for UI/layout changes and note manual verification steps (desktop/mobile, locales, key flows).
- Ensure build and lint pass before requesting review.

## Localization & Content Notes

- Translation IDs are auto-generated from source; keep user-facing copy inline and avoid editing IDs in `messages/*`.
- Keep every locale file aligned with `messages/en.json` and regenerate derived `*.d.json.ts` assets when keys change.
- Update `lib/config.ts` when adjusting SEO fields or external links, and validate with `bun run build`.
