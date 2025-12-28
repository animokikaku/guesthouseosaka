'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { HousesBuildingQueryResult } from '@/sanity.types'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

const ACCENT_CLASSES: Record<HouseIdentifier, string> = {
  orange: 'text-orange-600',
  apple: 'text-red-600',
  lemon: 'text-yellow-600'
}

const CATEGORY_ORDER = [
  'deposit',
  'common-fees',
  'utility-fees',
  'water-bill',
  'laundromat',
  'drying-machine',
  'internet'
] as const

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>
  }
}

type ExtraCostValue = NonNullable<
  NonNullable<HousesBuildingQueryResult[number]['extraCosts']>[number]['value']
>

type FAQExtraCostsTableProps = {
  houses: HousesBuildingQueryResult
}

export function FAQExtraCostsTable({ houses }: FAQExtraCostsTableProps) {
  const t = useTranslations('FAQExtraCostsTable')
  const houseLabel = useHouseLabels()

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

  // Build a lookup map: house slug -> category -> portable text value
  const costsByHouse = useMemo(() => {
    const map: Record<string, Record<string, ExtraCostValue | null>> = {}
    for (const house of houses) {
      const slug = stegaClean(house.slug)
      map[slug] = {}
      for (const cost of house.extraCosts ?? []) {
        map[slug][cost.category] = cost.value ?? null
      }
    }
    return map
  }, [houses])

  if (!houses || houses.length === 0) return null

  return (
    <div className="border-border overflow-hidden rounded-xs border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-secondary text-foreground font-semibold" />
            {houses.map((house) => {
              const slug = stegaClean(house.slug)
              return (
                <TableHead
                  key={house._id}
                  className={cn(
                    'bg-secondary font-semibold capitalize',
                    ACCENT_CLASSES[slug]
                  )}
                >
                  {houseLabel(slug).name}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {CATEGORY_ORDER.map((category) => (
            <TableRow key={category}>
              <TableCell className="text-foreground font-medium">
                {categoryLabels[category]}
              </TableCell>
              {houses.map((house) => {
                const slug = stegaClean(house.slug)
                const value = costsByHouse[slug]?.[category]
                return (
                  <TableCell key={house._id}>
                    {value ? (
                      <PortableText
                        value={value}
                        components={portableTextComponents}
                      />
                    ) : (
                      <span className="leading-relaxed">–</span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
