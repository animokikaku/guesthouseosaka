import { ContactType, ContactTypeValues, HouseIdentifier } from '@/lib/types'
import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

function isContactTypeSlug(slug: unknown): slug is ContactType {
  return (
    typeof slug === 'string' &&
    ContactTypeValues.includes(slug as ContactType)
  )
}

const l = {
  home: () => ({ title: 'Home', href: '/' }),
  house: (slug: HouseIdentifier) => ({ title: 'House', href: `/${slug}` }),
  faq: () => ({ title: 'FAQ', href: '/faq' }),
  contact: () => ({ title: 'Contact', href: '/contact' }),
  contactType: (slug: ContactType) => ({
    title: 'Contact Form',
    href: `/contact/${slug}`
  })
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
    contactType: defineLocations({
      select: { slug: 'slug' },
      resolve: (doc) => {
        if (!isContactTypeSlug(doc?.slug)) {
          console.warn(`Invalid contact type slug: ${doc?.slug}`)
          return { locations: [l.contact()] }
        }
        return { locations: [l.contact(), l.contactType(doc.slug)] }
      }
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
