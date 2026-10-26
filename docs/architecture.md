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
- Only the `production` environment routes `guesthouseosaka.com` to the Worker (a custom
  domain). Cloudflare attaches it only while no other DNS record uses the hostname; production
  has no workers.dev address, Worker Previews keep theirs
- Secrets are set with `wrangler secret put`; locally they come from `.env.local`
- Workers Cache (`cache.enabled` in `wrangler.jsonc`) serves pages and server-function GETs
  from Cloudflare's cache by their `Cache-Control`, without running the Worker; check
  `Cf-Cache-Status`. Responses carry `Vary: Cookie` for draft mode (see `lib/cache-control.ts`)
- Hashed build assets are served as immutable (`public/_headers`)
- `bun run test:e2e:preview` builds the `preview` environment locally and sends one real
  contact email to Resend's test inbox: workerd runs the bundle `wrangler deploy` uploads, so
  this checks the Resend key and sending domain without deploying. It runs locally with
  Turnstile's test keys; a deployed Preview runs the real challenge, which stops the automated
  browser, so check one by submitting its contact form by hand
- Logos and Open Graph images are served from the public R2 bucket `guesthouseosaka-assets`
  through its custom domain (`ASSETS_URL` in `lib/config.ts`). Uploads set
  `Cache-Control: public, max-age=31536000`, so replace a file under a new name rather than
  overwriting it
- `generated/cn-tables.ts` (class-merge tables) is written on `bun install` and kept current by
  the Vite plugin

### Environment

- Public settings (`VITE_*`) are inlined by Vite at build time and read from `lib/env.ts`;
  the build validates them against `lib/env.schema.ts`, so no validator ships to the browser
- Server secrets come from `lib/env.server.ts` (`@t3-oss/env-core`): the Worker's vars and
  secrets, validated at runtime through `process.env`
- Server: `SANITY_API_READ_TOKEN`, `RESEND_API_KEY`, `DEPLOY_ENV`, `TURNSTILE_SECRET_KEY`
- Client: `VITE_GOOGLE_MAPS_API_KEY`, `VITE_TURNSTILE_SITE_KEY`, and optionally `VITE_APP_URL`,
  which defaults to `SITE_URL`. The Sanity project, API version and assets host are constants in
  `lib/config.ts`
- `VITE_SANITY_DATASET` isn't set in `.env` files: `vite.config.ts` derives it from the Wrangler
  environment being built (`CLOUDFLARE_ENV`), so `bun run deploy` reads `production` and local
  and preview builds read `development`

### Turnstile

The contact forms carry Cloudflare Turnstile's bot check (`components/forms/turnstile.tsx`), which
`app/actions/turnstile.server.ts` verifies before an email goes out.

- Deployed builds use the real widget, for `guesthouseosaka.com` and `animokikaku.workers.dev`:
  Workers Builds passes `VITE_TURNSTILE_SITE_KEY` to production and preview builds as a build
  variable, and the Worker and its Previews read the `TURNSTILE_SECRET_KEY` secret. A Preview runs
  the real check while emailing only Resend's test inbox
- Local and CI builds use Cloudflare's always-passing test keys, from `.env.local` (see
  `.env.example`) and `ci.yml`
- A submission without a token Cloudflare vouches for is rejected, and the Worker logs Cloudflare's
  error codes (`Turnstile rejected…`). Turnstile's dashboard analytics show how many visitors
  pass the challenge
