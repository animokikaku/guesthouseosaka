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
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'

type HousePageContentProps = {
  houseId: HouseIdentifier
  title: string
  description: string
}

const THEME_COLORS: Record<HouseIdentifier, string> = {
  apple: 'bg-red-600 dark:bg-red-500',
  lemon: 'bg-yellow-400 dark:bg-yellow-500',
  orange: 'bg-orange-500 dark:bg-orange-600'
}

export async function HousePageContent({
  houseId,
  title,
  description
}: HousePageContentProps) {
  return (
    <>
      <MobileHeroImage house={houseId} />
      <div className="bg-background relative z-10 -mt-8 rounded-t-3xl pt-8 sm:mt-0 sm:rounded-none sm:pt-0">
        <PageHeader className="pt-0 sm:pt-8">
          <PageHeaderHeading>{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
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
            <ImageBlockGallery id={houseId} />
            <article
              id={houseId}
              aria-labelledby={`${houseId}-title`}
              className="space-y-12 pt-8"
            >
              <HouseAbout id={houseId} />
              <HouseAmenities id={houseId} />
              <HouseLocation id={houseId} />
              <HousePricing id={houseId} />
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
