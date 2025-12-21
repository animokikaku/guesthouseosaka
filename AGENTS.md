# Repository & Sanity Agent Guide

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

# Sanity Workflow

This is a Sanity-powered project. Follow these steps whenever work touches Studio, schemas, GROQ, or content flows.

1. Identify the relevant topic in the Knowledge Router table below and read the rule file (or pull rules via the Sanity MCP server).
2. Apply those rules as you code—keep Studio files aligned with schema.
3. After schema edits: run TypeGen, and then proceed with content operations.

## Commands Cheat Sheet

```bash
# MCP Setup
bunx sanity@latest mcp configure  # Configure MCP for your AI editor

# Schema & Types
bunx sanity schema deploy     # Deploy schema to Content Lake (REQUIRED before MCP!)
bunx sanity schema extract    # Extract schema for TypeGen
bunx sanity typegen generate  # Generate TypeScript types

# Development
bunx sanity dev               # Start Studio dev server
bunx sanity build             # Build Studio for production
bunx sanity deploy            # Deploy Studio to Sanity hosting

# Help
bunx sanity docs search "query"  # Search Sanity documentation
bunx sanity --help               # List all CLI commands
```

## Knowledge Router

If the Sanity MCP server (`https://mcp.sanity.io`) is available, use `list_sanity_rules` and `get_sanity_rules` for fresh guidance. Otherwise, use this table:

| Topic                  | Trigger Keywords                                                                           | Rule File                            |
| :--------------------- | :----------------------------------------------------------------------------------------- | :----------------------------------- |
| **Project Structure**  | `structure`, `monorepo`, `embedded studio`, `file naming`                                  | `rules/sanity-project-structure.mdc` |
| **Onboarding**         | `start`, `setup`, `init`, `new project`                                                    | `rules/sanity-get-started.mdc`       |
| **Schema**             | `schema`, `model`, `document`, `field`, `defineType`                                       | `rules/sanity-schema.mdc`            |
| **Deprecation**        | `deprecate`, `remove field`, `legacy`, `migration`                                         | `rules/sanity-schema.mdc`            |
| **Import/Migration**   | `import`, `wordpress`, `html`, `markdown`, `migrate`                                       | `rules/sanity-migration.mdc`         |
| **Next.js**            | `next.js`, `app router`, `server component`, `fetch`                                       | `rules/sanity-nextjs.mdc`            |
| **Nuxt**               | `nuxt`, `vue`, `nuxt.js`                                                                   | `rules/sanity-nuxt.mdc`              |
| **Astro**              | `astro`, `islands`                                                                         | `rules/sanity-astro.mdc`             |
| **Remix/React Router** | `remix`, `react router`, `loader`                                                          | `rules/sanity-remix.mdc`             |
| **Svelte**             | `svelte`, `sveltekit`, `kit`                                                               | `rules/sanity-svelte.mdc`            |
| **Visual Editing**     | `stega`, `visual editing`, `clean`, `overlay`, `presentation`, `usePresentationQuery`      | `rules/sanity-visual-editing.mdc`    |
| **Page Builder**       | `page builder`, `pageBuilder`, `block component`, `alignment`, `switch render`             | `rules/sanity-page-builder.mdc`      |
| **Rich Text**          | `portable text`, `rich text`, `block content`, `serializer`, `PTE`, `marks`, `annotations` | `rules/sanity-portable-text.mdc`     |
| **Images**             | `image`, `urlFor`, `crop`, `hotspot`, `lqip`                                               | `rules/sanity-image.mdc`             |
| **Studio Structure**   | `structure`, `desk`, `sidebar`, `singleton`, `grouping`                                    | `rules/sanity-studio-structure.mdc`  |
| **Localization**       | `i18n`, `translation`, `localization`, `language`, `multilingual`, `localized singleton`   | `rules/sanity-localization.mdc`      |
| **SEO**                | `seo`, `metadata`, `sitemap`, `og image`, `open graph`, `json-ld`, `redirect`              | `rules/sanity-seo.mdc`               |
| **Shopify/Hydrogen**   | `shopify`, `hydrogen`, `e-commerce`, `storefront`, `sanity connect`                        | `rules/sanity-hydrogen.mdc`          |
| **GROQ**               | `groq`, `query`, `defineQuery`, `projection`, `filter`, `order`                            | `rules/sanity-groq.mdc`              |
| **TypeGen**            | `typegen`, `typescript`, `types`, `infer`, `satisfies`, `type generation`                  | `rules/sanity-typegen.mdc`           |

## Agent Behavior

- Specialize in **Structured Content**, **GROQ**, and **Sanity Studio** configuration.
- Write best-practice, type-safe code using **Sanity TypeGen**.
- Build scalable content platforms, not just websites.
- Detect the framework from `package.json` and consult the matching rule file before coding.

## MCP Server (Preferred for Content Operations)

Always use MCP tools instead of writing ad-hoc scripts:

| Tool                            | Use For                       |
| ------------------------------- | ----------------------------- |
| `query_documents`               | Run GROQ queries              |
| `create_document_from_markdown` | Create content from markdown  |
| `patch_document`                | Modify existing documents     |
| `deploy_schema`                 | Deploy schema to Content Lake |
| `get_schema`                    | Inspect deployed schema       |
| `transform_image`               | Edit images with AI           |

**Critical:** Deploy schema before content operations and run TypeGen after schema or query changes.

## Boundaries

- **Always:** use `defineQuery` for GROQ; run `deploy_schema` after schema changes; keep Studio files synced before content ops; follow the Deprecation Pattern (ReadOnly → Hidden → Deprecated); run TypeGen after schema or query changes; prefer MCP for query/create/update/patch.
- **Ask First:** before touching `sanity.config.ts` or deleting any schema definition file.
- **Never:** hardcode API tokens (use `process.env`); use loose types (`any`) for Sanity content; generate NDJSON import scripts for simple content tasks (use MCP).

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
