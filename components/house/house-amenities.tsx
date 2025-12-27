'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import type { HouseQueryResult } from '@/sanity.types'
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useMemo } from 'react'

type IconName = keyof typeof dynamicIconImports

type Amenities = NonNullable<HouseQueryResult>['amenities']
type Amenity = NonNullable<Amenities>[number]

interface HouseAmenitiesProps {
  amenities: Amenities
}

interface AmenityCategory {
  _id: string | null
  key: string | null
  label: string | null
  icon: string | null
  order: number | null
  items: Amenity[]
}

interface AmenitiesDialogProps {
  amenityCategories: AmenityCategory[]
  noteLabels: Record<string, string>
  trigger: React.ReactNode
  title: string
}

function AmenityItem({
  amenity,
  noteLabel
}: {
  amenity: Amenity
  noteLabel?: string
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="text-muted-foreground h-5 w-5 shrink-0">
        <DynamicIcon
          name={(amenity.icon ?? 'circle') as IconName}
          className="h-5 w-5"
        />
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
  amenityCategories,
  noteLabels,
  trigger,
  title
}: AmenitiesDialogProps) {
  const isMobile = useIsMobile()

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
                noteLabel={amenity.note ? noteLabels[amenity.note] : undefined}
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
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export function HouseAmenities({ amenities }: HouseAmenitiesProps) {
  const isMobile = useIsMobile()
  const t = useTranslations('HouseAmenities')

  const noteLabels: Record<string, string> = {
    private: t('notes.private'),
    shared: t('notes.shared'),
    coin: t('notes.coin')
  }

  // Group amenities by category, preserving array order within each category
  const amenityCategories = useMemo(() => {
    if (!amenities) return []

    const categoryMap = new Map<string, AmenityCategory>()

    for (const amenity of amenities) {
      if (!amenity.category) continue
      const { key } = amenity.category

      if (!categoryMap.has(key)) {
        categoryMap.set(key, { ...amenity.category, items: [] })
      }

      categoryMap.get(key)?.items.push(amenity)
    }

    // Sort categories by order field
    return [...categoryMap.values()].sort(
      (a, b) => (a.order ?? 999) - (b.order ?? 999)
    )
  }, [amenities])

  // Featured amenities derived from flat list
  const featuredAmenities = useMemo(() => {
    if (!amenities) return []
    return amenities.filter((a) => a.featured).slice(0, 10)
  }, [amenities])

  // Query returns max 10, slice to 5 on mobile
  const displayedFeatured = isMobile
    ? featuredAmenities.slice(0, 5)
    : featuredAmenities

  const totalAmenitiesCount = amenities?.length ?? 0

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {displayedFeatured.map((amenity) => (
            <AmenityItem
              key={amenity._key}
              amenity={amenity}
              noteLabel={amenity.note ? noteLabels[amenity.note] : undefined}
            />
          ))}
        </div>

        <AmenitiesDialog
          title={t('heading')}
          amenityCategories={amenityCategories}
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
