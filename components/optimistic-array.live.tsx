import type { OptimisticArrayProps } from '@/components/optimistic-array'
import { reduceOptimisticArray } from '@/lib/sanity-optimistic'
import { useOptimistic } from '@sanity/visual-editing/react'

/** `OptimisticArray` in draft mode, in its own chunk with Visual Editing's mutator. */
export default function LiveOptimisticArray<
  TItem extends { _key: string },
  TDocument extends Record<string, unknown>
>({ documentId, value, select, children }: OptimisticArrayProps<TItem, TDocument>) {
  const state = useOptimistic<TItem[] | null | undefined, TDocument>(
    value,
    reduceOptimisticArray<TItem, TItem[] | null | undefined, TDocument>(documentId, select)
  )
  return children(state)
}
