import { HouseAbout } from '@/components/house/house-about'
import { HouseAmenities } from '@/components/house/house-amenities'
import { HouseLocation } from '@/components/house/house-location'
import { HousePricing } from '@/components/house/house-pricing'
import { MobileHeroImage } from '@/components/house/mobile-hero-image'
import { HousesNav } from '@/components/houses-nav'
import { ImageBlockGallery } from '@/components/image-block-gallery'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from '@/components/page-header'
import { PageNav } from '@/components/page-nav'
import { Link } from '@/i18n/navigation'
import { featuredToGalleryImage, type GalleryImage } from '@/lib/gallery'
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { HouseQueryResult } from '@/sanity.types'
import { ComponentProps } from 'react'

const THEME_COLORS: Record<HouseIdentifier, string> = {
  apple: 'bg-red-600 dark:bg-red-500',
  lemon: 'bg-yellow-400 dark:bg-yellow-500',
  orange: 'bg-orange-500 dark:bg-orange-600'
}

export function HousePageContent({
  _id,
  _type,
  slug,
  title,
  description,
  galleryImages,
  featuredImage,
  amenities,
  location,
  pricing,
  about,
  building
}: NonNullable<HouseQueryResult>) {
  const href: ComponentProps<typeof Link>['href'] = {
    pathname: '/[house]/gallery',
    params: { house: slug }
  }

  // Build mobile hero images: featured first (if present), then gallery images
  const mobileHeroImages: GalleryImage[] = featuredImage?.asset
    ? [featuredToGalleryImage(featuredImage), ...(galleryImages ?? [])]
    : (galleryImages ?? [])

  return (
    <>
      <MobileHeroImage href={href} images={mobileHeroImages} />
      <div className="bg-background relative z-10 -mt-8 rounded-t-3xl pt-8 sm:mt-0 sm:rounded-none sm:pt-0">
        <PageHeader className="pt-0 sm:pt-8">
          <PageHeaderHeading>{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <div
            className={cn('mx-auto mt-6 h-1 w-24', THEME_COLORS[slug])}
            aria-hidden="true"
          />
        </PageHeader>
      </div>
      <div className="container-wrapper section-soft flex-1 pb-12">
        <div className="container max-w-6xl">
          <PageNav id="tabs">
            <HousesNav />
          </PageNav>
          <div className="theme-container">
            <ImageBlockGallery
              href={href}
              galleryImages={galleryImages}
              featuredImage={featuredImage}
            />
            <article
              id={slug}
              aria-labelledby={`${slug}-title`}
              className="space-y-12 pt-8"
            >
              <HouseAbout
                _id={_id}
                _type={_type}
                slug={slug}
                title={title}
                about={about}
                building={building}
              />
              <HouseAmenities amenities={amenities} />
              {location && (
                <HouseLocation
                  slug={slug}
                  coordinates={location.coordinates}
                  placeId={location.placeId}
                  highlight={location.highlight}
                  details={location.details}
                  googleMapsUrl={location.googleMapsUrl}
                />
              )}
              <HousePricing pricing={pricing} />
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
