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
- Array fields that Presentation edits optimistically render through `OptimisticArray`, which
  loads Visual Editing's mutator only in draft mode

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
  Worker (named explicitly in `wrangler.jsonc`) on the animokikaku account; `bun run
  deploy:preview` creates a Worker Preview, which Workers Builds runs for every other branch.
  Only `production` sets `DEPLOY_ENV=production`, which lets the contact form email the houses'
  inboxes; the `preview` environment sends to Resend's test inbox
- Secrets are set with `wrangler secret put`; locally they come from `.env.local`
- Workers Cache (`cache.enabled` in `wrangler.jsonc`) serves pages and server-function GETs
  from Cloudflare's cache by their `Cache-Control`, without running the Worker; check
  `Cf-Cache-Status`. Responses carry `Vary: Cookie` for draft mode (see `lib/cache-control.ts`)
- Hashed build assets are served as immutable (`public/_headers`)
- `bun run test:e2e:preview` builds the `preview` environment locally and sends one real
  contact email to Resend's test inbox: workerd runs the bundle `wrangler deploy` uploads, so
  this checks the Resend key and sending domain without deploying. Add
  `BASE_URL=<preview URL>` to run it against a deployed version instead
- The repository is still connected to Vercel for the Next.js site on `main`; `vercel.json`
  here skips every Vercel build of this branch
- `generated/cn-tables.ts` (class-merge tables) is written on `bun install` and kept current by
  the Vite plugin

### Environment

- Public settings (`VITE_*`) are inlined by Vite at build time and read from `lib/env.ts`;
  the build validates them against `lib/env.schema.ts`, so no validator ships to the browser
- Server secrets come from `lib/env.server.ts` (`@t3-oss/env-core`): the Worker's vars and
  secrets, validated at runtime through `process.env`
- Server: `SANITY_API_READ_TOKEN`, `RESEND_API_KEY`, `DEPLOY_ENV`
- Client: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_BLOB_STORAGE_URL`
- `VITE_SANITY_DATASET` isn't set in `.env` files: `vite.config.ts` takes it from the `SANITY_DATASET`
  var of the Wrangler environment being built, so `bun run deploy` reads `production` and local
  and preview builds read `development`
