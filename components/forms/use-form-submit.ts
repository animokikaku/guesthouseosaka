'use client'

import { submitContactForm } from '@/app/actions/contact'
import { useRouter } from '@/i18n/navigation'
import type { ContactFormPayload } from '@/lib/schemas/contact-form'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

/**
 * Mapping from form type to its corresponding field types.
 */
type FormType = ContactFormPayload['type']
type FormTypeDataMap = {
  [T in FormType]: Extract<ContactFormPayload, { type: T }>['data']
}

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
    const firstErrorInput = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    firstErrorInput?.focus()
  }

  const createOnSubmit = <T extends FormType>(formType: T) => {
    return async ({ value }: { value: FormTypeDataMap[T] }) => {
      // TypeScript cannot correlate a generic key with its mapped discriminated-union value.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const payload = { type: formType, data: value } as ContactFormPayload
      const promise = submitContactForm(payload).then((result) => {
        if (!result.ok) {
          throw new Error(result.code)
        }
      })

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
        error: () => {
          return {
            message: t('status.error.message'),
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
