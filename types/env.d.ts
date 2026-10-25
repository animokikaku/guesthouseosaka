// The public settings `lib/env.ts` reads, as `lib/env.schema.ts` validates them at build time.
interface ImportMetaEnv {
  readonly VITE_APP_URL?: string
  readonly VITE_BLOB_STORAGE_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_SANITY_API_VERSION: string
  readonly VITE_SANITY_DATASET?: 'production' | 'development'
  readonly VITE_SANITY_PROJECT_ID: string
}
