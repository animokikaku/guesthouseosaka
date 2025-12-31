'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { GalleryCategory } from '@/lib/gallery'
import { cn } from '@/lib/utils'
import * as React from 'react'

type StickyCategoryNavProps = {
  categories: GalleryCategory[]
  activeId: string | null
  isVisible: boolean
}

export function StickyCategoryNav({
  categories,
  activeId,
  isVisible
}: StickyCategoryNavProps) {
  const activeButtonRef = React.useRef<HTMLButtonElement>(null)

  // Auto-scroll to keep active category visible
  React.useEffect(() => {
    if (activeId && activeButtonRef.current) {
      activeButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeId])

  const scrollToCategory = (key: string) => {
    const element = document.getElementById(key)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={cn(
        'min-w-0 flex-1 transition-opacity duration-200',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-1">
          {categories.map((category) => {
            const isActive = category.key === activeId
            return (
              <button
                key={category.key}
                ref={isActive ? activeButtonRef : undefined}
                type="button"
                data-active={isActive}
                onClick={() => scrollToCategory(category.key)}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground focus-visible:ring-ring/50 shrink-0 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
              >
                {category.label}
              </button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </nav>
  )
}
