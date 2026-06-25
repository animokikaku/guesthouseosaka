import { useFormContext } from '@/components/forms/form-context'
import { Button } from '@/components/ui/button'
import { useStore } from '@tanstack/react-form'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type FormSubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'type' | 'disabled' | 'children'
>

export const SubmitButton = (props: FormSubmitButtonProps) => {
  const form = useFormContext()
  const t = useTranslations('SubmitButton')

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  return (
    <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} {...props}>
      {isSubmitting ? (
        <span aria-hidden="true" className="inline-flex animate-spin">
          <Loader2Icon />
        </span>
      ) : null}
      {t('label')}
    </Button>
  )
}
