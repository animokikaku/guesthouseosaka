'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { HousesBuildingQueryResult } from '@/sanity.types'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span>{children}</span>
  }
}

const HOUSE_STYLES = {
  orange: {
    text: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-500',
    headerBg:
      'bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800/50',
    dot: 'bg-orange-500',
    dotInactive: 'bg-orange-200 dark:bg-orange-800'
  },
  apple: {
    text: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-500',
    headerBg:
      'bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20',
    border: 'border-red-200 dark:border-red-800/50',
    dot: 'bg-red-500',
    dotInactive: 'bg-red-200 dark:bg-red-800'
  },
  lemon: {
    text: 'text-yellow-700 dark:text-yellow-400',
    bg: 'bg-yellow-500',
    headerBg:
      'bg-gradient-to-r from-yellow-50 to-amber-100/50 dark:from-yellow-950/40 dark:to-amber-900/20',
    border: 'border-yellow-200 dark:border-yellow-800/50',
    dot: 'bg-yellow-500',
    dotInactive: 'bg-yellow-200 dark:bg-yellow-800'
  }
}

type FAQExtraCostsCardsProps = {
  houses: HousesBuildingQueryResult
}

export function FAQExtraCostsCards({ houses }: FAQExtraCostsCardsProps) {
  const t = useTranslations('FAQExtraCostsTable')
  const houseLabel = useHouseLabels()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const categoryLabels = useMemo(
    () => ({
      deposit: t('deposit'),
      'common-fees': t('common_fees'),
      'utility-fees': t('utility_fees'),
      'water-bill': t('water_bill'),
      laundromat: t('laundromat'),
      'drying-machine': t('drying_machine'),
      internet: t('internet')
    }),
    [t]
  )

  useEffect(() => {
    if (!api) return

    const updateIndex = () => {
      setCurrent(api.selectedScrollSnap())
    }

    updateIndex()
    api.on('select', updateIndex)
    api.on('reInit', updateIndex)

    return () => {
      api.off('select', updateIndex)
      api.off('reInit', updateIndex)
    }
  }, [api])

  if (!houses || houses.length === 0) return null

  return (
    <div className="w-full space-y-4">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {houses.map((house) => {
            const slug = stegaClean(house.slug)
            const styles = HOUSE_STYLES[slug]
            const label = houseLabel(slug)

            return (
              <CarouselItem key={house._id}>
                <div
                  className={cn(
                    'overflow-hidden rounded-xl border shadow-sm transition-shadow',
                    styles.border
                  )}
                >
                  <div className={cn('px-4 py-3', styles.headerBg)}>
                    <h4
                      className={cn(
                        'text-base font-semibold tracking-tight capitalize',
                        styles.text
                      )}
                    >
                      {label.name}
                    </h4>
                  </div>
                  <div className="divide-border/50 divide-y bg-white dark:bg-zinc-900/50">
                    {house.extraCosts?.map((cost, index) => {
                      const categoryLabel = categoryLabels[cost.category]

                      return (
                        <div
                          key={cost._key}
                          className={cn(
                            'flex items-center justify-between gap-4 px-4 py-3',
                            index % 2 === 1 && 'bg-muted/30'
                          )}
                        >
                          <span className="text-foreground text-sm font-medium">
                            {categoryLabel}
                          </span>
                          <span className="text-foreground/70 text-right text-sm tabular-nums">
                            {cost.value ? (
                              <PortableText
                                value={cost.value}
                                components={portableTextComponents}
                              />
                            ) : (
                              '–'
                            )}
                          </span>
                        </div>
                      )
                    })}
                    {(!house.extraCosts || house.extraCosts.length === 0) && (
                      <div className="text-muted-foreground px-4 py-6 text-center text-sm">
                        No data available
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-center gap-2">
        {houses.map((house, index) => {
          const slug = stegaClean(house.slug) as HouseIdentifier
          const styles = HOUSE_STYLES[slug]

          return (
            <button
              key={house._id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                current === index
                  ? cn('w-6', styles.dot)
                  : cn('w-2', styles.dotInactive)
              )}
              aria-label={`Go to ${houseLabel(slug).name}`}
            />
          )
        })}
      </div>
    </div>
  )
}
