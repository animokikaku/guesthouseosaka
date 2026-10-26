// Extension included: vite.config.ts loads this file outside the bundler.
import { z } from './zod.ts'

export const nonEmptyString = () => z.string().check(z.minLength(1))

/**
 * The public settings Vite inlines into both bundles. `vite.config.ts` checks
 * them against this schema before building, so the browser ships no validator.
 */
export const publicEnvSchema = z.object({
  VITE_APP_URL: z.optional(z.url({ protocol: /^https?$/ })),
  VITE_ASSETS_URL: z.optional(z.url({ protocol: /^https?$/ })),
  VITE_GOOGLE_MAPS_API_KEY: nonEmptyString(),
  VITE_SANITY_API_VERSION: z.optional(nonEmptyString()),
  VITE_SANITY_DATASET: z.enum(['production', 'development']),
  VITE_SANITY_PROJECT_ID: z.optional(nonEmptyString())
})
