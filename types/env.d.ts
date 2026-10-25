// The public settings `lib/env.ts` reads, as `lib/env.schema.ts` validates them at build time.
interface ImportMetaEnv {
  readonly NEXT_PUBLIC_APP_URL?: string
  readonly NEXT_PUBLIC_BLOB_STORAGE_URL: string
  readonly NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string
  readonly NEXT_PUBLIC_SANITY_API_VERSION: string
  readonly NEXT_PUBLIC_SANITY_DATASET: 'production' | 'development'
  readonly NEXT_PUBLIC_SANITY_PROJECT_ID: string
}
