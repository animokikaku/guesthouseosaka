'use client'

import { assets } from '@/lib/assets'
import { HouseIdentifier } from '@/lib/types'
import { ColorScheme, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { memo } from 'react'

const PLACE_IDS = {
  orange: 'ChIJ6wny0-ndAGARZjNwMl6Naig',
  apple: 'ChIJeTfoJiPnAGARS9lOqv7CCIc',
  lemon: 'ChIJcUK9NYvnAGAR7GqSLIZIUdk'
}

export const PlaceDetails = memo(function PlaceDetailsComponent({
  id,
  className
}: {
  id: HouseIdentifier
  className?: string
}) {
  const { resolvedTheme } = useTheme()
  const colorScheme =
    resolvedTheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

  useMapsLibrary('places')
  const placeId = PLACE_IDS[id]
  const image = assets[id].map

  return (
    <PlaceDetailsCompact
      id={placeId}
      image={image}
      colorScheme={colorScheme}
      className={className}
    />
  )
})

interface GoogleMapsPlaceDetailsProps {
  id: string
  image: (typeof assets)[HouseIdentifier]['map']
  colorScheme: ColorScheme
  className?: string
}

function PlaceDetailsCompact({
  id,
  image,
  colorScheme,
  className
}: GoogleMapsPlaceDetailsProps) {
  return (
    <div className="overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <Image
          {...image}
          alt={image.alt}
          placeholder="blur"
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <gmp-place-details-compact style={{ colorScheme }} className={className}>
        <gmp-place-details-place-request
          place={id}
        ></gmp-place-details-place-request>
        <gmp-place-content-config>
          <gmp-place-address></gmp-place-address>
          <gmp-place-rating></gmp-place-rating>
          <gmp-place-type></gmp-place-type>
          <gmp-place-price></gmp-place-price>
          <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
          <gmp-place-phone-number></gmp-place-phone-number>
          <gmp-place-summary></gmp-place-summary>
          <gmp-place-type-specific-highlights></gmp-place-type-specific-highlights>
          <gmp-place-reviews></gmp-place-reviews>
          <gmp-place-open-now-status></gmp-place-open-now-status>
          <gmp-place-feature-list></gmp-place-feature-list>
        </gmp-place-content-config>
      </gmp-place-details-compact>
    </div>
  )
}
