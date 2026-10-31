import { HouseLocationModal } from '@/components/house/house-location-modal'
import { HouseMapSkeleton } from '@/components/house/house-map-skeleton'
import { HouseSectionContent, HouseSectionHeading } from '@/components/house/house-section'
import { Button } from '@/components/ui/button'
import { useHasBeenNearViewport } from '@/hooks/use-has-been-near-viewport'
import type { LocationData, MapData } from '@/lib/types/components'
import { useTranslations } from 'use-intl'
import { lazy, Suspense } from 'react'

// Only requested once the map nears the viewport (see `LazyHouseMap`), so it
// never renders on the server.
const HouseMap = lazy(() =>
  import('@/components/house/house-map').then((mod) => ({ default: mod.HouseMap }))
)

function LazyHouseMap({ map }: { map: MapData }) {
  // Start loading 400px early to give Google Maps (~1.5MB) time to arrive.
  const [ref, isNearViewport] = useHasBeenNearViewport<HTMLDivElement>('400px')

  return (
    <div ref={ref}>
      {isNearViewport ? (
        <Suspense fallback={<HouseMapSkeleton />}>
          <HouseMap map={map} />
        </Suspense>
      ) : (
        <HouseMapSkeleton />
      )}
    </div>
  )
}

interface HouseLocationProps {
  location: LocationData | null
  map: MapData | null
}

export function HouseLocation({ location, map }: HouseLocationProps) {
  const t = useTranslations('HouseLocation')

  return (
    <section id="location" aria-labelledby="location-title">
      <HouseSectionHeading id="location-title">{t('heading')}</HouseSectionHeading>
      <HouseSectionContent>
        <p className="text-foreground text-base leading-relaxed">{location?.highlight}</p>
        {map && <LazyHouseMap map={map} />}
        <HouseLocationModal details={location?.details ?? null} title={t('heading')}>
          <Button variant="outline">{t('modal_trigger')}</Button>
        </HouseLocationModal>
      </HouseSectionContent>
    </section>
  )
}
