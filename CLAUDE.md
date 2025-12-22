# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Always use the design skill when changing the UI.

## Build, Test, and Development Commands

```bash
bun install          # Install dependencies (use bun.lock, avoid npm/pnpm/yarn)
bun dev              # Start dev server at http://localhost:3000
bun run build        # Production build
bun lint             # ESLint check
bun lint --fix       # ESLint auto-fix
bun run typegen      # Regenerate Sanity TypeScript types after schema changes
bun run knip         # Detect unused dependencies and exports
bunx prettier --write .  # Format code
```

## Architecture Overview

### Next.js App Router with Internationalization
- **Locale-based routing**: All pages live under `app/[locale]/` with three locales: `en` (default), `ja`, `fr`
- **Static params generation**: Locales generate static pages via `generateStaticParams()`
- **Translation files**: `messages/{en,ja,fr}.json` with `next-intl`
- **i18n hooks**: Use `useTranslations('Namespace')` in client components, `await getTranslations('Namespace')` in server components

### Sanity CMS Integration
- **Embedded Studio**: Runs at `/studio` via `app/studio/[[...tool]]/page.tsx`
- **Schema location**: `sanity/schemaTypes/` with document and block types
- **GROQ queries**: `sanity/lib/queries.ts` using `defineQuery()` for type safety
- **Localized content**: Uses `internationalized-array` pattern with `coalesce(field[_key == $locale][0].value, field[_key == "en"][0].value)` fallback
- **Live preview**: `SanityLive` component with Visual Editing support via draft mode

### Component Structure
- **UI primitives**: `components/ui/` (Radix-based shadcn components)
- **Feature components**: `components/house/`, `components/gallery/`, `components/forms/`, `components/map/`
- **Forms**: Built with `@tanstack/react-form` and Zod validation

### Environment Configuration
- Type-safe env via `@t3-oss/env-nextjs` in `lib/env.ts`
- Required server vars: `SANITY_API_READ_TOKEN`, `RESEND_API_KEY`
- Required client vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_BLOB_STORAGE_URL`

## Key Conventions

### Internationalization
- Component namespaces in PascalCase, keys in snake_case
- All user-facing strings must be in `messages/en.json` (never hardcode)
- Use ICU message format for plurals, arguments, and rich text
- Keep all locale files synchronized with `en.json`

### Sanity Workflow
1. Edit schemas in `sanity/schemaTypes/`
2. Deploy schema: `bunx sanity schema deploy`
3. Regenerate types: `bun run typegen`
4. Use MCP tools for content operations when available

### Code Style
- TypeScript with `.tsx` for components
- Single quotes, no semicolons (Prettier config in package.json)
- Named exports for reusable components
- 2-space indentation, camelCase vars, PascalCase components, kebab-case routes

## Commit Guidelines

Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, etc.
