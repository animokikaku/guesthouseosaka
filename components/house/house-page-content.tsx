import { HouseAbout } from '@/components/house/house-about'
import { HouseAmenities } from '@/components/house/house-amenities'
import { HouseBuilding } from '@/components/house/house-building'
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
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { HouseQueryResult } from '@/sanity.types'

type HousePageContentProps = {
  data: NonNullable<HouseQueryResult>
  dataAttribute?: (path: string) => string
}

const THEME_COLORS: Record<HouseIdentifier, string> = {
  apple: 'bg-red-600 dark:bg-red-500',
  lemon: 'bg-yellow-400 dark:bg-yellow-500',
  orange: 'bg-orange-500 dark:bg-orange-600'
}

export function HousePageContent({
  data,
  dataAttribute
}: HousePageContentProps) {
  const houseId = data.slug

  return (
    <>
      <MobileHeroImage id={houseId} />
      <div className="bg-background relative z-10 -mt-8 rounded-t-3xl pt-8 sm:mt-0 sm:rounded-none sm:pt-0">
        <PageHeader className="pt-0 sm:pt-8">
          <PageHeaderHeading>{data.title}</PageHeaderHeading>
          <PageHeaderDescription>{data.description}</PageHeaderDescription>
          <div
            className={cn('mx-auto mt-6 h-1 w-24', THEME_COLORS[houseId])}
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
            <ImageBlockGallery id={houseId} gallery={data.gallery} />
            <article
              id={houseId}
              aria-labelledby={`${houseId}-title`}
              className="space-y-12 pt-8"
            >
              <HouseAbout
                title={data.title}
                about={data.about}
                building={
                  <HouseBuilding
                    id={houseId}
                    building={data.building}
                    dataAttribute={dataAttribute}
                  />
                }
              />
              <HouseAmenities amenities={data.amenities} />
              <HouseLocation id={houseId} location={data.location} />
              <HousePricing pricing={data.pricing} />
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
