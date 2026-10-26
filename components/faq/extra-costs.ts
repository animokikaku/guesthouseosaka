import type { FaqHouses } from '@/components/faq/types'

/** A house's extra cost per pricing category; categories it doesn't list have none. */
export function extraCostsByCategory(house: Pick<FaqHouses[number], 'extraCosts'>) {
  return new Map(house.extraCosts?.map(({ categoryId, value }) => [categoryId, value]) ?? [])
}
