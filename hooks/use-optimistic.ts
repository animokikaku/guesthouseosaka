import { useOptimistic as useSanityOptimistic } from 'next-sanity/hooks'

import { createDataAttribute } from '@/lib/sanity-data-attributes'

/**
 * Generic hook for optimistic updates on array fields in Sanity documents.
 * Works with any array field that contains items with `_key` properties.
 *
 * @template TItem - The type of items in the array (must have `_key: string`)
 *
 * @param data - The current document data from the query
 * @param fieldKey - The key of the array field to update (e.g., 'houses', 'galleryWall')
 *
 * @returns The optimistic array state, which will update when the document is edited in Sanity Studio
 *
 * @example
 * ```ts
 * // For houses array
 * const houses = useOptimisticArray(data, 'houses')
 *
 * // For galleryWall array
 * const images = useOptimisticArray(data, 'galleryWall')
 * ```
 */
type ArrayFieldKey<TDocument> = {
  [K in keyof TDocument]-?: TDocument[K] extends
    | Array<infer TItem>
    | null
    | undefined
    ? TItem extends { _key?: string }
      ? K
      : never
    : never
}[keyof TDocument]

type ArrayItemFor<TDocument, K extends ArrayFieldKey<TDocument>> = Extract<
  TDocument[K],
  Array<{ _key?: string }>
>[number] & {
  _key?: string
}

function useOptimisticArray<
  TDocument extends { _id: string },
  K extends ArrayFieldKey<TDocument>
>(data: TDocument | null | undefined, fieldKey: K): TDocument[K] {
  type ArrayItem = ArrayItemFor<TDocument, K>
  const documentId = data?._id

  // Normalize null to undefined for useOptimistic
  const normalizedData = (data?.[fieldKey] ?? undefined) as
    | Array<ArrayItem>
    | undefined

  return useSanityOptimistic<Array<ArrayItem> | undefined, TDocument>(
    normalizedData,
    (state, action) => {
      const updatedArray = action.document?.[fieldKey] as
        | Array<{ _key?: string }>
        | null
        | undefined

      if (action.id === documentId && updatedArray) {
        // Optimistic document only has _ref values, not resolved references
        // Match by _key and preserve existing resolved data when available
        return updatedArray.map((doc) => {
          const existing = state?.find(
            (item) => (item as { _key?: string })._key === doc._key
          )
          return existing ?? (doc as ArrayItem)
        })
      }
      return state
    }
  ) as TDocument[K]
}

export function useOptimistic<
  TDocument extends { _id: string; _type: string },
  K extends ArrayFieldKey<TDocument>
>(data: TDocument | null | undefined, fieldKey: K) {
  const array = useOptimisticArray(data, fieldKey)
  const createAttribute = data
    ? createDataAttribute({ id: data._id, type: data._type })
    : null
  const attribute = {
    list: () => (createAttribute ? createAttribute(String(fieldKey)) : ''),
    item: (itemKey: string) =>
      createAttribute ? createAttribute(String(fieldKey), itemKey) : ''
  }

  return [array, attribute] as const
}
