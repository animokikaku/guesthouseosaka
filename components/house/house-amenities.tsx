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

type IconName = keyof typeof dynamicIconImports
import { useTranslations } from 'next-intl'
import * as React from 'react'

type SanityAmenity = NonNullable<
  NonNullable<HouseQueryResult>['amenities']
>[number]

type Amenity = {
  label: string
  icon: string
  note?: string
  featured?: boolean
}

type AmenityCategory = {
  category: string
  items: Amenity[]
}

interface HouseAmenitiesProps {
  amenities: NonNullable<HouseQueryResult>['amenities']
}

interface AmenitiesDialogProps {
  amenities: AmenityCategory[]
  trigger: React.ReactNode
  title: string
}

function AmenityItem({ amenity }: { amenity: Amenity }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="text-muted-foreground h-5 w-5 shrink-0">
        <DynamicIcon name={amenity.icon as IconName} className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <span className="text-foreground">{amenity.label}</span>
        {amenity.note && (
          <Badge variant="outline" className="ml-2 text-xs">
            {amenity.note}
          </Badge>
        )}
      </div>
    </div>
  )
}

function AmenitiesDialog({ amenities, trigger, title }: AmenitiesDialogProps) {
  const isMobile = useIsMobile()

  const content = (
    <div className="space-y-8 pt-8">
      {amenities.map((category) => (
        <div key={category.category}>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            {category.category}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {category.items.map((amenity, index) => (
              <AmenityItem
                key={`${category.category}-${index}`}
                amenity={amenity}
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

// Transform Sanity amenities data into grouped categories
function transformAmenities(
  sanityAmenities: SanityAmenity[] | null,
  noteLabels: Record<string, string>
): AmenityCategory[] {
  if (!sanityAmenities) return []

  // Group by category
  const categoryMap = new Map<string, Amenity[]>()

  for (const amenity of sanityAmenities) {
    const categoryKey = amenity.category?.key ?? 'other'

    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, [])
    }

    categoryMap.get(categoryKey)!.push({
      label: amenity.label ?? '',
      icon: amenity.icon ?? 'circle',
      note: amenity.note ? noteLabels[amenity.note] : undefined,
      featured: amenity.featured ?? false
    })
  }

  // Convert to array preserving order from Sanity (already sorted by category.order)
  const seen = new Set<string>()
  const result: AmenityCategory[] = []

  for (const amenity of sanityAmenities) {
    const categoryKey = amenity.category?.key ?? 'other'
    if (seen.has(categoryKey)) continue
    seen.add(categoryKey)

    result.push({
      category: amenity.category?.label ?? 'Other',
      items: categoryMap.get(categoryKey) ?? []
    })
  }

  return result
}

export function HouseAmenities({ amenities: sanityAmenities }: HouseAmenitiesProps) {
  const isMobile = useIsMobile()
  const t = useTranslations('HouseAmenities')
  const maxTopAmenities = isMobile ? 5 : 10

  const noteLabels: Record<string, string> = {
    private: t('notes.private'),
    shared: t('notes.shared'),
    coin: t('notes.coin')
  }

  const amenities = transformAmenities(sanityAmenities, noteLabels)

  const featuredAmenities = amenities
    .flatMap((category) => category.items.filter((item) => item.featured))
    .slice(0, maxTopAmenities)

  // Calculate total amenities count
  const totalAmenitiesCount = amenities.reduce(
    (total, category) => total + category.items.length,
    0
  )

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {featuredAmenities.map((amenity, index) => (
            <AmenityItem key={index} amenity={amenity} />
          ))}
        </div>

        <AmenitiesDialog
          title={t('heading')}
          amenities={amenities}
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
