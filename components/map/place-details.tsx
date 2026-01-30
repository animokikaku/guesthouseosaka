'use client'

import type { SanityImage } from '@/lib/types/components'
import { urlFor } from '@/sanity/lib/image'
import { ColorScheme, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { memo } from 'react'

interface PlaceDetailsProps {
  placeId: string
  placeImage: SanityImage
  className?: string
}

export const PlaceDetails = memo(function PlaceDetailsComponent({
  placeId,
  placeImage,
  className
}: PlaceDetailsProps) {
  const { resolvedTheme } = useTheme()
  const colorScheme =
    resolvedTheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

  useMapsLibrary('places')

  return (
    <PlaceDetailsCompact
      id={placeId}
      placeImage={placeImage}
      colorScheme={colorScheme}
      className={className}
    />
  )
})

interface GoogleMapsPlaceDetailsProps {
  id: string
  placeImage: SanityImage
  colorScheme: ColorScheme
  className?: string
}

function PlaceDetailsCompact({
  id,
  placeImage,
  colorScheme,
  className
}: GoogleMapsPlaceDetailsProps) {
  return (
    <div className="overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <Image
          src={urlFor(placeImage)
            .width(600)
            .height(400)
            .dpr(2)
            .fit('crop')
            .url()}
          alt={placeImage.alt ?? ''}
          width={600}
          height={400}
          placeholder={placeImage.preview ? 'blur' : 'empty'}
          blurDataURL={placeImage.preview ?? undefined}
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
          <gmp-place-open-now-status></gmp-place-open-now-status>
        </gmp-place-content-config>
      </gmp-place-details-compact>
    </div>
  )
}
