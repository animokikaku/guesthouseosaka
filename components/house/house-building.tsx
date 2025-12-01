import { cn } from '@/lib/utils'

import { Link } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import { BedDoubleIcon, LayersIcon, LucideIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const yenFormatter = new Intl.NumberFormat('ja-JP', {
  currency: 'JPY',
  maximumFractionDigits: 0,
  style: 'currency'
})

type BuildingData = {
  bedrooms: number
  floors: number
  monthly_price: number
}

const BUILDING_DATA: Record<HouseIdentifier, BuildingData> = {
  apple: {
    bedrooms: 24,
    floors: 8,
    monthly_price: 50000
  },
  lemon: {
    bedrooms: 12,
    floors: 7,
    monthly_price: 50000
  },
  orange: {
    bedrooms: 30,
    floors: 3,
    monthly_price: 38000
  }
}

export async function HouseBuilding({ id }: { id: HouseIdentifier }) {
  const building = BUILDING_DATA[id]
  const t = await getTranslations('HouseBuilding')
  const details = [
    {
      label: t('rooms_label'),
      value: building.bedrooms,
      icon: BedDoubleIcon
    },
    {
      label: t('floors_label'),
      value: building.floors,
      icon: LayersIcon
    },
    {
      label: t('min_rent_label'),
      value: yenFormatter.format(building.monthly_price)
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
      <Link href="#pricing">
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
