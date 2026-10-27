import {
  createGeneralInquirySchema,
  createMoveInFormSchema,
  createTourFormSchema,
  type ValidationMessages
} from '@/lib/schemas/contact-form'
import { useTranslations } from 'use-intl'

/**
 * The validation copy in the page's language. Each key is read with its own
 * literal `t()` call so `eloqnt lint` can see it is used, and the
 * `ValidationMessages` type makes leaving one out a type error.
 */
function useValidationMessages(): ValidationMessages {
  const t = useTranslations('forms.validation')

  return {
    places_min: t('places_min'),
    places_max: t('places_max'),
    name_min: t('name_min'),
    name_max: t('name_max'),
    age_positive: t('age_positive'),
    gender_required: t('gender_required'),
    nationality_required: t('nationality_required'),
    nationality_max: t('nationality_max'),
    email: t('email'),
    phone: t('phone'),
    message_min: t('message_min'),
    message_max: t('message_max'),
    date_future: t('date_future'),
    privacy_policy: t('privacy_policy'),
    stay_duration: t('stay_duration'),
    time_range: t('time_range')
  }
}

export function useTourFormSchema() {
  return createTourFormSchema(useValidationMessages())
}

export function useMoveInFormSchema() {
  return createMoveInFormSchema(useValidationMessages())
}

export function useGeneralInquirySchema() {
  return createGeneralInquirySchema(useValidationMessages())
}
