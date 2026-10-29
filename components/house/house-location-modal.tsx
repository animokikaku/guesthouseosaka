import { ResponsiveModal } from '@/components/ui/responsive-modal'
import type { LocationData } from '@/lib/types/components'
import type { PortableTextComponents } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import * as React from 'react'

const portableTextComponents: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="text-foreground mt-6 mb-3 text-lg font-semibold first:mt-0">{children}</h3>
    ),
    normal: ({ children }) => <p className="text-foreground mb-3 last:mb-0">{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="text-foreground list-decimal space-y-2 pl-5">{children}</ol>
    )
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-3">
        <div className="bg-primary mt-2 size-2 shrink-0 rounded-full" />
        <span className="text-foreground">{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>
  }
}

interface HouseLocationModalProps {
  children: React.ReactElement
  details: LocationData['details']
  title: string
}

export function HouseLocationModal({ children, details, title }: HouseLocationModalProps) {
  if (!details) {
    return null
  }

  return (
    <ResponsiveModal trigger={children} title={title}>
      {/* Plain block flow so a heading's top margin collapses with the
          paragraph above it, keeping sections apart and headings near their content */}
      <div>
        <PortableText value={details} components={portableTextComponents} />
      </div>
    </ResponsiveModal>
  )
}
