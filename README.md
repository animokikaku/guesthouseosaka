# Guest House Osaka

[![codecov](https://codecov.io/gh/animokikaku/guesthouseosaka/graph/badge.svg?token=JT5SUWPQK3)](https://codecov.io/gh/animokikaku/guesthouseosaka)

A multilingual website for a guest house in Osaka, built with TanStack Start and Sanity CMS.

## Tech Stack

- **Framework**: TanStack Start (Vite) with TanStack Router
- **Hosting**: Cloudflare Workers, with Workers Cache and a Worker Preview for every branch
- **CMS**: Sanity, with one hosted Studio per dataset (`production`, `development`)
- **Styling**: Tailwind CSS v4
- **i18n**: use-intl (English, Japanese, French, Simplified Chinese, Traditional Chinese)
- **Forms**: TanStack React Form + Zod validation
- **UI Components**: Base UI primitives (shadcn/ui)
- **Email**: Resend + React Email
- **Maps**: Google Maps via @vis.gl/react-google-maps

## Getting Started

```bash
cp .env.example .env.local   # Fill in the keys
bun install
bun dev                      # http://localhost:3000
```

## Scripts

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `bun dev`                 | Start the dev server                         |
| `bun run build`           | Production build                             |
| `bun run start`           | Serve the build in workerd at localhost:3000 |
| `bun run check`           | Type check and lint                          |
| `bun run typegen`         | Regenerate Sanity types                      |
| `bun run test`            | Unit tests (Vitest)                          |
| `bun run test:e2e`        | E2E tests against a local build (Playwright) |
| `bun run test:components` | Component tests (Playwright)                 |
| `bun run knip`            | Detect unused code and dependencies          |
| `bun run studio:deploy`   | Deploy the development Studio                |

## Deployment

Workers Builds deploys `main` to guesthouseosaka.com and every other branch to a Worker Preview
on the `development` dataset. The production Studio deploys from GitHub Actions when its files change
on `main`; the development Studio is deployed by hand with `bun run studio:deploy`.

## Project Structure

```
app/
  routes/
    $locale/          # Locale-based routing (en, ja, fr, zh-cn, zh-tw)
      $house/         # House pages and galleries
      contact/        # Contact forms
      faq.tsx         # FAQ page
    api/              # Draft mode
  actions/            # Server functions (contact form)
  start.ts            # Request middleware (redirects, /studio)

components/           # UI, forms, gallery, house and map components
lib/                  # Config, environment, metadata and helpers
sanity/
  schemaTypes/        # Document and object schemas
  lib/                # GROQ queries and utilities
messages/             # Translations (en, ja, fr, zh-CN, zh-TW)
```

See [docs/](docs/) for architecture, the Sanity workflow, i18n and testing.
