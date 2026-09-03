'use client'

import { submitContactForm } from '@/app/actions/contact'
import { useRouter } from '@/i18n/navigation'
import type { ContactFormPayload } from '@/lib/schemas/contact-form'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/ui/toast'

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
 *   validators: [{ run: schema, triggers: [] }],
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
    /**
     * Reads the form's parsed schema output rather than its raw values: the
     * editable state allows empty placeholders such as an unselected gender,
     * and only the parsed output is narrowed to the payload the server action
     * accepts. `onSubmit` only runs once validation succeeds, so the form's
     * single schema validator has always produced its output by this point.
     */
    return async ({ schemaOutputs: [value] }: { schemaOutputs: FormTypeDataMap[T][] }) => {
      if (!value) {
        throw new Error(`Missing validated schema output for the "${formType}" form.`)
      }
      // TypeScript cannot correlate a generic key with its mapped discriminated-union value.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const payload = { type: formType, data: value } as ContactFormPayload
      const promise = submitContactForm(payload).then((result) => {
        if (!result.ok) {
          throw new Error(result.code)
        }
      })

      return await toast.promise(promise, {
        loading: { title: t('status.sending') },
        success: () => {
          router.push('/contact')
          return {
            title: t('status.success.message'),
            description: t('status.success.description', {
              name: value.account.name
            })
          }
        },
        error: () => {
          return {
            title: t('status.error.message'),
            description: t('status.error.description', {
              email: 'info@guesthouseosaka.com'
            })
          }
        }
      })
    }
  }

  return {
    onSubmitInvalid,
    createOnSubmit
  }
}
