'use client'

import {
  GOOGLE_MAPS_URLS,
  HOUSE_CENTERS
} from '@/components/map/location-map-constants'
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AdvancedMarker, AdvancedMarkerProps } from '@vis.gl/react-google-maps'

interface HouseMarkerProps
  extends Omit<AdvancedMarkerProps, 'position' | 'onClick'> {
  id: HouseIdentifier
  center?: { lat: number; lng: number }
  isActive?: boolean
}

export function HouseMarker({
  id,
  center,
  className,
  ...markerProps
}: HouseMarkerProps) {
  // Use provided center or fallback to constants
  const position = center ?? HOUSE_CENTERS[id]
  const mapsUrl = GOOGLE_MAPS_URLS[id]

  return (
    <AdvancedMarker
      className={cn('transition-transform duration-200 ease-in-out', className)}
      position={position}
      onClick={() => {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer')
      }}
      {...markerProps}
    />
  )
}
