import { sanityFetch } from '@/sanity/lib/live'
import { faqPageQuery } from '@/sanity/lib/queries'
import { cache } from 'react'

/**
 * Cached FAQ page query to avoid duplicate fetches between the layout and page.
 */
export const getFaqPage = cache(async (locale: string) => {
  return sanityFetch({ query: faqPageQuery, params: { locale } })
})
