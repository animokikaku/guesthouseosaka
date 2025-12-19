import { locales } from '@/sanity/config'
import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      select: {},
      resolve: () => ({
        locations: locales.map((locale) => ({
          title: `Home (${locale.label})`,
          href: `/${locale.name}`
        }))
      })
    }),
    house: defineLocations({
      select: { slug: 'slug' },
      resolve: (doc) => ({
        locations: locales.map((locale) => ({
          title: `House (${locale.label})`,
          href: `/${locale.name}/${doc?.slug}`
        }))
      })
    })
  }
}
