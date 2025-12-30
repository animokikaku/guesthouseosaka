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
import type {
  HousesBuildingQueryResult,
  PricingCategoriesQueryResult
} from '@/sanity.types'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import { useMemo } from 'react'

const ACCENT_CLASSES: Record<HouseIdentifier, string> = {
  orange: 'text-orange-600',
  apple: 'text-red-600',
  lemon: 'text-yellow-600'
}

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
type PricingCategories = NonNullable<PricingCategoriesQueryResult>

type ExtraCostValue = NonNullable<Houses[number]['extraCosts']>[number]['value']

type FAQExtraCostsTableProps = {
  houses: Houses
  pricingCategories: PricingCategories
}

export function FAQExtraCostsTable({
  houses,
  pricingCategories
}: FAQExtraCostsTableProps) {
  // Build a lookup map: house slug -> category slug -> portable text value
  const costsByHouse = useMemo(() => {
    const map: Record<string, Record<string, ExtraCostValue | null>> = {}
    for (const house of houses) {
      const houseSlug = stegaClean(house.slug)
      map[houseSlug] = {}
      for (const cost of house.extraCosts ?? []) {
        const categorySlug = stegaClean(cost.category?.slug)
        if (categorySlug) {
          map[houseSlug][categorySlug] = cost.value ?? null
        }
      }
    }
    return map
  }, [houses])

  if (houses.length === 0 || !pricingCategories?.length) return null

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
              const cleanSlug = stegaClean(slug)
              return (
                <TableHead
                  key={_id}
                  className={cn(
                    'bg-secondary font-semibold',
                    ACCENT_CLASSES[cleanSlug]
                  )}
                >
                  {stegaClean(title)}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingCategories.map((category) => {
            const categorySlug = stegaClean(category.slug)
            const categoryTitle = stegaClean(category.title)
            if (!categorySlug) return null
            return (
              <TableRow key={category._id}>
                <TableCell className="text-foreground font-medium whitespace-nowrap">
                  {categoryTitle}
                </TableCell>
                {houses.map(({ _id, slug }) => {
                  const cleanSlug = stegaClean(slug)
                  const value = costsByHouse[cleanSlug]?.[categorySlug]
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
