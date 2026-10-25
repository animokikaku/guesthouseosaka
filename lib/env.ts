import { SITE_URL } from './config'

/**
 * Public settings, inlined by Vite at build time (see `envPrefix` in
 * vite.config.ts, which validates them against `env.schema.ts` first). Server
 * secrets live in `env.server.ts`.
 */
export const env = {
  NEXT_PUBLIC_APP_URL: import.meta.env.NEXT_PUBLIC_APP_URL || SITE_URL,
  NEXT_PUBLIC_BLOB_STORAGE_URL: import.meta.env.NEXT_PUBLIC_BLOB_STORAGE_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_SANITY_API_VERSION: import.meta.env.NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_SANITY_DATASET: import.meta.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_PROJECT_ID: import.meta.env.NEXT_PUBLIC_SANITY_PROJECT_ID
}
