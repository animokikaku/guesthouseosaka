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
import { useTranslations } from 'next-intl'
import * as React from 'react'

interface HouseLocationModalProps {
  children: React.ReactNode
  id: HouseIdentifier
  title: string
}

export function HouseLocationModal({
  children,
  id,
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
            <LocationSections id={id} />
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

        <LocationSections id={id} className="pt-8" />
      </DialogContent>
    </Dialog>
  )
}

interface LocationSectionsProps {
  id: HouseIdentifier
  className?: string
}

function LocationSections({ id, className }: LocationSectionsProps) {
  const t = useTranslations('HouseLocation')

  const { stations, neighborhood, guideNeighborhood } = {
    apple: {
      stations: [
        t('details.apple.stations.daikokucho'),
        t('details.apple.stations.namba'),
        t('details.apple.stations.ebisucho'),
        t('details.apple.stations.imamiya')
      ],
      neighborhood: [
        t('details.apple.nearby.supermarkets'),
        t('details.apple.nearby.sushi'),
        t('details.apple.nearby.hundred_yen'),
        t('details.apple.nearby.convenience')
      ],
      guideNeighborhood: t('details.apple.overview')
    },
    lemon: {
      stations: [
        t('details.lemon.stations.nihonbashi'),
        t('details.lemon.stations.namba'),
        t('details.lemon.stations.nankai_namba')
      ],
      neighborhood: [
        t('details.lemon.nearby.post_office'),
        t('details.lemon.nearby.supermarkets'),
        t('details.lemon.nearby.discount_shop')
      ],
      guideNeighborhood: t('details.lemon.overview')
    },
    orange: {
      stations: [
        t('details.orange.stations.showacho'),
        t('details.orange.stations.fuminosato'),
        t('details.orange.stations.tennoji')
      ],
      neighborhood: [
        t('details.orange.nearby.supermarkets'),
        t('details.orange.nearby.showacho_supermarket'),
        t('details.orange.nearby.harukas')
      ],
      guideNeighborhood: t('details.orange.overview')
    }
  }[id]

  return (
    <div className={cn('space-y-8', className)}>
      <div>
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          {t('sections.getting_around')}
        </h3>
        <ul className="space-y-2">
          {stations.map((station) => (
            <li key={station} className="flex items-start gap-3">
              <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full"></div>
              <span className="text-foreground">{station}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          {t('sections.nearby')}
        </h3>
        <ul className="space-y-2">
          {neighborhood.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full"></div>
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          {t('sections.neighborhood')}
        </h3>
        <p className="text-foreground leading-relaxed font-medium">
          {guideNeighborhood}
        </p>
      </div>
    </div>
  )
}
