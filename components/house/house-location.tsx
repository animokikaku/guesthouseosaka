'use client'

import { HouseLocationModal } from '@/components/house/house-location-modal'
import {
  HouseSection,
  HouseSectionContent,
  HouseSectionHeading
} from '@/components/house/house-section'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { LocationData, MapData } from '@/lib/types/components'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

function MapSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading map"
      className="md:border-border flex flex-col gap-6 overflow-hidden md:flex-row md:gap-0 md:rounded-lg md:border"
    >
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

const HouseMap = dynamic(() => import('@/components/house/house-map').then((mod) => mod.HouseMap), {
  ssr: false,
  loading: () => <MapSkeleton />
})

interface LazyHouseMapProps {
  center: { lat: number; lng: number }
  placeId: string
  placeImage: MapData['placeImage']
  mapsUrl?: string
}

function LazyHouseMap({ center, placeId, placeImage, mapsUrl }: LazyHouseMapProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '400px', // Start loading 400px before viewport to allow Google Maps (~1.5MB) to load
        threshold: 0
      }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <HouseMap center={center} placeId={placeId} placeImage={placeImage} mapsUrl={mapsUrl} />
      ) : (
        <MapSkeleton />
      )}
    </div>
  )
}

interface HouseLocationProps {
  location: LocationData
  map: MapData | null
}

export function HouseLocation({ location, map }: HouseLocationProps) {
  const { highlight, details } = location
  const t = useTranslations('HouseLocation')

  return (
    <HouseSection id="location" aria-labelledby="location-title">
      <HouseSectionHeading id="location-title">{t('heading')}</HouseSectionHeading>
      <HouseSectionContent>
        <p className="text-foreground text-base leading-relaxed">{highlight}</p>
        {map && (
          <LazyHouseMap
            center={map.coordinates}
            placeId={map.placeId}
            placeImage={map.placeImage}
            mapsUrl={map.googleMapsUrl}
          />
        )}
        <HouseLocationModal details={details} title={t('heading')}>
          <Button variant="outline">{t('modal_trigger')}</Button>
        </HouseLocationModal>
      </HouseSectionContent>
    </HouseSection>
  )
}
