import { useOptimistic } from '@sanity/visual-editing/react'

/** A document mutation as Presentation reports it to `useOptimistic`. */
type OptimisticAction<TDocument> = { id: string; document: TDocument }

/**
 * Applies a Studio edit to an array field: the incoming order wins, while items
 * already resolved by the query (references expanded, strings localized) are
 * reused by `_key` instead of their raw document form. Edits to other
 * documents, or ones that don't touch the field, leave it as it is.
 */
// These generics preserve each caller's document and nullable state shapes across the SDK callback.
// oxlint-disable typescript/no-unnecessary-type-parameters, typescript/no-unsafe-type-assertion
export function reduceOptimisticArray<
  TItem extends { _key: string },
  TState extends TItem[] | null | undefined,
  TDocument extends Record<string, unknown>
>(documentId: string, selectIncoming: (document: TDocument) => TItem[] | null | undefined) {
  return (current: TState, { id, document }: OptimisticAction<TDocument>): TState => {
    if (id !== documentId) return current

    const incoming = selectIncoming(document)
    if (!incoming) return current

    return incoming.map((item) => current?.find((c) => c._key === item._key) ?? item) as TState
  }
}

/** Optimistically updates a Sanity array field; see {@link reduceOptimisticArray}. */
export function useSanityOptimisticArray<
  TItem extends { _key: string },
  TState extends TItem[] | null | undefined,
  TDocument extends Record<string, unknown> = Record<string, unknown>
>(
  documentId: string,
  initial: TState,
  selectIncoming: (document: TDocument) => TItem[] | null | undefined
): TState {
  return useOptimistic<TState, TDocument>(
    initial,
    reduceOptimisticArray<TItem, TState, TDocument>(documentId, selectIncoming)
  )
}
// oxlint-enable typescript/no-unnecessary-type-parameters, typescript/no-unsafe-type-assertion
