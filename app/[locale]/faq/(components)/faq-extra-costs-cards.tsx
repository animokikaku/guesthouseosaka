'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type {
  HousesBuildingQueryResult,
  PricingCategoriesQueryResult
} from '@/sanity.types'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { useEffect, useState } from 'react'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span>{children}</span>
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-none space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-none space-y-1">{children}</ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  }
}

type HouseStyles = {
  text: string
  headerBg: string
  border: string
}

const HOUSE_STYLES: Record<HouseIdentifier, HouseStyles> = {
  orange: {
    text: 'text-orange-700 dark:text-orange-400',
    headerBg:
      'bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800/50'
  },
  apple: {
    text: 'text-red-700 dark:text-red-400',
    headerBg:
      'bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20',
    border: 'border-red-200 dark:border-red-800/50'
  },
  lemon: {
    text: 'text-yellow-700 dark:text-yellow-400',
    headerBg:
      'bg-gradient-to-r from-yellow-50 to-amber-100/50 dark:from-yellow-950/40 dark:to-amber-900/20',
    border: 'border-yellow-200 dark:border-yellow-800/50'
  }
}

type Houses = NonNullable<HousesBuildingQueryResult>
type PricingCategories = NonNullable<PricingCategoriesQueryResult>

type FAQExtraCostsCardsProps = {
  houses: Houses
  pricingCategories: PricingCategories
}

export function FAQExtraCostsCards({
  houses,
  pricingCategories
}: FAQExtraCostsCardsProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

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

  if (!houses || houses.length === 0 || !pricingCategories?.length) return null

  return (
    <div className="w-full space-y-4">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {houses.map((house) => (
            <ExtraCostsCard
              key={house._id}
              styles={HOUSE_STYLES[house.slug]}
              title={house.title}
              extraCosts={house.extraCosts}
              pricingCategories={pricingCategories}
            />
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-center gap-2">
        {houses.map(({ _id, title }, index) => (
          <button
            key={_id}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              current === index
                ? 'bg-foreground w-6'
                : 'bg-muted-foreground/30 w-2'
            )}
            aria-label={`Go to ${title}`}
          />
        ))}
      </div>
    </div>
  )
}

interface ExtraCostsCardProps {
  styles: HouseStyles | undefined
  title: string | null
  extraCosts: Houses[number]['extraCosts']
  pricingCategories: PricingCategories
}

function ExtraCostsCard({
  styles,
  title,
  extraCosts,
  pricingCategories
}: ExtraCostsCardProps) {
  return (
    <CarouselItem>
      <div
        className={cn(
          'overflow-hidden rounded-xl border shadow-sm transition-shadow',
          styles?.border
        )}
      >
        <div className={cn('px-4 py-3', styles?.headerBg)}>
          <h4
            className={cn(
              'text-base font-semibold tracking-tight',
              styles?.text
            )}
          >
            {title}
          </h4>
        </div>
        <div className="divide-border/50 divide-y bg-white dark:bg-zinc-900/50">
          {pricingCategories.map((category, index) => {
            const cost = extraCosts?.find((c) => c.slug === category.slug)
            return (
              <div
                key={category._id}
                className={cn(
                  'flex items-center justify-between gap-4 px-4 py-3',
                  index % 2 === 1 && 'bg-muted/30'
                )}
              >
                <span className="text-foreground text-sm font-medium">
                  {category.title}
                </span>
                <span className="text-foreground/70 text-right text-sm tabular-nums">
                  {cost?.value ? (
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
        </div>
      </div>
    </CarouselItem>
  )
}
