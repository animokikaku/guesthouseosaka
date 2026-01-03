import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery } from '@/sanity/lib/queries'
import { cache } from 'react'

/**
 * Cached house query to avoid duplicate fetches between
 * layout.tsx (generateMetadata) and page.tsx
 */
export const getHouse = cache(async (locale: string, slug: string) => {
  return sanityFetch({ query: houseQuery, params: { locale, slug } })
})
