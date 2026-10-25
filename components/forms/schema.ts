import {
  createGeneralInquirySchema,
  createMoveInFormSchema,
  createTourFormSchema
} from '@/lib/schemas/contact-form'
import { useTranslations } from 'use-intl'

export function useTourFormSchema() {
  return createTourFormSchema(useTranslations('forms.validation'))
}

export function useMoveInFormSchema() {
  return createMoveInFormSchema(useTranslations('forms.validation'))
}

export function useGeneralInquirySchema() {
  return createGeneralInquirySchema(useTranslations('forms.validation'))
}
