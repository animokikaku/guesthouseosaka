'use client'

import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { toast } from 'sonner'

/**
 * Minimal type constraint for form values that can be submitted.
 * All forms must have an account with at least a name field.
 */
type FormValueWithAccount = {
  account: { name: string }
}

/**
 * Form type identifiers matching the ContactFormPayload discriminated union.
 */
type FormType = 'tour' | 'move-in' | 'other'

/**
 * Generic submit action that returns a promise.
 * Matches the signature of submitContactForm from app/actions/contact.ts
 */
type SubmitAction<TValue> = (payload: {
  type: FormType
  data: TValue
}) => Promise<unknown>

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
 *   onSubmit: createOnSubmit('tour', submitContactForm)
 * })
 * ```
 */
export function useFormSubmit() {
  const t = useTranslations('forms')
  const router = useRouter()

  /**
   * Handler for invalid form submissions.
   * Focuses the first input with an error for accessibility.
   */
  const onSubmitInvalid = useCallback(() => {
    const firstErrorInput = document.querySelector(
      '[aria-invalid="true"]'
    ) as HTMLElement | null
    firstErrorInput?.focus()
  }, [])

  /**
   * Creates an onSubmit handler for a specific form type.
   * Wraps the submit action with toast notifications for loading/success/error states.
   *
   * @param formType - The type of form being submitted ('tour' | 'move-in' | 'other')
   * @param submitAction - The server action to call with form data
   * @returns An async onSubmit handler compatible with @tanstack/react-form
   */
  const createOnSubmit = useCallback(
    <TValue extends FormValueWithAccount>(
      formType: FormType,
      submitAction: SubmitAction<TValue>
    ) => {
      return async ({ value }: { value: TValue }) => {
        const promise = submitAction({ type: formType, data: value })

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
      }
    },
    [t, router]
  )

  return {
    onSubmitInvalid,
    createOnSubmit
  }
}
