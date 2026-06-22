'use client'

import { useOptimistic } from 'next-sanity/hooks'

function mergeOptimisticByKey<T extends { _key: string }>(
  current: T[] | null | undefined,
  incoming: T[]
): T[] {
  return incoming.map((item) => current?.find((c) => c._key === item._key) ?? item)
}

type SanityOptimisticAction<TDocument> = {
  id: string
  document: TDocument
}

/**
 * Optimistically updates a Sanity array field, merging incoming partial items
 * with the current resolved data by `_key`.
 */
export function useSanityOptimisticArray<
  TItem extends { _key: string },
  TState extends TItem[] | null | undefined,
  TDocument extends Record<string, unknown> = Record<string, unknown>
>(
  documentId: string,
  initial: TState,
  selectIncoming: (document: TDocument) => TItem[] | null | undefined
): TState {
  return useOptimistic<TState, TDocument>(initial, (current, action) => {
    const { id, document } = action as SanityOptimisticAction<TDocument>

    if (id !== documentId) {
      return current
    }

    const incoming = selectIncoming(document)
    if (!incoming) {
      return current
    }

    return mergeOptimisticByKey(current, incoming) as TState
  })
}
