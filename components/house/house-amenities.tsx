import { useHouseDocument } from '@/components/house/house-context'
import { HouseSectionContent, HouseSectionHeading } from '@/components/house/house-section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Icon } from '@/lib/icons'
import { OptimisticArray } from '@/components/optimistic-array'
import type { AmenityCategoryData, AmenityItemData } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { stegaClean } from '@sanity/client/stega'
import { useTranslations } from 'use-intl'
import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute'
import type { DataAttributeFn } from '@/lib/types/stega'

interface HouseAmenitiesProps {
  amenityCategories: AmenityCategoryData[]
  featuredAmenities: AmenityItemData[]
}

/** Badge text per amenity note; `note` is stega-cleaned by `toAmenityItem`. */
type NoteLabels = Record<NonNullable<AmenityItemData['note']>, string>

interface AmenitiesDialogProps {
  amenityCategories: AmenityCategoryData[]
  noteLabels: NoteLabels
  trigger: React.ReactElement
  title: string
  dataAttribute?: DataAttributeFn
}

interface AmenityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  amenity: AmenityItemData
  noteLabel?: string
  'data-sanity'?: string
}

function AmenityItem({ amenity, noteLabel, className, ...props }: AmenityItemProps) {
  return (
    <div className={cn('flex items-center gap-3 py-2', className)} {...props}>
      <div className="text-muted-foreground size-5 shrink-0">
        <Icon name={amenity.icon} className="size-5" />
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
  if (amenityCategories.length === 0) return null

  return (
    <ResponsiveModal trigger={trigger} title={title}>
      <div className="space-y-8">
        {amenityCategories.map((cat) => (
          <div
            key={cat._key}
            data-sanity={dataAttribute?.(`amenityCategories[_key=="${cat._key}"].items`)}
          >
            <h3 className="text-foreground mb-4 text-lg font-semibold">{cat.label}</h3>
            <div className="grid grid-cols-1 gap-2">
              {cat.items.map((amenity) => (
                <AmenityItem
                  key={amenity._key}
                  amenity={{
                    ...amenity,
                    label: amenity.label ? stegaClean(amenity.label) : null
                  }}
                  noteLabel={amenity.note ? noteLabels[amenity.note] : undefined}
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

export function HouseAmenities(props: HouseAmenitiesProps) {
  const { id } = useHouseDocument()

  return (
    <OptimisticArray
      documentId={id}
      value={props.amenityCategories}
      select={(document: { amenityCategories?: AmenityCategoryData[] }) =>
        document.amenityCategories
      }
    >
      {(amenityCategories) => (
        <HouseAmenitiesBody {...props} amenityCategories={amenityCategories ?? []} />
      )}
    </OptimisticArray>
  )
}

function HouseAmenitiesBody({ amenityCategories, featuredAmenities }: HouseAmenitiesProps) {
  const { id, type } = useHouseDocument()
  const t = useTranslations('HouseAmenities')

  const dataAttribute = createDataAttribute({ id, type })

  const noteLabels: NoteLabels = {
    private: t('notes.private'),
    shared: t('notes.shared'),
    coin: t('notes.coin')
  }

  const totalAmenitiesCount = amenityCategories.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <section id="amenities" aria-labelledby="amenities-title">
      <HouseSectionHeading id="amenities-title">{t('heading')}</HouseSectionHeading>
      <HouseSectionContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {featuredAmenities.map((amenity, index) => (
            <AmenityItem
              key={amenity._key}
              amenity={amenity}
              className={index >= 5 ? 'hidden md:flex' : undefined}
              noteLabel={amenity.note ? noteLabels[amenity.note] : undefined}
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
    </section>
  )
}
