import type { HouseIdentifier } from '@/lib/types'
import { getLocale } from 'next-intl/server'

/** Params + locale for pages under HouseLayout (slug validity is enforced there). */
export async function getHouseAndLocale(params: Promise<{ house: string }>) {
  const [{ house }, locale] = await Promise.all([params, getLocale()])
  // The parent layout validates this segment with isHouseIdentifier before rendering its children.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return { house: house as HouseIdentifier, locale }
}
