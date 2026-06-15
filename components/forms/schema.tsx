import {
  createGeneralInquirySchema,
  createMoveInFormSchema,
  createTourFormSchema,
  type ContactFormValidationMessages
} from '@/lib/schemas/contact-form'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export type {
  ContactFormFields,
  ContactFormPayload,
  GeneralInquiryFields,
  MoveInFormFields,
  TourFormFields
} from '@/lib/schemas/contact-form'

function useContactFormValidationMessages(): ContactFormValidationMessages {
  const t = useTranslations('ContactFormValidation')

  return useMemo(
    () => ({
      places_min: t('places_min'),
      places_max: t('places_max'),
      name_min: t('name_min'),
      age_positive: t('age_positive'),
      gender_required: t('gender_required'),
      nationality_required: t('nationality_required'),
      nationality_max: t('nationality_max'),
      email: t('email'),
      phone: t('phone'),
      message_max: t('message_max'),
      message_min: t('message_min'),
      date_future: t('date_future'),
      privacy_policy: t('privacy_policy'),
      stay_duration: t('stay_duration'),
      time_range: t('time_range')
    }),
    [t]
  )
}

export function useTourFormSchema() {
  const messages = useContactFormValidationMessages()
  return useMemo(() => createTourFormSchema(messages), [messages])
}

export function useMoveInFormSchema() {
  const messages = useContactFormValidationMessages()
  return useMemo(() => createMoveInFormSchema(messages), [messages])
}

export function useGeneralInquirySchema() {
  const messages = useContactFormValidationMessages()
  return useMemo(() => createGeneralInquirySchema(messages), [messages])
}
