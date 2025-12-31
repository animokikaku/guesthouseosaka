'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { GalleryCategory } from '@/lib/gallery'
import { cn } from '@/lib/utils'

type StickyCategoryNavProps = {
  categories: GalleryCategory[]
  isVisible: boolean
}

export function StickyCategoryNav({
  categories,
  isVisible
}: StickyCategoryNavProps) {
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
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => scrollToCategory(category.key)}
                className="text-muted-foreground hover:text-foreground shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                {category.label}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
    </nav>
  )
}
