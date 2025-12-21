import { HouseIdentifier } from '@/lib/types'
import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

const l = {
  home: () => ({ title: 'Home', href: '/' }),
  house: (slug: HouseIdentifier) => ({ title: 'House', href: `/${slug}` }),
  faq: () => ({ title: 'FAQ', href: '/faq' }),
  contact: () => ({ title: 'Contact', href: '/contact' })
}

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      select: {},
      resolve: () => ({
        locations: [l.home()]
      })
    }),
    house: defineLocations({
      select: { slug: 'slug' },
      resolve: (doc) => ({
        locations: [l.home(), l.house(doc?.slug)]
      })
    }),
    faqPage: defineLocations({
      select: {},
      resolve: () => ({
        locations: [l.faq()]
      })
    }),
    contactPage: defineLocations({
      select: {},
      resolve: () => ({
        locations: [l.contact()]
      })
    }),
    // Settings appear on all pages (header/footer)
    settings: defineLocations({
      select: {},
      resolve: () => ({
        locations: [l.home(), l.faq(), l.contact()]
      })
    })
  }
}
