import { sanityFetch } from '@/sanity/lib/live'
import { contactPageQuery, faqPageQuery } from '@/sanity/lib/queries'
import { cache } from 'react'

// Queries read by both a layout and a nested layout or page, deduplicated per
// request so each is fetched once.

export const getFaqPage = cache(async (locale: string) => {
  return sanityFetch({ query: faqPageQuery, params: { locale } })
})

export const getContactPage = cache(async (locale: string) => {
  return sanityFetch({ query: contactPageQuery, params: { locale } })
})
