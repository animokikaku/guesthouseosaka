'use client'

import {
  BOUNDS,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM
} from '@/components/map/location-map-constants'
import { env } from '@/lib/env'
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'

import React from 'react'

type GoogleMapProps = Omit<
  MapProps,
  'colorScheme' | 'disableDefaultUI' | 'mapId'
>

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
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      language={locale}
      libraries={['marker']}
    >
      {children}
    </APIProvider>
  )
}
