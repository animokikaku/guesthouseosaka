# Guest House Osaka

[![codecov](https://codecov.io/gh/animokikaku/guesthouseosaka/graph/badge.svg?token=JT5SUWPQK3)](https://codecov.io/gh/animokikaku/guesthouseosaka)

A multilingual website for a guest house in Osaka, built with Next.js and Sanity CMS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **CMS**: Sanity v5 with embedded Studio at `/studio`
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl (English, Japanese, French)
- **Forms**: TanStack React Form + Zod validation
- **UI Components**: Radix UI primitives (shadcn/ui)
- **Email**: Resend + React Email
- **Maps**: Google Maps via @vis.gl/react-google-maps

## Getting Started

```bash
bun install    # Install dependencies
bun dev        # Start dev server at http://localhost:3000
```

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `bun dev`          | Start development server           |
| `bun run build`    | Production build                   |
| `bun lint`         | Run ESLint                         |
| `bun run typegen`  | Regenerate Sanity TypeScript types |
| `bun run test`     | Run unit tests (Vitest)            |
| `bun run test:e2e` | Run E2E tests (Playwright)         |
| `bun run knip`     | Detect unused code/dependencies    |

## Project Structure

```
app/
  [locale]/           # Locale-based routing (en, ja, fr)
    [house]/          # Dynamic house pages with gallery
    contact/          # Contact forms
    faq/              # FAQ page
  studio/             # Embedded Sanity Studio
  api/                # API routes

components/
  forms/              # Form components
  gallery/            # Gallery components
  house/              # House-specific components
  map/                # Google Maps integration
  ui/                 # Radix-based UI primitives

sanity/
  schemaTypes/        # Sanity document and object schemas
  lib/                # GROQ queries and utilities

messages/             # Translation files (en.json, ja.json, fr.json)
```

## Environment Variables

Varlock is the source of truth for env config via `.env.schema`.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Sensitive values are loaded from `pass` through the schema.
Override `NEXT_PUBLIC_APP_URL` in deployment environments like Vercel.

## Sanity Workflow

1. Edit schemas in `sanity/schemaTypes/`
2. Regenerate types: `bun run typegen`
3. Access Studio at `/studio`
