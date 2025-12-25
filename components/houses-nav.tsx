'use client'

import { useThemeConfig } from '@/components/active-theme'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import { HousesNavQueryResult } from '@/sanity.types'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

const THEME_CLASSES: Record<HouseIdentifier, string> = {
  orange:
    'data-[active=true]:text-orange-600 dark:data-[active=true]:text-orange-500',
  apple: 'data-[active=true]:text-red-600 dark:data-[active=true]:text-red-500',
  lemon:
    'data-[active=true]:text-yellow-400 dark:data-[active=true]:text-yellow-500'
}

export function HousesNav({
  houses,
  className,
  ...props
}: React.ComponentProps<'div'> & { houses: HousesNavQueryResult }) {
  const { setActiveTheme } = useThemeConfig()
  const isMobile = useIsMobile()
  const params = useParams()

  useEffect(() => {
    if (params.house === 'orange') {
      setActiveTheme('orange')
    } else if (params.house === 'apple') {
      setActiveTheme('red')
    } else if (params.house === 'lemon') {
      setActiveTheme('yellow')
    }
    return () => {
      setActiveTheme('default')
    }
  }, [params.house, setActiveTheme])

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {(houses ?? []).map(({ slug, title }) => {
            return (
              <Link
                key={`house-nav-${slug}`}
                href={{ pathname: '/[house]', params: { house: slug } }}
                data-active={slug === params.house}
                className={cn(
                  'text-muted-foreground hover:text-primary flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium transition-colors',
                  THEME_CLASSES[slug]
                )}
                scroll={!isMobile}
              >
                {title ?? slug}
              </Link>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
