import { createClient } from 'next-sanity'
import { ENV } from 'varlock/env'

/**
 * Create a Sanity client
 */
export const client = createClient({
  projectId: ENV.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: ENV.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: ENV.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false, // Disabled for static generation and tag-based revalidation
  stega: {
    studioUrl: '/studio',
    enabled: false
  }
})
