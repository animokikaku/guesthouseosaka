import { createEnv } from '@t3-oss/env-core'
import { SITE_URL } from './config'
import { z } from './zod'

const vercelBlobHostname = /\.public\.blob\.vercel-storage\.com$/i

const nonEmptyString = () => z.string().check(z.minLength(1))

export const env = createEnv({
  server: {
    SANITY_API_READ_TOKEN: nonEmptyString(),
    RESEND_API_KEY: nonEmptyString(),
    // Which Cloudflare environment this Worker is (see wrangler.jsonc).
    DEPLOY_ENV: z.optional(z.enum(['development', 'preview', 'production']))
  },
  // Vite inlines these into both bundles at build time (see `envPrefix` in
  // vite.config.ts).
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_APP_URL: z._default(z.url(), SITE_URL),
    NEXT_PUBLIC_BLOB_STORAGE_URL: z.url().check(
      z.refine((value) => vercelBlobHostname.test(new URL(value).hostname), {
        message: 'Must be a Vercel Blob Storage public URL'
      })
    ),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: nonEmptyString(),
    NEXT_PUBLIC_SANITY_API_VERSION: nonEmptyString(),
    NEXT_PUBLIC_SANITY_DATASET: z.enum(['production', 'development']),
    NEXT_PUBLIC_SANITY_PROJECT_ID: nonEmptyString()
  },
  runtimeEnv: {
    // Server-only variables are the Worker's vars and secrets, which
    // `nodejs_compat` exposes on `process.env`; the browser has no `process`.
    ...(typeof process === 'undefined' ? {} : process.env),
    NEXT_PUBLIC_APP_URL: import.meta.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BLOB_STORAGE_URL: import.meta.env.NEXT_PUBLIC_BLOB_STORAGE_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_SANITY_API_VERSION: import.meta.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_DATASET: import.meta.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_PROJECT_ID: import.meta.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  },
  isServer: typeof window === 'undefined',
  emptyStringAsUndefined: true
})
