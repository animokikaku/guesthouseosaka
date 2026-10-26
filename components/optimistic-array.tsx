import { useIsDraftMode } from '@/components/draft-mode-context'
import { lazy, Suspense, type ReactNode } from 'react'

const LiveOptimisticArray = lazy(() => import('@/components/optimistic-array.live'))

export type OptimisticArrayProps<
  TItem extends { _key: string },
  TDocument extends Record<string, unknown>
> = {
  documentId: string
  value: TItem[] | null | undefined
  // Methods rather than function properties, so the lazily loaded live part,
  // typed for any item, accepts these props whatever their item type.
  /** The array field in the raw document Presentation reports an edit to. */
  select(this: void, document: TDocument): TItem[] | null | undefined
  children(this: void, value: TItem[] | null | undefined): ReactNode
}

/**
 * Renders an array field, applying Studio edits to it as they happen while the
 * page is open in Presentation (see `reduceOptimisticArray`). Outside draft
 * mode it renders the value as is, so regular visitors never load Visual
 * Editing's optimistic-update machinery.
 */
export function OptimisticArray<
  TItem extends { _key: string },
  TDocument extends Record<string, unknown>
>(props: OptimisticArrayProps<TItem, TDocument>) {
  if (!useIsDraftMode()) return props.children(props.value)

  return (
    <Suspense fallback={props.children(props.value)}>
      <LiveOptimisticArray {...props} />
    </Suspense>
  )
}
