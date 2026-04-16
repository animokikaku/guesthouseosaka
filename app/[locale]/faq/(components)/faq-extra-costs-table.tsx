import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/utils/theme'
import type { HousesBuildingQueryResult, PricingCategoriesQueryResult } from '@/sanity.types'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { stegaClean } from 'next-sanity'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed whitespace-pre-line">{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul className="list-none space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-none space-y-1">{children}</ol>
  },
  listItem: {
    bullet: ({ children }) => <li className="wrap-break-word">{children}</li>,
    number: ({ children }) => <li className="wrap-break-word">{children}</li>
  }
}

type Houses = NonNullable<HousesBuildingQueryResult>
type PricingCategories = NonNullable<PricingCategoriesQueryResult>

type FAQExtraCostsTableProps = {
  houses: Houses
  pricingCategories: PricingCategories
}

export function FAQExtraCostsTable({ houses, pricingCategories }: FAQExtraCostsTableProps) {
  if (houses.length === 0 || pricingCategories.length === 0) {
    return null
  }

  return (
    <div className="border-border overflow-hidden rounded-xs border">
      <Table className="w-full table-fixed">
        <colgroup>
          <col className="w-36" />
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
                  className={cn('bg-secondary font-semibold', HOUSE_COLORS[slug].text)}
                >
                  {stegaClean(title)}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingCategories.map((category) => (
            <TableRow key={category._id}>
              <TableCell className="text-foreground font-medium whitespace-nowrap">
                {category.title}
              </TableCell>
              {houses.map((house) => {
                const cost = house.extraCosts?.find((c) => c.categoryId === category._id)
                return (
                  <TableCell key={house._id} className="overflow-hidden">
                    {cost?.value ? (
                      <PortableText value={cost.value} components={portableTextComponents} />
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
