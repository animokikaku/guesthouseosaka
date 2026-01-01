'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { Icon } from '@/lib/icons'
import type { AmenityItemData } from '@/lib/types/components'
import { groupByCategory } from '@/lib/utils/group-by-category'
import { stegaClean } from '@sanity/client/stega'
import { useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'
import { useOptimistic } from 'next-sanity/hooks'
import * as React from 'react'
import { useMemo } from 'react'
import { SanityDocument } from 'sanity'

type DataAttributeFn = (path: string) => string

interface HouseAmenitiesProps {
  documentId: string
  documentType: string
  amenities: AmenityItemData[]
}

interface AmenitiesDialogProps {
  amenities: AmenityItemData[]
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
  amenities,
  dataAttribute
}: AmenitiesDialogProps) {
  const isMobile = useIsMobile()

  // Group by category for display
  const amenityCategories = useMemo(
    () => groupByCategory(amenities),
    [amenities]
  )

  if (!amenities) return null

  const content = (
    <div className="space-y-8 pt-8">
      {amenityCategories.map((category) => (
        <div key={category.key}>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            {category.label}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {category.items.map((amenity) => (
              <AmenityItem
                key={amenity._key}
                amenity={amenity}
                noteLabel={
                  amenity.note
                    ? noteLabels[stegaClean(amenity.note)]
                    : undefined
                }
                data-sanity={dataAttribute?.(
                  `amenities[_key=="${amenity._key}"]`
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="theme-container max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className="sr-only">{title}</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">{content}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="theme-container max-h-[85vh] overflow-y-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export function HouseAmenities({
  documentId,
  documentType,
  amenities: initialAmenities
}: HouseAmenitiesProps) {
  const isMobile = useIsMobile()
  const t = useTranslations('HouseAmenities')

  const amenities = useOptimistic<
    AmenityItemData[],
    SanityDocument & { amenities?: AmenityItemData[] }
  >(initialAmenities, (currentAmenities, action) => {
    if (action.id === documentId && action.document.amenities) {
      // Optimistic document only has partial data, merge with current
      return action.document.amenities.map(
        (item) => currentAmenities?.find((a) => a._key === item._key) ?? item
      )
    }
    return currentAmenities
  })

  const dataAttribute = createDataAttribute({
    id: documentId,
    type: documentType
  })

  const noteLabels: Record<string, string> = {
    private: t('notes.private'),
    shared: t('notes.shared'),
    coin: t('notes.coin')
  }

  // Featured amenities derived from flat list
  const featuredAmenities = useMemo(() => {
    return amenities.filter((a) => a.featured).slice(0, 10)
  }, [amenities])

  // Slice to 5 on mobile
  const displayedFeatured = isMobile
    ? featuredAmenities.slice(0, 5)
    : featuredAmenities

  const totalAmenitiesCount = amenities.length

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>
      <div className="space-y-6">
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
          amenities={amenities}
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
      </div>
    </section>
  )
}
