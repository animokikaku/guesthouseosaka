'use client'

import { SanityImage as SanityImageComponent } from '@/components/sanity-image'
import type { SanityImage } from '@/lib/types/components'
import { urlFor } from '@/sanity/lib/image'
import { ColorScheme, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
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
  const colorScheme = resolvedTheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

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
  const t = useTranslations('PlaceDetails')

  return (
    <div className="overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <SanityImageComponent
          src={urlFor(placeImage).width(600).height(400).fit('crop').url()}
          alt={placeImage.alt ?? t('fallback_alt')}
          width={600}
          height={400}
          placeholder={placeImage.preview ? 'blur' : 'empty'}
          blurDataURL={placeImage.preview ?? undefined}
          className="h-auto w-full object-cover"
          // The HouseMap panel: full width below md, then md:w-1/3 of the
          // house page's `container max-w-6xl`, less its borders. Keep in
          // sync with house-map.tsx and house-page-content.tsx.
          sizes="(min-width: 1168px) 361px, (min-width: 1024px) calc(33.33vw - 28px), (min-width: 768px) calc(33.33vw - 18px), calc(100vw - 50px)"
        />
      </div>
      <gmp-place-details-compact style={{ colorScheme }} className={className}>
        <gmp-place-details-place-request place={id}></gmp-place-details-place-request>
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
