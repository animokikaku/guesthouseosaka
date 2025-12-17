import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: () => ({
        locations: [{ title: 'Home', href: '/' }]
      })
    }),
    housePage: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Untitled', href: `/${doc?.slug}` }]
      })
    }),
    faqPage: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: () => ({
        locations: [{ title: 'FAQ', href: '/faq' }]
      })
    }),
    contactPage: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: () => ({
        locations: [
          { title: 'Contact', href: '/contact' },
          { title: 'Tour', href: '/contact/tour' },
          { title: 'Move-in', href: '/contact/move-in' },
          { title: 'General', href: '/contact/general' }
        ]
      })
    })
  }
}
