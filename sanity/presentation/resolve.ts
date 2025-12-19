import { HouseIdentifier } from '@/lib/types'
import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

const l = {
  home: () => ({ title: 'Home', href: '/' }),
  house: (slug: HouseIdentifier) => ({ title: 'House', href: `/${slug}` })
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
    })
  }
}
