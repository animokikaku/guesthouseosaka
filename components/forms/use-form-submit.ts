'use client'

import { submitContactForm } from '@/app/actions/contact'
import type {
  GeneralInquiryFields,
  MoveInFormFields,
  TourFormFields
} from '@/components/forms/schema'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

/**
 * Mapping from form type to its corresponding field types.
 */
type FormTypeDataMap = {
  tour: TourFormFields
  'move-in': MoveInFormFields
  other: GeneralInquiryFields
}

/**
 * Form type identifiers matching the ContactFormPayload discriminated union.
 */
type FormType = keyof FormTypeDataMap

/**
 * Hook that provides shared form submission handlers.
 *
 * Extracts the duplicated onSubmit/onSubmitInvalid/toast.promise pattern
 * used across ContactForm, TourForm, and MoveInForm.
 *
 * @example
 * ```tsx
 * const { onSubmitInvalid, createOnSubmit } = useFormSubmit()
 *
 * const form = useAppForm({
 *   defaultValues: {...},
 *   validators: { onSubmit: schema },
 *   onSubmitInvalid,
 *   onSubmit: createOnSubmit('tour')
 * })
 * ```
 */
export function useFormSubmit() {
  const t = useTranslations('forms')
  const router = useRouter()

  const onSubmitInvalid = () => {
    const firstErrorInput = document.querySelector('[aria-invalid="true"]') as HTMLElement | null
    firstErrorInput?.focus()
  }

  const createOnSubmit = <T extends FormType>(formType: T) => {
    return async ({ value }: { value: FormTypeDataMap[T] }) => {
      const promise = submitContactForm({
        type: formType,
        data: value
      } as Parameters<typeof submitContactForm>[0])

      toast.promise(promise, {
        loading: t('status.sending'),
        success: () => {
          router.push('/contact')
          return {
            message: t('status.success.message'),
            description: t('status.success.description', {
              name: value.account.name
            })
          }
        },
        error: (error: Error) => {
          return {
            message: error.message || t('status.error.message'),
            description: t('status.error.description', {
              email: 'info@guesthouseosaka.com'
            })
          }
        }
      })

      return await promise
    }
  }

  return {
    onSubmitInvalid,
    createOnSubmit
  }
}
