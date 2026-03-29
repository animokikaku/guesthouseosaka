import { createClient } from 'next-sanity'

/**
 * Create a Sanity client
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false, // Disabled for static generation and tag-based revalidation
  stega: {
    studioUrl: '/studio',
    enabled: false
  }
})
