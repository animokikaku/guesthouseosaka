import { assets } from '@/lib/assets'
import { isHouseIdentifier, type NavGroupItem } from '@/lib/types'
import type { ContactNavItem } from '@/lib/types/components'
import type { ContactPageQueryResult, HousesNavQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type ContactTypes = NonNullable<ContactPageQueryResult>['contactTypes']

// ============================================
// Navigation Transformers
// ============================================

/**
 * Transforms Sanity contact types to ContactNavItem array
 * Filters out items without valid titles
 *
 * @param contactTypes - Raw contact types from Sanity query
 * @returns Array of ContactNavItem with id, slug, and title
 */
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
 * Transforms Sanity houses query result to NavGroupItem array
 * Filters out houses whose slug isn't a known house identifier
 *
 * @param houses - Raw houses from Sanity query
 * @returns Array of NavGroupItem with navigation data and images
 */
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
