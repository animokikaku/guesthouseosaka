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
import {
  toAboutContent,
  toAmenityCategories,
  toBuildingData,
  toFeaturedAmenities,
  toLocationData,
  toMapData,
  toPricingRows
} from '@/lib/transforms/house'
import { cn } from '@/lib/utils'
import { HOUSE_THEME_COLORS } from '@/lib/utils/theme'
import type { HouseQueryResult, HousesNavQueryResult } from '@/sanity.types'
import type { ComponentProps } from 'react'

export function HousePageContent({
  _id,
  _type,
  slug,
  title,
  description,
  galleryImages,
  featuredImage,
  amenityCategories,
  featuredAmenities,
  location,
  map,
  pricing,
  about,
  building,
  houses
}: NonNullable<HouseQueryResult> & { houses: HousesNavQueryResult }) {
  const href: ComponentProps<typeof Link>['href'] = {
    pathname: '/[house]/gallery',
    params: { house: slug }
  }

  // Build mobile hero images: featured first (if present), then gallery images
  const mobileHeroImages: GalleryImage[] = featuredImage?.asset
    ? [featuredToGalleryImage(featuredImage), ...(galleryImages ?? [])]
    : galleryImages ?? []

  return (
    <>
      <MobileHeroImage href={href} images={mobileHeroImages} />
      <div className="bg-background relative z-10 -mt-8 rounded-t-3xl pt-8 sm:mt-0 sm:rounded-none sm:pt-0">
        <PageHeader className="pt-0 sm:pt-8">
          <PageHeaderHeading id={`${slug}-title`}>{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <div
            className={cn('mx-auto mt-6 h-1 w-24', HOUSE_THEME_COLORS[slug])}
            aria-hidden="true"
          />
        </PageHeader>
      </div>
      <div className="container-wrapper section-soft flex-1 pb-12">
        <div className="container max-w-6xl">
          <PageNav id="tabs">
            <HousesNav houses={houses} />
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
                about={toAboutContent(about)}
                building={toBuildingData(building)}
              />
              <HouseAmenities
                documentId={_id}
                documentType={_type}
                amenityCategories={toAmenityCategories(amenityCategories)}
                featuredAmenities={toFeaturedAmenities(featuredAmenities)}
              />
              <HouseLocation
                location={toLocationData(location)}
                map={toMapData(map)}
              />
              <HousePricing pricing={toPricingRows(pricing)} />
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
