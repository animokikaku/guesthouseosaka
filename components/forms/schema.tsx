import {
  createGeneralInquirySchema,
  createMoveInFormSchema,
  createTourFormSchema,
  type ContactFormValidationMessages
} from '@/lib/schemas/contact-form'
import { useTranslations } from 'next-intl'

export type {
  ContactFormFields,
  ContactFormPayload,
  GeneralInquiryFields,
  MoveInFormFields,
  TourFormFields
} from '@/lib/schemas/contact-form'

function useContactFormValidationMessages(): ContactFormValidationMessages {
  const t = useTranslations('forms.validation')

  return {
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
  }
}

export function useTourFormSchema() {
  return createTourFormSchema(useContactFormValidationMessages())
}

export function useMoveInFormSchema() {
  return createMoveInFormSchema(useContactFormValidationMessages())
}

export function useGeneralInquirySchema() {
  return createGeneralInquirySchema(useContactFormValidationMessages())
}
