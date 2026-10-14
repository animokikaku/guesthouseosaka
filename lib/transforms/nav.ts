import { assets } from '@/lib/assets'
import { isHouseIdentifier, type NavGroupItem } from '@/lib/types'
import type { ContactNavItem } from '@/lib/types/components'
import type { ContactPageQueryResult, HousesNavQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'

type ContactTypes = NonNullable<ContactPageQueryResult>['contactTypes']

/** Drops contact types without a title, which would render an empty tab. */
export function toContactNavItems(contactTypes: ContactTypes): ContactNavItem[] {
  return contactTypes
    .filter((item): item is typeof item & { title: string } => item.title != null)
    .map(({ _id, slug, title }) => ({
      id: _id,
      slug,
      title
    }))
}

/** Drops (and warns about) houses whose slug isn't a known house identifier. */
export function toHouseNavItems(houses: HousesNavQueryResult): NavGroupItem[] {
  return (houses ?? [])
    .filter((house) => {
      const isValidSlug = isHouseIdentifier(house.slug)
      if (!isValidSlug) {
        console.warn(`Unknown house slug: ${house.slug}`)
      }
      return isValidSlug
    })
    .map(({ slug, title, description, caption, image }) => {
      const asset = assets[slug]
      const src = urlFor(image).width(250).height(150).fit('crop').url()

      return {
        key: slug,
        href: { pathname: '/[house]', params: { house: slug } } as const,
        label: title ?? slug,
        description: description ?? undefined,
        caption: caption ?? undefined,
        icon: asset.icon,
        background: {
          src,
          alt: image?.alt ?? title ?? slug,
          blurDataURL: image?.preview ?? undefined
        }
      }
    })
}
