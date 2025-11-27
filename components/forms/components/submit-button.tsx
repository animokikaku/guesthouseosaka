import { useFormContext } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { useStore } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

type FormSubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'type' | 'disabled' | 'children'
>

export const SubmitButton = (props: FormSubmitButtonProps) => {
  const form = useFormContext()
  const t = useTranslations()

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit
  ])

  return (
    <Button type="submit" disabled={isSubmitting || !canSubmit} {...props}>
      {t('common.submit')}
    </Button>
  )
}
