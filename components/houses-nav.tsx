'use client'

import { useThemeConfig } from '@/components/active-theme'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import { HouseIdentifierValues } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export function HousesNav({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { setActiveTheme } = useThemeConfig()
  const houseLabel = useHouseLabels()
  const isMobile = useIsMobile()
  const params = useParams()

  const classNames = {
    orange:
      'data-[active=true]:text-orange-600 dark:data-[active=true]:text-orange-500',
    apple:
      'data-[active=true]:text-red-600 dark:data-[active=true]:text-red-500',
    lemon:
      'data-[active=true]:text-yellow-400 dark:data-[active=true]:text-yellow-500'
  }

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
          {HouseIdentifierValues.map((house) => (
            <Link
              key={`house-nav-${house}`}
              href={{ pathname: '/[house]', params: { house } }}
              data-active={house === params.house}
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
