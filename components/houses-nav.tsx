'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/utils/theme'
import type { HousesTitlesQueryResult } from '@/sanity.types'
import { stegaClean } from 'next-sanity'
import { useParams } from 'next/navigation'

export function HousesNav({
  houses,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  houses: HousesTitlesQueryResult
}) {
  const isMobile = useIsMobile()
  const params = useParams()

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {houses.map((house) => {
            if (!house.title) return null
            const slug = house.slug
            const title = stegaClean(house.title)
            return (
              <Link
                prefetch
                key={`house-nav-${slug}`}
                href={{ pathname: '/[house]', params: { house: slug } }}
                aria-current={slug === params.house ? 'page' : undefined}
                data-active={slug === params.house}
                className={cn(
                  'text-muted-foreground hover:text-primary flex h-7 shrink-0 items-center justify-center rounded-md px-4 text-center text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset',
                  HOUSE_COLORS[slug].activeText
                )}
                scroll={!isMobile}
              >
                {title}
              </Link>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
