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
import { useOptimistic } from '@/hooks/use-optimistic'
import type { AmenityItemData } from '@/lib/types/components'
import { groupByCategory } from '@/lib/utils/group-by-category'
import { stegaClean } from '@sanity/client/stega'
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useMemo } from 'react'

type IconName = keyof typeof dynamicIconImports

interface HouseAmenitiesProps {
  _id: string
  _type: string
  amenities: AmenityItemData[]
}

interface AmenitiesDialogProps {
  _id: string
  _type: string
  amenities: AmenityItemData[]
  noteLabels: Record<string, string>
  trigger: React.ReactNode
  title: string
}

interface AmenityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  amenity: AmenityItemData
  noteLabel?: string
}

function AmenityItem({ amenity, noteLabel, ...props }: AmenityItemProps) {
  // Clean stega encoding from icon to ensure DynamicIcon works correctly
  const iconName = stegaClean(amenity.icon) as IconName

  return (
    <div className="flex items-center gap-3 py-2" {...props}>
      <div className="text-muted-foreground h-5 w-5 shrink-0">
        <DynamicIcon name={iconName} className="h-5 w-5" />
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
  _id,
  _type,
  title,
  amenities
}: AmenitiesDialogProps) {
  const isMobile = useIsMobile()
  const [data, attr] = useOptimistic({ _id, _type, amenities }, 'amenities')

  // Group by category for display, but data-sanity still references flat array
  const amenityCategories = useMemo(() => groupByCategory(data), [data])

  if (!data) return null

  const content = (
    <div className="space-y-8 pt-8">
      {amenityCategories.map((category) => (
        <div key={category.key}>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            {category.label}
          </h3>
          <div className="grid grid-cols-1 gap-2" data-sanity={attr.list()}>
            {category.items.map((amenity) => (
              <AmenityItem
                data-sanity={attr.item(amenity._key)}
                key={amenity._key}
                amenity={amenity}
                noteLabel={
                  amenity.note
                    ? noteLabels[stegaClean(amenity.note)]
                    : undefined
                }
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
      <DialogContent className="theme-container max-h-[85vh] w-3xl overflow-y-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export function HouseAmenities({ _id, _type, amenities }: HouseAmenitiesProps) {
  const isMobile = useIsMobile()
  const t = useTranslations('HouseAmenities')

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
          _id={_id}
          _type={_type}
          amenities={amenities}
          noteLabels={noteLabels}
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
