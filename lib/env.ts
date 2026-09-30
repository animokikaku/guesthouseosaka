import { createEnv } from '@t3-oss/env-nextjs'
import { en } from 'zod/locales'
import * as z from 'zod/mini'

// zod/mini ships without default error messages; keep the same English defaults as zod.
z.config(en())

const vercelBlobHostname = /\.public\.blob\.vercel-storage\.com$/i

const nonEmptyString = () => z.string().check(z.minLength(1))

export const env = createEnv({
  server: {
    SANITY_API_READ_TOKEN: nonEmptyString(),
    RESEND_API_KEY: nonEmptyString(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    VERCEL_ENV: z.optional(z.enum(['development', 'preview', 'production']))
  },
  client: {
    NEXT_PUBLIC_APP_URL: z._default(
      z.url(),
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    ),
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
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BLOB_STORAGE_URL: process.env.NEXT_PUBLIC_BLOB_STORAGE_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  },
  emptyStringAsUndefined: true
})
