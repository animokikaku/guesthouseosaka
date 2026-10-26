import { FAQExtraCostsCards } from '@/components/faq/faq-extra-costs-cards'
import { FAQExtraCostsTable } from '@/components/faq/faq-extra-costs-table'
import type { FaqHouses, PricingCategories } from '@/components/faq/types'

type FAQExtraCostsProps = {
  pricingCategories: PricingCategories
  houses: FaqHouses
}

export function FAQExtraCosts({ pricingCategories, houses }: FAQExtraCostsProps) {
  return (
    <>
      <div className="md:hidden">
        <FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />
      </div>
      <div className="hidden md:block">
        <FAQExtraCostsTable houses={houses} pricingCategories={pricingCategories} />
      </div>
    </>
  )
}
