import { useFormContext } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type FormResetButton = Omit<
  React.ComponentProps<typeof Button>,
  'type' | 'variant' | 'onClick' | 'children'
>

export const ResetButton = (props: FormResetButton) => {
  const form = useFormContext()
  const t = useTranslations()

  return (
    <Button
      type="reset"
      variant="outline"
      onClick={(e) => {
        e.preventDefault()
        form.reset()
      }}
      {...props}
    >
      {t('common.reset')}
    </Button>
  )
}
