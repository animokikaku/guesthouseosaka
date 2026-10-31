import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'use-intl'

/** Holds `HouseMap`'s place while it loads; keep the two layouts in step. */
export function HouseMapSkeleton() {
  const t = useTranslations('HouseLocation')

  return (
    <div
      aria-busy="true"
      className="md:border-border flex min-h-120 flex-col gap-6 overflow-hidden md:flex-row md:gap-0 md:rounded-lg md:border"
    >
      {/* `output` (implicit role=status) announces the load politely. It only
          accepts phrasing content, so it wraps the text rather than the
          skeleton boxes below, which are decorative and expose no text. */}
      <output className="sr-only">{t('loading_map')}</output>
      {/* PlaceDetails skeleton */}
      <div className="border-border flex min-h-120 flex-col overflow-hidden rounded-lg border bg-white md:w-1/3 md:shrink-0 md:rounded-none md:border-0 md:border-r dark:bg-[#131314]">
        {/* Image skeleton - takes half the height, clipped by parent overflow */}
        <Skeleton className="h-1/2 w-full rounded-none" />
        <Separator />
        {/* Text skeletons */}
        <div className="flex flex-1 flex-col gap-3 p-4 md:p-6">
          {/* Title */}
          <Skeleton className="h-6 w-3/4" />
          {/* 3 lines of text */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      {/* Map skeleton */}
      <div className="md:w-2/3">
        <Skeleton className="border-border h-100 w-full rounded-lg border md:h-full md:rounded-none md:border-0" />
      </div>
    </div>
  )
}
