import { HouseAbout } from '@/components/house/house-about'
import { HouseAmenities } from '@/components/house/house-amenities'
import { HouseAvailability } from '@/components/house/house-availability'
import { HouseProvider } from '@/components/house/house-context'
import { HouseLocation } from '@/components/house/house-location'
import { HousePricing } from '@/components/house/house-pricing'
import { MobileHeroImage } from '@/components/house/mobile-hero-image'
import { HousesNav } from '@/components/houses-nav'
import { ImageBlockGallery } from '@/components/image-block-gallery'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { PageNav } from '@/components/page-nav'
import { Link } from '@/i18n/navigation'
import { summarizeAvailability } from '@/lib/availability'
import { buildGallerySlides } from '@/lib/gallery'
import { toAmenityCategories, toAmenityItem, toMapData } from '@/lib/transforms/house'
import type { StegaAware } from '@/lib/types/stega'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/house-theme'
import type { HouseQueryResult, HousesTitlesQueryResult } from '@/sanity.types'
import { stegaClean } from 'next-sanity'
import type { ComponentProps } from 'react'

export function HousePageContent({
  _id,
  _type,
  slug,
  title,
  description,
  galleryImages,
  galleryPreview,
  galleryImageCount,
  featuredImage,
  amenityCategories,
  featuredAmenities,
  location,
  map,
  pricing,
  about,
  building,
  _updatedAt,
  rooms,
  houses,
  today
}: StegaAware<NonNullable<HouseQueryResult>> & { houses: HousesTitlesQueryResult; today: string }) {
  const href: ComponentProps<typeof Link>['href'] = {
    pathname: '/[house]/gallery',
    params: { house: slug }
  }

  const mobileHeroImages = buildGallerySlides({ featuredImage, galleryImages })

  // Dates and enum values are compared, so drop any visual-editing markers first
  const availability = summarizeAvailability(
    rooms?.map((room) => ({
      ...room,
      availableFrom: stegaClean(room.availableFrom),
      style: stegaClean(room.style)
    })),
    today
  )

  return (
    <>
      <MobileHeroImage href={href} images={mobileHeroImages} />
      <div className="bg-background relative z-10 -mt-8 rounded-t-3xl pt-8 sm:mt-0 sm:rounded-none sm:pt-0">
        <PageHeader className="pt-0 sm:pt-8">
          <PageHeaderHeading id={`${slug}-title`}>{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <div
            className={cn('mx-auto mt-6 h-1 w-24', HOUSE_COLORS[slug].divider)}
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
              galleryPreview={galleryPreview}
              galleryImageCount={galleryImageCount ?? 0}
              featuredImage={featuredImage}
            />
            <HouseProvider id={_id} type={_type} slug={slug}>
              <article id={slug} aria-labelledby={`${slug}-title`} className="space-y-12 pt-8">
                <HouseAbout
                  title={title}
                  about={about}
                  building={building}
                  availability={
                    <HouseAvailability
                      document={{ _id, _type, _updatedAt: stegaClean(_updatedAt) }}
                      summary={availability}
                      today={today}
                    />
                  }
                />
                <HouseAmenities
                  amenityCategories={toAmenityCategories(amenityCategories)}
                  featuredAmenities={featuredAmenities?.map(toAmenityItem) ?? []}
                />
                <HouseLocation location={location} map={toMapData(map)} />
                <HousePricing pricing={pricing} />
              </article>
            </HouseProvider>
          </div>
        </div>
      </div>
    </>
  )
}
