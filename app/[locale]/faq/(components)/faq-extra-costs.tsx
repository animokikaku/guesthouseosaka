'use client'

import { FAQExtraCostsCards } from '@/app/[locale]/faq/(components)/faq-extra-costs-cards'
import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import { useOptimistic } from '@/hooks/use-optimistic'
import type {
  FaqPageQueryResult,
  HousesBuildingQueryResult
} from '@/sanity.types'

type FaqPage = NonNullable<FaqPageQueryResult>
type Houses = NonNullable<HousesBuildingQueryResult>

type FaqCategoryOrderData = Pick<FaqPage, '_id' | '_type' | 'categoryOrder'>

type FAQExtraCostsProps = {
  faqPage: FaqCategoryOrderData
  houses: Houses
}

export function FAQExtraCosts({ faqPage, houses }: FAQExtraCostsProps) {
  const [categoryOrder, categoryOrderAttr] = useOptimistic(
    faqPage,
    'categoryOrder'
  )

  return (
    <>
      <div className="md:hidden">
        <FAQExtraCostsCards
          houses={houses}
          categoryOrder={categoryOrder}
          categoryOrderAttr={categoryOrderAttr}
        />
      </div>
      <div className="hidden md:block">
        <FAQExtraCostsTable
          houses={houses}
          categoryOrder={categoryOrder}
          categoryOrderAttr={categoryOrderAttr}
        />
      </div>
    </>
  )
}
