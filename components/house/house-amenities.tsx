'use client'

import { useHouseDocument } from '@/components/house/house-context'
import {
  HouseSection,
  HouseSectionContent,
  HouseSectionHeading
} from '@/components/house/house-section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { useIsMobile } from '@/hooks/use-mobile'
import { Icon } from '@/lib/icons'
import type {
  AmenityCategoryData,
  AmenityItemData
} from '@/lib/types/components'
import { stegaClean } from '@sanity/client/stega'
import { useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'
import { useOptimistic } from 'next-sanity/hooks'
import { SanityDocument } from 'sanity'

type DataAttributeFn = (path: string) => string

interface HouseAmenitiesProps {
  amenityCategories: AmenityCategoryData[]
  featuredAmenities: AmenityItemData[]
}

interface AmenitiesDialogProps {
  amenityCategories: AmenityCategoryData[]
  noteLabels: Record<string, string>
  trigger: React.ReactNode
  title: string
  dataAttribute?: DataAttributeFn
}

interface AmenityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  amenity: AmenityItemData
  noteLabel?: string
  'data-sanity'?: string
}

function AmenityItem({ amenity, noteLabel, ...props }: AmenityItemProps) {
  return (
    <div className="flex items-center gap-3 py-2" {...props}>
      <div className="text-muted-foreground h-5 w-5 shrink-0">
        <Icon name={amenity.icon} className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <span className="text-foreground">{amenity.label}</span>
        {noteLabel && (
          <Badge variant="outline" className="ml-2 text-xs">
            {noteLabel}
          </Badge>
        )}
      </div>
    </div>
  )
}

function AmenitiesDialog({
  noteLabels,
  trigger,
  title,
  amenityCategories,
  dataAttribute
}: AmenitiesDialogProps) {
  if (!amenityCategories || amenityCategories.length === 0) return null

  return (
    <ResponsiveModal trigger={trigger} title={title} contentClassName="pt-8">
      <div className="space-y-8">
        {amenityCategories.map((cat) => (
          <div
            key={cat._key}
            data-sanity={dataAttribute?.(
              `amenityCategories[_key=="${cat._key}"].items`
            )}
          >
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              {cat.label}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {cat.items.map((amenity) => (
                <AmenityItem
                  key={amenity._key}
                  amenity={{
                    ...amenity,
                    label: amenity.label ? stegaClean(amenity.label) : null
                  }}
                  noteLabel={
                    amenity.note
                      ? noteLabels[stegaClean(amenity.note)]
                      : undefined
                  }
                  data-sanity={dataAttribute?.(
                    `amenityCategories[_key=="${cat._key}"].items[_key=="${amenity._key}"]`
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ResponsiveModal>
  )
}

export function HouseAmenities({
  amenityCategories: initialCategories,
  featuredAmenities
}: HouseAmenitiesProps) {
  const { id, type } = useHouseDocument()
  const isMobile = useIsMobile()
  const t = useTranslations('HouseAmenities')

  const amenityCategories = useOptimistic<
    AmenityCategoryData[],
    SanityDocument & { amenityCategories?: AmenityCategoryData[] }
  >(initialCategories, (currentCategories, action) => {
    if (action.id === id && action.document.amenityCategories) {
      // Optimistic document only has partial data, merge with current
      return action.document.amenityCategories.map(
        (cat) => currentCategories?.find((c) => c._key === cat._key) ?? cat
      )
    }
    return currentCategories
  })

  const dataAttribute = createDataAttribute({ id, type })

  const noteLabels: Record<string, string> = {
    private: t('notes.private'),
    shared: t('notes.shared'),
    coin: t('notes.coin')
  }

  // Featured amenities: GROQ provides max 10, slice to 5 on mobile
  const displayedFeatured = isMobile
    ? featuredAmenities.slice(0, 5)
    : featuredAmenities

  const totalAmenitiesCount = amenityCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  )

  return (
    <HouseSection id="amenities" aria-labelledby="amenities-title">
      <HouseSectionHeading id="amenities-title">
        {t('heading')}
      </HouseSectionHeading>
      <HouseSectionContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {displayedFeatured.map((amenity) => (
            <AmenityItem
              key={amenity._key}
              amenity={amenity}
              noteLabel={
                amenity.note ? noteLabels[stegaClean(amenity.note)] : undefined
              }
            />
          ))}
        </div>

        <AmenitiesDialog
          title={t('heading')}
          amenityCategories={amenityCategories}
          noteLabels={noteLabels}
          dataAttribute={dataAttribute}
          trigger={
            <Button variant="outline">
              {t('show_all', {
                count: `${totalAmenitiesCount}`
              })}
            </Button>
          }
        />
      </HouseSectionContent>
    </HouseSection>
  )
}
