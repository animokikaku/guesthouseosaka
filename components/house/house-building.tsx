'use client'

import { useHouseDocument } from '@/components/house/house-context'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Link } from '@/i18n/navigation'
import type { BuildingData } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { BedDoubleIcon, LayersIcon, LucideIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'
import type { ReactNode } from 'react'

interface HouseBuildingProps {
  building: BuildingData | null
  /** The rooms by floor; when set, the Rooms figure opens it, as Min Rent opens pricing. */
  floorPlan?: ReactNode
}

export function HouseBuilding({ building, floorPlan }: HouseBuildingProps) {
  const { id, type, slug } = useHouseDocument()
  const t = useTranslations('HouseBuilding')
  const formatter = useFormatter()

  const dataAttribute = createDataAttribute({ id, type })
  const roomsItem = (
    <FeatureItem
      label={t('rooms_label')}
      value={formatter.number(building?.rooms ?? 0)}
      Icon={BedDoubleIcon}
      data-sanity={dataAttribute('building.rooms')}
    />
  )

  return (
    <div className="text-muted-foreground grid grid-cols-3 gap-2 text-center text-xs">
      {floorPlan ? (
        <ResponsiveModal
          title={t('rooms_by_floor')}
          trigger={
            <button type="button" className="cursor-pointer">
              {roomsItem}
            </button>
          }
        >
          {floorPlan}
        </ResponsiveModal>
      ) : (
        roomsItem
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
