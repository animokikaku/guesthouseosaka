import { Button } from '@/components/ui/button'
import { useSelector, type AnyReactFormApi } from '@tanstack/react-form'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type FormSubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'type' | 'disabled' | 'children' | 'form'
> & {
  formApi: AnyReactFormApi
  /** `id` of the `<form>` element this button submits, for native `form=` association. */
  formId: string
}

export const SubmitButton = ({ formApi, formId, ...props }: FormSubmitButtonProps) => {
  const t = useTranslations('SubmitButton')

  const isSubmitting = useSelector(formApi.atom, (state) => state.isSubmitting)

  return (
    <Button type="submit" form={formId} disabled={isSubmitting} aria-busy={isSubmitting} {...props}>
      {isSubmitting ? (
        <span aria-hidden="true" className="inline-flex animate-spin">
          <Loader2Icon />
        </span>
      ) : null}
      {t('label')}
    </Button>
  )
}
