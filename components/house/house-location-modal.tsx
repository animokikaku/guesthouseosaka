'use client'

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
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { HouseQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'
import * as React from 'react'

interface HouseLocationModalProps {
  children: React.ReactNode
  id: HouseIdentifier
  location: NonNullable<HouseQueryResult>['location']
  title: string
}

export function HouseLocationModal({
  children,
  id,
  location,
  title
}: HouseLocationModalProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="theme-container max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            <LocationSections id={id} location={location} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="theme-container max-h-[85vh] w-3xl overflow-y-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <LocationSections id={id} location={location} className="pt-8" />
      </DialogContent>
    </Dialog>
  )
}

interface LocationSectionsProps {
  id: HouseIdentifier
  location: NonNullable<HouseQueryResult>['location']
  className?: string
}

function LocationSections({ location, className }: LocationSectionsProps) {
  const t = useTranslations('HouseLocation')

  const stations = location?.stations ?? []
  const nearby = location?.nearby ?? []

  return (
    <div className={cn('space-y-8', className)}>
      {stations.length > 0 && (
        <div>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            {t('sections.getting_around')}
          </h3>
          <ul className="space-y-2">
            {stations.map((station) => (
              <li key={station._key} className="flex items-start gap-3">
                <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
                <span className="text-foreground">{station.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {nearby.length > 0 && (
        <div>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            {t('sections.nearby')}
          </h3>
          <ul className="space-y-2">
            {nearby.map((item) => (
              <li key={item._key} className="flex items-start gap-3">
                <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
                <span className="text-foreground">{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
