'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
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

const DEFAULT_CATEGORY_ORDER = [
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
    normal: ({ children }) => (
      <p className="leading-relaxed whitespace-pre-line">{children}</p>
    )
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
    bullet: ({ children }) => <li className="wrap-break-word">{children}</li>,
    number: ({ children }) => <li className="wrap-break-word">{children}</li>
  }
}

type Houses = NonNullable<HousesBuildingQueryResult>

type ExtraCostValue = NonNullable<Houses[number]['extraCosts']>[number]['value']

type CategoryOrder = (typeof DEFAULT_CATEGORY_ORDER)[number]

type FAQExtraCostsTableProps = {
  houses: Houses
  categoryOrder?: CategoryOrder[] | null
}

export function FAQExtraCostsTable({
  houses,
  categoryOrder
}: FAQExtraCostsTableProps) {
  // Use Sanity category order if provided, otherwise fall back to default
  const effectiveCategoryOrder =
    categoryOrder && categoryOrder.length > 0
      ? categoryOrder
      : DEFAULT_CATEGORY_ORDER
  const t = useTranslations('FAQExtraCostsTable')

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
        // Clean category to remove stega encoding in draft mode
        const category = stegaClean(cost.category)
        map[slug][category] = cost.value ?? null
      }
    }
    return map
  }, [houses])

  if (houses.length === 0) return null

  return (
    <div className="border-border overflow-hidden rounded-xs border">
      <Table className="w-full table-fixed">
        <colgroup>
          <col className="w-30" />
          {houses.map(({ _id }) => (
            <col key={_id} />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-secondary text-foreground font-semibold" />
            {houses.map(({ _id, title, slug }) => {
              return (
                <TableHead
                  key={_id}
                  className={cn(
                    'bg-secondary font-semibold',
                    ACCENT_CLASSES[slug]
                  )}
                >
                  {stegaClean(title)}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {effectiveCategoryOrder.map((category) => (
            <TableRow key={category}>
              <TableCell className="text-foreground font-medium whitespace-nowrap">
                {categoryLabels[category]}
              </TableCell>
              {houses.map(({ _id, slug }) => {
                const value = costsByHouse[slug]?.[category]
                return (
                  <TableCell key={_id} className="overflow-hidden">
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
