import { routing } from '@/i18n/routing'
import { ROOMS_CACHE_TAG } from '@/lib/cache-control'
import { getRoomCounts } from '@/lib/rooms.server'
import { toHouseNavItems } from '@/lib/transforms/nav'
import { ContactTypeValues, HouseIdentifierValues } from '@/lib/types'
import { z } from '@/lib/zod'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { LOADER_CONTENT_TYPES as TYPES } from './content-types'
import { isDraftModeEnabled } from './draft-mode.server'
import { sanityFetch, setCacheHeaders } from './fetch.server'
import {
  contactPageQuery,
  contactTypeQuery,
  faqPageQuery,
  faqQuestionsQuery,
  homePageQuery,
  houseGalleryQuery,
  housesBuildingQuery,
  housesNavQuery,
  houseQuery,
  legalNoticeQuery,
  pricingCategoriesQuery,
  settingsQuery
} from './queries'

/*
 * One GET server function per route, each running a fixed set of queries: a
 * client navigation costs one request, and the CDN can cache it like a page
 * (see `cacheable`). Never accept a query from the client: the server holds
 * the read token.
 */

/**
 * Lets the CDN cache the response like a page, unless it was rendered in draft
 * mode, tagged with the document `types` it reads (see `content-types.ts`) and
 * `extraTags` for purges beyond Sanity's.
 */
const cacheable = (types: readonly string[], extraTags?: string[]) =>
  createMiddleware({ type: 'function' }).server(async ({ next }) => {
    const result = await next()
    setCacheHeaders(types, extraTags)
    return result
  })

const localeSchema = z.enum(routing.locales)
const byLocale = z.object({ locale: localeSchema })
const byHouse = z.object({ locale: localeSchema, house: z.enum(HouseIdentifierValues) })
const byContactType = z.object({ locale: localeSchema, slug: z.enum(ContactTypeValues) })

export const getLocaleLayout = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.localeLayout)])
  .validator(byLocale)
  .handler(async ({ data: { locale } }) => {
    const [{ data: settings }, { data: houses }] = await Promise.all([
      sanityFetch({ query: settingsQuery, params: { locale } }),
      sanityFetch({ query: housesNavQuery, params: { locale } })
    ])
    return {
      settings,
      // Transformed here to keep the work off the client.
      houseItems: toHouseNavItems(houses, locale),
      // For the house pages' tabs and the contact forms' house choice.
      houseTitles: houses.map(({ slug, title }) => ({ slug, title })),
      isDraftMode: isDraftModeEnabled(),
      year: new Date().getFullYear()
    }
  })

export const getHomePage = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.homePage)])
  .validator(byLocale)
  .handler(async ({ data: { locale } }) => {
    const { data } = await sanityFetch({ query: homePageQuery, params: { locale } })
    return data
  })

export const getFaqPage = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.faqPage)])
  .validator(byLocale)
  .handler(async ({ data: { locale } }) => {
    const params = { locale }
    const [page, housesBuilding, pricingCategories, faqQuestions] = await Promise.all([
      sanityFetch({ query: faqPageQuery, params }),
      sanityFetch({ query: housesBuildingQuery, params }),
      sanityFetch({ query: pricingCategoriesQuery, params }),
      sanityFetch({ query: faqQuestionsQuery, params })
    ])
    return {
      page: page.data,
      housesBuilding: housesBuilding.data,
      pricingCategories: pricingCategories.data,
      faqQuestions: faqQuestions.data
    }
  })

export const getContactLayout = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.contactLayout)])
  .validator(byLocale)
  .handler(async ({ data: { locale } }) => {
    const { data } = await sanityFetch({ query: contactPageQuery, params: { locale } })
    return data
  })

export const getLegalNotice = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.legalNotice)])
  .validator(byLocale)
  .handler(async ({ data: { locale } }) => {
    const { data } = await sanityFetch({ query: legalNoticeQuery, params: { locale } })
    return data
  })

export const getContactType = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.contactType)])
  .validator(byContactType)
  .handler(async ({ data: { locale, slug } }) => {
    const { data } = await sanityFetch({ query: contactTypeQuery, params: { locale, slug } })
    return data
  })

export const getHousePage = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.housePage, [ROOMS_CACHE_TAG])])
  .validator(byHouse)
  .handler(async ({ data: { locale, house } }) => {
    const [page, roomCounts] = await Promise.all([
      sanityFetch({ query: houseQuery, params: { locale, slug: house } }),
      getRoomCounts(house)
    ])
    return { house: page.data, roomCounts }
  })

export const getHouseGallery = createServerFn({ method: 'GET' })
  .middleware([cacheable(TYPES.houseGallery)])
  .validator(byHouse)
  .handler(async ({ data: { locale, house } }) => {
    const { data } = await sanityFetch({
      query: houseGalleryQuery,
      params: { locale, slug: house }
    })
    return data
  })
