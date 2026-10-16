'use client'

import { useHouseDocument } from '@/components/house/house-context'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from '@/i18n/navigation'
import type { AvailabilitySummary } from '@/lib/availability'
import type { BuildingData } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { BedDoubleIcon, LayersIcon, LucideIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'

export type AvailabilityCounts = Pick<AvailabilitySummary, 'availableCount' | 'upcomingCount'>

interface HouseBuildingProps {
  building: BuildingData | null
  /** When the house lists its rooms, the Rooms figure links to them, like Min Rent links to pricing. */
  availability?: AvailabilityCounts | null
}

export function HouseBuilding({ building, availability }: HouseBuildingProps) {
  const { id, type, slug } = useHouseDocument()
  const t = useTranslations('HouseBuilding')
  const formatter = useFormatter()

  const dataAttribute = createDataAttribute({ id, type })

  return (
    <div className="text-muted-foreground grid grid-cols-3 gap-2 text-center text-xs">
      {availability ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={{
                  pathname: '/[house]',
                  params: { house: slug },
                  hash: '#availability'
                }}
              />
            }
          >
            <FeatureItem
              label={t('rooms_label')}
              value={formatter.number(building?.rooms ?? 0)}
              Icon={BedDoubleIcon}
              data-sanity={dataAttribute('building.rooms')}
            />
            <span className="sr-only">{availabilityLabel(availability, t)}</span>
          </TooltipTrigger>
          <TooltipContent aria-hidden>{availabilityLabel(availability, t)}</TooltipContent>
        </Tooltip>
      ) : (
        <FeatureItem
          label={t('rooms_label')}
          value={formatter.number(building?.rooms ?? 0)}
          Icon={BedDoubleIcon}
          data-sanity={dataAttribute('building.rooms')}
        />
      )}
      <FeatureItem
        label={t('floors_label')}
        value={formatter.number(building?.floors ?? 0)}
        Icon={LayersIcon}
        data-sanity={dataAttribute('building.floors')}
      />
      <Link
        href={{
          pathname: '/[house]',
          params: { house: slug },
          hash: '#pricing'
        }}
      >
        <FeatureItem
          label={t('min_rent_label')}
          value={formatter.number(building?.startingPrice ?? 0, 'currency')}
          data-sanity={dataAttribute('building.startingPrice')}
        />
      </Link>
    </div>
  )
}

/** Rooms free now, or the upcoming ones when none are free yet. */
function availabilityLabel(
  { availableCount, upcomingCount }: AvailabilityCounts,
  t: ReturnType<typeof useTranslations<'HouseBuilding'>>
) {
  if (availableCount > 0) return t('rooms_available', { count: availableCount })
  if (upcomingCount > 0) return t('rooms_upcoming', { count: upcomingCount })
  return t('rooms_full')
}

function FeatureItem({
  label,
  value,
  Icon,
  className,
  'data-sanity': dataSanity
}: {
  label: string
  value: string | number
  Icon?: LucideIcon
  className?: string
  'data-sanity'?: string
}) {
  return (
    <div
      className={cn('border-border/60 bg-muted/40 rounded-lg border px-2 py-3', className)}
      data-sanity={dataSanity}
    >
      <div className="text-foreground flex items-center justify-center gap-1 text-sm font-semibold">
        {Icon && <Icon className="text-primary size-4" />}
        {value}
      </div>
      <span className="text-muted-foreground block pt-1 text-[11px] font-medium tracking-wide uppercase">
        {label}
      </span>
    </div>
  )
}
