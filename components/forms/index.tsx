'use client'

import { userAccountDefaultValues } from '@/components/forms/user-account-fields'
import type { ContactFormFields } from '@/components/forms/schema'
import type { HouseIdentifier } from '@/lib/types'
import type { HousesTitlesQueryResult } from '@/sanity.types'

export { useAppForm } from './app-form'
export { FieldGroupPlaces } from './places-fields'
export { FieldGroupUserAccount, userAccountFieldBindings } from './user-account-fields'
export { useFormSubmit } from './use-form-submit'

export type HouseTitles = HousesTitlesQueryResult

/**
 * Default values for every contact form field. Each form picks the subset it
 * renders, so the shapes stay aligned with their schemas.
 */
export const contactFormDefaultValues = {
  places: [] as HouseIdentifier[],
  account: userAccountDefaultValues,
  message: '',
  date: '',
  // These empty states are invalid until the user completes the form.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  privacyPolicy: false as ContactFormFields['privacyPolicy'],
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  stayDuration: '' as ContactFormFields['stayDuration'],
  hour: ''
} satisfies ContactFormFields
