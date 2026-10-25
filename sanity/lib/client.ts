import { env } from '@/lib/env'
import { createClient } from '@sanity/client'

/**
 * Create a Sanity client
 */
export const client = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: env.VITE_SANITY_API_VERSION,
  // `fetch.server.ts` picks the CDN and token per request (published or draft).
  useCdn: false,
  stega: {
    studioUrl: '/studio',
    enabled: false
  }
})
