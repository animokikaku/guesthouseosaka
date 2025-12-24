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
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import * as React from 'react'

const components: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="text-foreground mb-4 text-lg font-semibold">{children}</h3>
    ),
    normal: ({ children }) => <p className="text-foreground">{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="text-foreground mb-6 list-decimal space-y-2 pl-5">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3">
        <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
        <span className="text-foreground">{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>
  }
}

interface HouseLocationModalProps {
  children: React.ReactNode
  id: HouseIdentifier
  details: NonNullable<NonNullable<HouseQueryResult>['location']>['details']
  title: string
}

export function HouseLocationModal({
  children,
  id,
  details,
  title
}: HouseLocationModalProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  if (!details || details.length === 0) {
    return null
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="theme-container max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            <LocationSections id={id} details={details} />
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
        <LocationSections id={id} details={details} className="pt-8" />
      </DialogContent>
    </Dialog>
  )
}

interface LocationSectionsProps {
  id: HouseIdentifier
  details: NonNullable<
    NonNullable<NonNullable<HouseQueryResult>['location']>['details']
  >
  className?: string
}

function LocationSections({ details, className }: LocationSectionsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <PortableText value={details} components={components} />
    </div>
  )
}
