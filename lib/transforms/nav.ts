import { assets } from '@/lib/assets'
import { isHouseIdentifier, type NavGroupItem } from '@/lib/types'
import type { ContactNavItem } from '@/lib/types/components'
import type { ContactPageQueryResult, HousesNavQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import type { Locale } from 'use-intl'

type ContactTypes = Array<
  Pick<NonNullable<ContactPageQueryResult>['contactTypes'][number], '_id' | 'slug' | 'title'>
>

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

/**
 * Drops (and warns about) houses whose slug isn't a known house identifier.
 * A house without an image asset yet, like a new draft, gets no background.
 */
export function toHouseNavItems(houses: HousesNavQueryResult, locale: Locale): NavGroupItem[] {
  return (houses ?? [])
    .filter((house) => {
      const isValidSlug = isHouseIdentifier(house.slug)
      if (!isValidSlug) {
        console.warn(`Unknown house slug: ${house.slug}`)
      }
      return isValidSlug
    })
    .map(({ slug, title, description, caption, image }) => ({
      key: slug,
      link: { to: '/$locale/$house', params: { locale, house: slug } },
      label: title ?? slug,
      description: description ?? undefined,
      caption: caption ?? undefined,
      icon: assets[slug].icon,
      background: image.asset
        ? {
            src: urlFor(image).width(250).height(150).fit('crop').url(),
            alt: image.alt ?? title ?? slug,
            blurHash: image.blurHash ?? undefined
          }
        : undefined
    }))
}
