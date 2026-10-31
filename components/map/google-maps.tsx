import { env } from '@/lib/env'
import { APIProvider, Map, type MapProps } from '@vis.gl/react-google-maps'
import { useLocale } from 'use-intl'
import { useTheme } from 'next-themes'

import React from 'react'

const DEFAULT_ZOOM = 14
const MIN_ZOOM = 10
const BOUNDS = {
  north: 34.752207,
  south: 34.552207,
  east: 135.646402,
  west: 135.366402
}
const DEFAULT_CENTER = { lat: 34.652207, lng: 135.506402 } as const

type GoogleMapProps = Omit<MapProps, 'colorScheme' | 'disableDefaultUI' | 'mapId'>

export function GoogleMaps({
  defaultCenter = DEFAULT_CENTER,
  defaultZoom = DEFAULT_ZOOM,
  minZoom = MIN_ZOOM,
  restriction = { latLngBounds: BOUNDS, strictBounds: false },
  ...props
}: GoogleMapProps) {
  const { resolvedTheme } = useTheme()
  const colorScheme = resolvedTheme === 'dark' ? 'DARK' : 'LIGHT'

  return (
    <Map
      mapId="32c1564895c1bcaf8937acc9"
      reuseMaps
      colorScheme={colorScheme}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      minZoom={minZoom}
      restriction={restriction}
      disableDefaultUI
      {...props}
    />
  )
}

export function MapProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()

  return (
    <APIProvider apiKey={env.VITE_GOOGLE_MAPS_API_KEY} language={locale} libraries={['marker']}>
      {children}
    </APIProvider>
  )
}
