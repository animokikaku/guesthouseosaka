'use client'

import type { ContactFormFields } from '@/components/forms/schema'
import {
  userAccountDefaultValues,
  type UserAccountDraft
} from '@/components/forms/user-account-fields'
import type { HousesTitlesQueryResult } from '@/sanity.types'

export { useAppForm } from './app-form'
export { FieldGroupPlaces } from './places-fields'
export { FieldGroupUserAccount, userAccountFieldBindings } from './user-account-fields'
export { useFormSubmit } from './use-form-submit'

export type HouseTitles = HousesTitlesQueryResult

/**
 * Every contact form field as the user edits it.
 *
 * `privacyPolicy` and `stayDuration` start empty and only become valid once the
 * user acts, so the editable state is wider than the validated state. Submit
 * validation narrows both back to the schema type.
 */
export interface ContactFormDraft extends Omit<
  ContactFormFields,
  'account' | 'privacyPolicy' | 'stayDuration'
> {
  account: UserAccountDraft
  privacyPolicy: ContactFormFields['privacyPolicy'] | false
  stayDuration: ContactFormFields['stayDuration'] | ''
}

/**
 * Default values for every contact form field. Each form picks the subset it
 * renders, so the shapes stay aligned with their schemas.
 */
export const contactFormDefaultValues: ContactFormDraft = {
  places: [],
  account: userAccountDefaultValues,
  message: '',
  date: '',
  privacyPolicy: false,
  stayDuration: '',
  hour: ''
}
