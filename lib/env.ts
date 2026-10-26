import { ASSETS_URL, SANITY_API_VERSION, SANITY_PROJECT_ID, SITE_URL } from './config'

/**
 * Public settings, inlined by Vite at build time (see `envPrefix` in
 * vite.config.ts, which validates them against `env.schema.ts` first). Server
 * secrets live in `env.server.ts`.
 */
export const env = {
  VITE_APP_URL: import.meta.env.VITE_APP_URL || SITE_URL,
  VITE_ASSETS_URL: import.meta.env.VITE_ASSETS_URL || ASSETS_URL,
  VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  VITE_SANITY_API_VERSION: import.meta.env.VITE_SANITY_API_VERSION || SANITY_API_VERSION,
  // Set from wrangler.jsonc by vite.config.ts; the Studio and the component
  // gallery build without it.
  VITE_SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET ?? 'development',
  VITE_SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID || SANITY_PROJECT_ID
}
