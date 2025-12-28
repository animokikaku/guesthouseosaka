/**
 * Generic utility for grouping items by category.
 *
 * Used by both gallery and amenities to avoid code duplication.
 * The utility preserves all category properties and adds an items array.
 */

/** Minimum required shape for a category */
interface BaseCategory {
  key: string
  order: number | null
}

/** Item that has an optional category property */
type ItemWithCategory = {
  category: BaseCategory | null
}

/** Extract the category type from an item type */
type ExtractCategory<T extends ItemWithCategory> = NonNullable<T['category']>

/** Result type: category with its items */
type GroupedCategory<T extends ItemWithCategory> = ExtractCategory<T> & {
  items: T[]
}

/**
 * Groups items by their category.key property.
 *
 * @param items - Array of items with optional category property
 * @returns Array of categories with their items, sorted by order
 *
 * @example
 * // Gallery usage
 * const categories = groupByCategory(gallery)
 * // Returns: Array<{ _id, key, label, order, items: GalleryItem[] }>
 *
 * @example
 * // Amenities usage
 * const categories = groupByCategory(amenities)
 * // Returns: Array<{ key, label, icon, order, items: Amenity[] }>
 */
export function groupByCategory<T extends ItemWithCategory>(
  items: T[] | null
): GroupedCategory<T>[] {
  if (!items) return []

  const categoryMap = new Map<string, GroupedCategory<T>>()

  for (const item of items) {
    if (!item.category) continue
    const key = item.category.key

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        ...(item.category as ExtractCategory<T>),
        items: []
      })
    }

    categoryMap.get(key)!.items.push(item)
  }

  return [...categoryMap.values()].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  )
}
