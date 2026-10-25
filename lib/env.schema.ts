import { z } from './zod'

const vercelBlobHostname = /\.public\.blob\.vercel-storage\.com$/i

export const nonEmptyString = () => z.string().check(z.minLength(1))

/**
 * The public settings Vite inlines into both bundles. `vite.config.ts` checks
 * them against this schema before building, so the browser ships no validator.
 */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.optional(z.url()),
  NEXT_PUBLIC_BLOB_STORAGE_URL: z.url().check(
    z.refine((value) => vercelBlobHostname.test(new URL(value).hostname), {
      message: 'Must be a Vercel Blob Storage public URL'
    })
  ),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: nonEmptyString(),
  NEXT_PUBLIC_SANITY_API_VERSION: nonEmptyString(),
  NEXT_PUBLIC_SANITY_DATASET: z.enum(['production', 'development']),
  NEXT_PUBLIC_SANITY_PROJECT_ID: nonEmptyString()
})
