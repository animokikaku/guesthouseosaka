import { Link } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { HouseQueryResult } from '@/sanity.types'
import { BedDoubleIcon, LayersIcon, LucideIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'

// Legacy constant for backward compatibility - will be removed after content migration
type BuildingData = {
  rooms: number
  floors: number
  monthly_price: number
}

export const BUILDING_DATA: Record<HouseIdentifier, BuildingData> = {
  apple: { rooms: 24, floors: 8, monthly_price: 50000 },
  lemon: { rooms: 12, floors: 7, monthly_price: 50000 },
  orange: { rooms: 28, floors: 3, monthly_price: 41000 }
}

type HouseBuildingProps = {
  id: HouseIdentifier
  building: NonNullable<HouseQueryResult>['building']
}

export function HouseBuilding({ id, building }: HouseBuildingProps) {
  const t = useTranslations('HouseBuilding')
  const formatter = useFormatter()

  const currency = (amount: number) =>
    formatter.number(amount, { style: 'currency', currency: 'JPY' })

  const number = (value: number) => formatter.number(value)

  const details = [
    {
      label: t('rooms_label'),
      value: number(building?.rooms ?? 0),
      icon: BedDoubleIcon
    },
    {
      label: t('floors_label'),
      value: number(building?.floors ?? 0),
      icon: LayersIcon
    },
    {
      label: t('min_rent_label'),
      value: currency(building?.startingPrice ?? 0)
    }
  ]
  const [rooms, floors, minRent] = details

  return (
    <div className="text-muted-foreground grid grid-cols-3 gap-2 text-center text-xs">
      <FeatureItem label={rooms.label} value={rooms.value} Icon={rooms.icon} />
      <FeatureItem
        label={floors.label}
        value={floors.value}
        Icon={floors.icon}
      />
      <Link
        href={{ pathname: '/[house]', params: { house: id }, hash: '#pricing' }}
      >
        <FeatureItem label={minRent.label} value={minRent.value} />
      </Link>
    </div>
  )
}

function FeatureItem({
  label,
  value,
  Icon,
  className
}: {
  label: string
  value: string | number
  Icon?: LucideIcon
  className?: string
}) {
  return (
    <div
      key={label}
      className={cn(
        'border-border/60 bg-muted/40 rounded-lg border px-2 py-3',
        className
      )}
    >
      <div className="text-foreground flex items-center justify-center gap-1 text-sm font-semibold">
        {Icon && <Icon className="text-primary h-4 w-4" />}
        {value}
      </div>
      <span className="text-muted-foreground/70 block pt-1 text-[11px] font-medium tracking-wide uppercase">
        {label}
      </span>
    </div>
  )
}
