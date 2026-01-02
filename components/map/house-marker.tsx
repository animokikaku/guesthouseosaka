'use client'

import { cn } from '@/lib/utils'
import { AdvancedMarker, AdvancedMarkerProps } from '@vis.gl/react-google-maps'

interface HouseMarkerProps extends Omit<
  AdvancedMarkerProps,
  'position' | 'onClick'
> {
  center?: { lat: number; lng: number }
  isActive?: boolean
  mapsUrl?: string
}

export function HouseMarker({
  center,
  className,
  mapsUrl,
  ...markerProps
}: HouseMarkerProps) {
  return (
    <AdvancedMarker
      className={cn('transition-transform duration-200 ease-in-out', className)}
      position={center}
      onClick={() => {
        if (!mapsUrl) return
        window.open(mapsUrl, '_blank', 'noopener,noreferrer')
      }}
      {...markerProps}
    />
  )
}
