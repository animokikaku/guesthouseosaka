'use client'

import { useOptimistic } from 'next-sanity/hooks'

function mergeOptimisticByKey<T extends { _key: string }>(
  current: T[] | null | undefined,
  incoming: T[]
): T[] {
  return incoming.map((item) => current?.find((c) => c._key === item._key) ?? item)
}

/**
 * Optimistically updates a Sanity array field, merging incoming partial items
 * with the current resolved data by `_key`.
 */
// These generics preserve each caller's document and nullable state shapes across the SDK callback.
// oxlint-disable typescript/no-unnecessary-type-parameters, typescript/no-unsafe-type-assertion
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
    const { id, document } = action

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
// oxlint-enable typescript/no-unnecessary-type-parameters, typescript/no-unsafe-type-assertion
