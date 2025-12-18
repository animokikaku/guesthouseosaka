import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
        locale: LocaleField.name
      },
      resolve: (doc) => ({
        locations: [{ title: 'Home', href: `/${doc?.locale || 'en'}` }]
      })
    }),
    housePage: defineLocations({
      select: {
        title: 'title',
        slug: 'house.slug.current',
        locale: LocaleField.name
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/${doc?.locale || 'en'}/${doc?.slug}`
          }
        ]
      })
    }),
    faqPage: defineLocations({
      select: {
        title: 'title',
        locale: LocaleField.name
      },
      resolve: (doc) => ({
        locations: [{ title: 'FAQ', href: `/${doc?.locale || 'en'}/faq` }]
      })
    }),
    contactPage: defineLocations({
      select: {
        title: 'title',
        locale: LocaleField.name
      },
      resolve: (doc) => ({
        locations: [
          { title: 'Contact', href: `/${doc?.locale || 'en'}/contact` },
          { title: 'Tour', href: `/${doc?.locale || 'en'}/contact/tour` },
          { title: 'Move-in', href: `/${doc?.locale || 'en'}/contact/move-in` },
          { title: 'General', href: `/${doc?.locale || 'en'}/contact/general` }
        ]
      })
    })
  }
}
