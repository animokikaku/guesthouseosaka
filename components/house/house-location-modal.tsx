'use client'

import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { locationPortableText } from '@/lib/portable-text'
import type { LocationData } from '@/lib/types/components'
import { PortableText } from '@portabletext/react'
import * as React from 'react'

interface HouseLocationModalProps {
  children: React.ReactNode
  details: LocationData['details']
  title: string
}

export function HouseLocationModal({
  children,
  details,
  title
}: HouseLocationModalProps) {
  const [open, setOpen] = React.useState(false)

  if (!details) {
    return null
  }

  return (
    <ResponsiveModal
      trigger={children}
      title={title}
      open={open}
      onOpenChange={setOpen}
      contentClassName="pt-8"
    >
      <LocationSections details={details} />
    </ResponsiveModal>
  )
}

interface LocationSectionsProps {
  details: NonNullable<LocationData['details']>
}

function LocationSections({ details }: LocationSectionsProps) {
  return (
    <div className="space-y-2">
      <PortableText value={details} components={locationPortableText} />
    </div>
  )
}
