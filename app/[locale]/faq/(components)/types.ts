import type { HousesBuildingQueryResult, PricingCategoriesQueryResult } from '@/sanity.types'

/** Every house with the building, phone and extra-cost data the FAQ answers draw on. */
export type FaqHouses = NonNullable<HousesBuildingQueryResult>
export type PricingCategories = NonNullable<PricingCategoriesQueryResult>
