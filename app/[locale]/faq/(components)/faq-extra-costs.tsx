import { FAQExtraCostsCards } from '@/app/[locale]/faq/(components)/faq-extra-costs-cards'
import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import type {
  HousesBuildingQueryResult,
  PricingCategoriesQueryResult
} from '@/sanity.types'

type Houses = NonNullable<HousesBuildingQueryResult>
type PricingCategories = NonNullable<PricingCategoriesQueryResult>

type FAQExtraCostsProps = {
  pricingCategories: PricingCategories
  houses: Houses
}

export function FAQExtraCosts({
  pricingCategories,
  houses
}: FAQExtraCostsProps) {
  return (
    <>
      <div className="md:hidden">
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      </div>
      <div className="hidden md:block">
        <FAQExtraCostsTable
          houses={houses}
          pricingCategories={pricingCategories}
        />
      </div>
    </>
  )
}
