// The public settings `lib/env.ts` reads, as `env.ts` validates them at build time.
interface ImportMetaEnv {
  readonly VITE_APP_URL?: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_SANITY_DATASET?: 'production' | 'development'
}
