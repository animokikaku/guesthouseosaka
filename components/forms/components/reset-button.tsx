import { Button } from '@/components/ui/button'
import type { AnyReactFormApi } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

type FormResetButton = Omit<
  React.ComponentProps<typeof Button>,
  'type' | 'variant' | 'onClick' | 'children'
> & {
  formApi: AnyReactFormApi
}

export const ResetButton = ({ formApi, ...props }: FormResetButton) => {
  const t = useTranslations('ResetButton')

  return (
    <Button
      type="reset"
      variant="outline"
      onClick={(e) => {
        e.preventDefault()
        formApi.reset()
      }}
      {...props}
    >
      {t('label')}
    </Button>
  )
}
