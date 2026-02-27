'use client'

import { ResponsiveModal } from '@/components/ui/responsive-modal'
import type { LocationData } from '@/lib/types/components'
import type { PortableTextComponents } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import * as React from 'react'

const portableTextComponents: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="text-foreground mb-4 text-lg font-semibold">{children}</h3>
    ),
    normal: ({ children }) => <p className="text-foreground">{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="text-foreground mb-6 list-decimal space-y-2 pl-5">{children}</ol>
    )
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
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
  details: LocationData['details']
  title: string
}

export function HouseLocationModal({ children, details, title }: HouseLocationModalProps) {
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
      <PortableText value={details} components={portableTextComponents} />
    </div>
  )
}
