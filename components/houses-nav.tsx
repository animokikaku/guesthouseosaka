'use client'

import { useThemeConfig } from '@/components/active-theme'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link, usePathname } from '@/i18n/navigation'
import { HouseIdentifierValues } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

export function HousesNav({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { setActiveTheme } = useThemeConfig()
  const houseLabel = useHouseLabels()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const classNames = {
    orange:
      'data-[active=true]:text-orange-600 dark:data-[active=true]:text-orange-500',
    apple:
      'data-[active=true]:text-red-600 dark:data-[active=true]:text-red-500',
    lemon:
      'data-[active=true]:text-yellow-400 dark:data-[active=true]:text-yellow-500'
  }

  useEffect(() => {
    if (pathname.startsWith('/orange')) {
      setActiveTheme('orange')
    } else if (pathname.startsWith('/apple')) {
      setActiveTheme('red')
    } else if (pathname.startsWith('/lemon')) {
      setActiveTheme('yellow')
    }
    return () => {
      setActiveTheme('default')
    }
  }, [pathname, setActiveTheme])

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {HouseIdentifierValues.map((house) => (
            <Link
              key={`house-nav-${house}`}
              href={`/${house}`}
              data-active={pathname.startsWith(house, 1)}
              className={cn(
                'text-muted-foreground hover:text-primary flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium transition-colors',
                classNames[house]
              )}
              scroll={!isMobile}
            >
              {houseLabel(house).name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
