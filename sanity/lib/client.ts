import { SANITY_API_VERSION, SANITY_PROJECT_ID } from '@/lib/config'
import { env } from '@/lib/env'
import { createClient } from '@sanity/client'

/**
 * Create a Sanity client
 */
export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  // `fetch.server.ts` picks the CDN and token per request (published or draft).
  useCdn: false,
  stega: {
    studioUrl: '/studio',
    enabled: false
  }
})
