import type { ContactNavItem } from '@/lib/types/components'
import type { ContactPageQueryResult } from '@/sanity.types'

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
export function toContactNavItems(
  contactTypes: ContactTypes
): ContactNavItem[] {
  return contactTypes
    .filter(
      (item): item is typeof item & { title: string } => item.title != null
    )
    .map(({ _id, slug, title }) => ({
      id: _id,
      slug,
      title
    }))
}
