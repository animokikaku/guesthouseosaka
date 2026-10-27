import { SITE_URL, TURNSTILE_TEST_SITE_KEY } from './config'

/**
 * Public settings, inlined by Vite at build time (see `envPrefix` in
 * vite.config.ts, which validates them against `env.schema.ts` first). Server
 * secrets live in `env.server.ts`.
 */
export const env = {
  VITE_APP_URL: import.meta.env.VITE_APP_URL || SITE_URL,
  VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  // Set by vite.config.ts; the component gallery builds without it.
  VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? TURNSTILE_TEST_SITE_KEY,
  // Set from `CLOUDFLARE_ENV` by vite.config.ts; the Studio and the component
  // gallery build without it.
  VITE_SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET ?? 'development'
}
