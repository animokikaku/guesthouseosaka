import { HouseAbout } from '@/components/house/house-about'
import { HouseAmenities } from '@/components/house/house-amenities'
import { HouseAvailability } from '@/components/house/house-availability'
import { HouseFloorPlan } from '@/components/house/house-floor-plan'
import { HouseProvider } from '@/components/house/house-context'
import { HouseLocation } from '@/components/house/house-location'
import { HousePricing } from '@/components/house/house-pricing'
import { MobileHeroImage } from '@/components/house/mobile-hero-image'
import { HousesNav } from '@/components/houses-nav'
import { ImageBlockGallery } from '@/components/image-block-gallery'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { PageNav } from '@/components/page-nav'
import { galleryLink } from '@/components/house/gallery-link'
import { summarizeAvailability } from '@/lib/availability'
import { buildGallerySlides } from '@/lib/gallery'
import { toAmenityCategories, toAmenityItem, toMapData } from '@/lib/transforms/house'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/house-theme'
import type { HouseQueryResult, HousesTitlesQueryResult } from '@/sanity.types'
import { stegaClean } from '@sanity/client/stega'
import { useLocale } from 'use-intl'

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
}: NonNullable<HouseQueryResult> & { houses: HousesTitlesQueryResult; today: string }) {
  const href = galleryLink(useLocale(), slug)

  const mobileHeroImages = buildGallerySlides({ featuredImage, galleryImages })

  // Numbers, dates and enum values are compared or sliced, so drop any visual-editing
  // markers first; the room cards and buttons carry their own `data-sanity` attributes
  const cleanRooms = rooms?.map((room) => ({
    ...room,
    number: stegaClean(room.number),
    availableFrom: stegaClean(room.availableFrom),
    style: stegaClean(room.style)
  }))
  const availability = summarizeAvailability(cleanRooms, today)

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
                  // `HousePricing` renders nothing without rows.
                  hasPricing={Boolean(pricing?.length)}
                  availability={
                    <HouseAvailability
                      document={{ _id, _type, _updatedAt: stegaClean(_updatedAt) }}
                      summary={availability}
                      today={today}
                    />
                  }
                  floorPlan={
                    rooms?.length ? (
                      <HouseFloorPlan document={{ _id, _type }} rooms={cleanRooms} today={today} />
                    ) : null
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
