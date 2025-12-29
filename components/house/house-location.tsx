'use client'

import { HouseLocationModal } from '@/components/house/house-location-modal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { LocationData, MapData } from '@/lib/types/components'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

const HouseMap = dynamic(
  () => import('@/components/house/house-map').then((mod) => mod.HouseMap),
  {
    ssr: false,
    loading: () => (
      <div className="md:border-border flex flex-col gap-6 overflow-hidden md:flex-row md:gap-0 md:rounded-lg md:border">
        {/* PlaceDetails skeleton */}
        <div className="border-border flex h-[478px] flex-col overflow-hidden rounded-lg border bg-white md:w-1/3 md:shrink-0 md:rounded-none md:border-0 md:border-r dark:bg-[#131314]">
          {/* Image skeleton - takes half the height, clipped by parent overflow */}
          <Skeleton className="h-1/2 w-full rounded-none" />
          <hr />
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
          <Skeleton className="border-border h-[478px] w-full rounded-lg border md:rounded-none md:border-0" />
        </div>
      </div>
    )
  }
)

interface HouseLocationProps {
  location: LocationData
  map: MapData
}

export function HouseLocation({ location, map }: HouseLocationProps) {
  const { highlight, details } = location
  const { coordinates, placeId, placeImage, googleMapsUrl } = map
  const t = useTranslations('HouseLocation')

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>

      <p className="text-foreground mb-6 text-base leading-relaxed">
        {highlight}
      </p>

      <div className="mb-6">
        {coordinates.lat !== undefined && coordinates.lng !== undefined && (
          <HouseMap
            center={{ lat: coordinates.lat, lng: coordinates.lng }}
            placeId={placeId}
            placeImage={placeImage}
            mapsUrl={googleMapsUrl ?? undefined}
          />
        )}
      </div>

      <div className="mt-6">
        <HouseLocationModal details={details} title={t('heading')}>
          <Button variant="outline" disabled={!details || details.length === 0}>
            {t('modal_trigger')}
          </Button>
        </HouseLocationModal>
      </div>
    </section>
  )
}
