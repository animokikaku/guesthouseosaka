/**
 * Generic utility for grouping items by category.
 *
 * Used by both gallery and amenities to avoid code duplication.
 * The utility preserves all category properties and adds an items array.
 */

/** Minimum required shape for a category */
interface BaseCategory {
  key: string
  orderRank: string | null
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
 * @returns Array of categories with their items, sorted by orderRank
 *
 * @example
 * // Gallery usage
 * const categories = groupByCategory(gallery)
 * // Returns: Array<{ _id, key, label, orderRank, items: GalleryItem[] }>
 *
 * @example
 * // Amenities usage
 * const categories = groupByCategory(amenities)
 * // Returns: Array<{ key, label, icon, orderRank, items: Amenity[] }>
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

  // Sort by orderRank (lexicographic string comparison)
  // Items with null orderRank sort to the end
  return [...categoryMap.values()].sort((a, b) => {
    if (a.orderRank === null && b.orderRank === null) return 0
    if (a.orderRank === null) return 1
    if (b.orderRank === null) return -1
    return a.orderRank.localeCompare(b.orderRank)
  })
}
