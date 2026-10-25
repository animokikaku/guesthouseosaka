# Architecture & Project Structure

## Directory Layout

```
app/                   # TanStack Start source directory
├── routes/            # File routes (routeTree.gen.ts is generated from them)
│   ├── __root.tsx     # Document shell
│   ├── $locale/       # Locale-prefixed pages (en, ja, fr, zh-cn, zh-tw)
│   └── api/           # Draft mode endpoints
├── router.tsx         # Router options (preloading, stale times)
├── start.ts           # Request middleware: redirects, locale detection, CSRF
└── actions/           # Contact form server function

components/
├── ui/                # BaseUI shadcn primitives
├── house/             # House/room feature components
├── gallery/           # Gallery components
├── forms/             # Forms with @tanstack/react-form + Zod
└── map/               # Map components

sanity/
├── schemaTypes/       # Document and block type definitions
└── lib/queries.ts     # GROQ queries using defineQuery()

messages/              # Translation JSON files (en, ja, fr, zh-CN, zh-TW)
lib/                   # Shared utilities and config
hooks/                 # Custom React hooks
public/                # Static assets only
```

## Key Patterns

### Routing

- All pages under `app/routes/$locale/`; the `$locale` route parses the URL prefix
  (`/zh-cn`) into its locale code (`zh-CN`) and stringifies it back for links
- Links are typed TanStack Router `Link`s: `to="/$locale/$house" params={{ locale, house }}`
- Unknown houses and contact types throw `notFound()`, rendered inside the locale layout
- The house gallery opens as a modal through route masking (`components/house/gallery-link.ts`):
  the address bar shows `/gallery`, and a reload or shared link opens the full page
- Legacy redirects and locale detection for unprefixed paths live in `lib/redirects.ts`,
  applied by the request middleware in `app/start.ts`
- Navigations crossfade with view transitions (`defaultViewTransition`); the gallery modal
  opts out, since its dialog and lightbox animate themselves
- Route folders use kebab-case

### Data

- Each route's `loader` calls one GET server function in `sanity/lib/loaders.functions.ts`,
  which runs a fixed set of queries server-side; never accept a GROQ query from the client
- Published content comes from Sanity's API CDN and is kept in the Worker's Cache API for a
  minute, then served stale while it refreshes (`lib/edge-cache.server.ts`); responses also
  carry `s-maxage` for browsers and any CDN in front
- Draft mode is a signed cookie set by `/api/draft-mode/enable`; it switches queries to the
  token client with stega and loads Visual Editing on demand

### Components

- Named exports for reusable components
- UI primitives in `components/ui/`, feature components grouped by domain

### Forms

- Built with `@tanstack/react-form` v2 and Zod validation
- `forms/app-form.tsx` registers the field components with `createFormHook`, so
  `form.Field` render props expose them typed against the field's value
- Schemas run as form-level validators (`validators: [{ run: schema, triggers: [] }]`),
  which validate on submit and route errors to the matching fields
- Sections reused across forms are field groups created with `defineAppFieldGroup`,
  bound to concrete paths by the caller

### Hosting

- Cloudflare Workers, through `@cloudflare/vite-plugin` and `wrangler.jsonc`: `bun dev` and
  `bun run start` (a preview of the build) both run the server in workerd
- `bun run deploy` builds for the `production` environment and deploys the `guesthouseosaka`
  Worker (named explicitly in `wrangler.jsonc`); `bun run deploy:preview`
  uploads a preview version. Only `production` sets `DEPLOY_ENV=production`, which lets the
  contact form email the houses' inboxes
- Secrets are set with `wrangler secret put`; locally they come from `.env.local`
- Workers Cache (`cache.enabled` in `wrangler.jsonc`) serves pages and server-function GETs
  from Cloudflare's cache by their `Cache-Control`, without running the Worker; check
  `Cf-Cache-Status`. Responses carry `Vary: Cookie` for draft mode (see `lib/cache-control.ts`)
- Hashed build assets are served as immutable (`public/_headers`)
- Deployments are manual for now: check a preview with
  `BASE_URL=<preview URL> bun run test:e2e:preview`, which sends one real contact email to
  Resend's test inbox
- The repository is still connected to Vercel for the Next.js site on `main`; `vercel.json`
  here skips every Vercel build of this branch
- `generated/cn-tables.ts` (class-merge tables) is written on `bun install` and kept current by
  the Vite plugin

### Environment

- Type-safe env via `@t3-oss/env-core` in `lib/env.ts`; Vite exposes `NEXT_PUBLIC_*` to the
  client (see `envPrefix` in `vite.config.ts`), server variables are the Worker's vars and
  secrets, read at runtime through `process.env`
- Server: `SANITY_API_READ_TOKEN`, `RESEND_API_KEY`, `DEPLOY_ENV`
- Client: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_BLOB_STORAGE_URL`
