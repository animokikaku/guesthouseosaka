'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { scrollToGalleryCategory } from '@/lib/gallery-scroll'
import type { GalleryCategory } from '@/lib/gallery'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import * as React from 'react'

type StickyCategoryNavProps = {
  categories: GalleryCategory[]
  activeId: string | null
}

export function StickyCategoryNav({ categories, activeId }: StickyCategoryNavProps) {
  const t = useTranslations('StickyCategoryNav')
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

  return (
    <nav aria-label={t('gallery_categories_label')} className="min-w-0 flex-1">
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
                onClick={() => scrollToGalleryCategory(cat._id)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset',
                  isActive
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
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
