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
      aria-label="Gallery categories"
      className={cn(
        'min-w-0 flex-1 transition-opacity duration-200',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-1">
          {categories.map((cat) => {
            const isActive = cat._id === activeId
            return (
              <button
                key={cat._id}
                ref={isActive ? activeButtonRef : undefined}
                type="button"
                aria-current={isActive ? 'true' : undefined}
                onClick={() => scrollToCategory(cat._id)}
                className={cn(
                  'shrink-0 px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </nav>
  )
}
