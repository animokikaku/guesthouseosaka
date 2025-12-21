import { createDataAttribute } from '@/lib/sanity-data-attributes'
import { useOptimistic as useSanityOptimistic } from 'next-sanity/hooks'

type SanityItem = { _key: string }
type SanityDocument = { _id: string; _type: string }

// Extract array field keys that contain items with _key
type ArrayFieldKey<T> = {
  [K in keyof T]: T[K] extends (infer Item)[] | null | undefined
    ? Item extends SanityItem
      ? K
      : never
    : never
}[keyof T]

// Get the array item type for a given field
type ArrayItem<T, K extends keyof T> =
  NonNullable<T[K]> extends (infer Item)[] ? Item : never

/**
 * Hook for optimistic updates on Sanity array fields.
 * Automatically updates when the document is edited in Sanity Studio.
 *
 * @example
 * const [houses, attr] = useOptimistic(data, 'houses')
 * <div data-sanity={attr.list()}>
 *   {houses?.map(house => (
 *     <div key={house._key} data-sanity={attr.item(house._key)} />
 *   ))}
 * </div>
 */
export function useOptimistic<
  T extends SanityDocument,
  K extends ArrayFieldKey<T>
>(data: T | null | undefined, fieldKey: K) {
  type Item = ArrayItem<T, K>

  const documentId = data?._id
  const currentArray = (data?.[fieldKey] ?? undefined) as Item[] | undefined

  const optimisticArray = useSanityOptimistic<Item[] | undefined, T>(
    currentArray,
    (state, action) => {
      if (action.id !== documentId) return state

      const updatedArray = action.document?.[fieldKey] as
        | Item[]
        | null
        | undefined
      if (!updatedArray) return state

      // Preserve resolved references by matching on _key
      return updatedArray.map((updated) => {
        const existing = state?.find(
          (item) => (item as SanityItem)._key === (updated as SanityItem)._key
        )
        return existing ?? updated
      })
    }
  ) as T[K]

  const createAttribute = data
    ? createDataAttribute({ id: data._id, type: data._type })
    : null

  const attr = {
    list: () => createAttribute?.(String(fieldKey)) ?? '',
    item: (key: string) => createAttribute?.(String(fieldKey), key) ?? ''
  }

  return [optimisticArray, attr] as const
}
