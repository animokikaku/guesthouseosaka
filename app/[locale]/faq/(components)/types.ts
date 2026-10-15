import type { HousesBuildingQueryResult, PricingCategoriesQueryResult } from '@/sanity.types'

/** Every house with the building, phone and extra-cost data the FAQ answers draw on. */
export type FaqHouses = NonNullable<HousesBuildingQueryResult>
export type PricingCategories = NonNullable<PricingCategoriesQueryResult>

/** A house's extra cost per pricing category; categories it doesn't list have none. */
export function extraCostsByCategory(house: Pick<FaqHouses[number], 'extraCosts'>) {
  return new Map(house.extraCosts?.map(({ categoryId, value }) => [categoryId, value]) ?? [])
}
