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
import { useExtracted } from 'next-intl'
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
  const t = useExtracted()

  const { stations, neighborhood, guideNeighborhood } = {
    apple: {
      stations: [
        t(
          'Daikokucho Station (Subway Midosuji and Yotsubashi Lines), Exit 2 — about 1 minute on foot'
        ),
        t('Namba Stations (various lines) — about 15 minutes on foot'),
        t('Ebisucho Station — about 11 minutes on foot'),
        t('Imamiya Station / Imamiya-Ebisu — about 7 minutes on foot')
      ],
      neighborhood: [
        t(
          '24-hour supermarket right next to the guest house and another large supermarket about 1 minute away'
        ),
        t('Conveyor belt sushi restaurant about 3 minutes on foot'),
        t('¥100 shop by Daikokucho Station'),
        t('Convenience store and post office about 3 minutes on foot')
      ],
      guideNeighborhood: t(
        'Only 1 minute walk from Daikokucho Station (Subway Midosuji Line, Yotsubashi Line). Just by a 24 hour open supermarket. Near 200 year old Kizu Market, and large public bath with hot stone spa. Walking distance from Namba, so you can enjoy the night life without worrying the last trains.'
      )
    },
    lemon: {
      stations: [
        t(
          'Nihonbashi Station (Subway Sakaisuji Line), Exit 10 — about 8 minutes on foot'
        ),
        t(
          'Namba Station (Subway Midosuji Line), Exit 4 — about 10 minutes on foot'
        ),
        t('Nankai Namba Station (South Exit) — about 8 minutes on foot')
      ],
      neighborhood: [
        t('Post office about 2 minutes on foot'),
        t('Supermarkets nearby at roughly 2, 4, and 6 minutes on foot'),
        t(
          'Discount shop about 5 minutes on foot plus additional convenience stores within walking distance'
        )
      ],
      guideNeighborhood: t(
        'Only 8 minutes walk to Namba! Great location, enjoy night life without worrying the last trains. Great access to anywhere in Osaka. Perfect for sightseeing or longer stay. No curfew.'
      )
    },
    orange: {
      stations: [
        t(
          'Showacho Station (Subway Midosuji Line), Exit 2 — about 7 minutes on foot'
        ),
        t(
          'Fuminosato Station (Subway Tanimachi Line), Exit 6 — about 3 minutes on foot'
        ),
        t('Tennoji / Abenobashi — about 15 minutes on foot')
      ],
      neighborhood: [
        t('Supermarkets within about 5 minutes on foot'),
        t('Supermarket at Showacho Station'),
        t(
          'Abeno Harukas about 15 minutes on foot; Qs Mall about 12 minutes on foot'
        )
      ],
      guideNeighborhood: t(
        '300m height! Only 15 minutes walk to the highest building in Japan “Abeno Harukas” Located near popular city attractions, with great public transportation to places like Osaka Castle, Osaka Aquarium Kaiyukan, Universal Studios Japan, Tsūtenkaku Tower. Only a few minutes walk to the nearest stations. Within walking distance, there are supermarkets, convenience stores, ¥100 shops, fitness center, bicycle shop and the ward office.'
      )
    }
  }[id]

  return (
    <div className={cn('space-y-8', className)}>
      <div>
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          {t('Getting around')}
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
          {t("What's nearby")}
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
          {t('Neighborhood')}
        </h3>
        <p className="text-foreground leading-relaxed font-medium">
          {guideNeighborhood}
        </p>
      </div>
    </div>
  )
}
