import { env } from '@/lib/env'
import { createClient } from 'next-sanity'

/**
 * Create a Sanity client
 */
export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: process.env.NODE_ENV === 'production', // Set to false if statically generating pages, using ISR or tag-based revalidation,
  stega: { studioUrl: '/studio' }
})
