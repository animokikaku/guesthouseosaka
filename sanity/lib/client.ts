import { env } from '@/lib/env'
import { createClient } from '@sanity/client'

/**
 * Create a Sanity client
 */
export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  // `fetch.server.ts` picks the CDN and token per request (published or draft).
  useCdn: false,
  stega: {
    studioUrl: '/studio',
    enabled: false
  }
})
