import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TurnstileWidget, type TurnstileToken } from '@/components/forms/turnstile'
import { Field, FieldGroup } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { useSelector, type AnyReactFormApi } from '@tanstack/react-form'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'use-intl'

interface FormCardProps {
  title?: string | null
  description?: string | null
  formId: string
  form: AnyReactFormApi
  /** From `useFormSubmit`, whose submit handler spends the widget's token. */
  turnstile: TurnstileToken
  children: React.ReactNode
  className?: string
}

export function FormCard({
  title,
  description,
  formId,
  form,
  turnstile,
  children,
  className
}: FormCardProps) {
  const t = useTranslations('SubmitButton')
  const isSubmitting = useSelector(form.atom, (state) => state.isSubmitting)
  // Without a token the server would reject the submission, so wait for Turnstile.
  const verifying = !isSubmitting && !turnstile.token
  const busy = isSubmitting || verifying

  return (
    <Card className={cn('mx-auto w-full sm:max-w-2xl', className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>{children}</FieldGroup>
          <TurnstileWidget key={turnstile.widgetKey} onToken={turnstile.setToken} />
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          {/* Outside the <form>, so it submits through the native `form=` association. */}
          <Button type="submit" form={formId} disabled={busy} aria-busy={busy}>
            {busy ? (
              <span aria-hidden="true" className="inline-flex animate-spin">
                <Loader2Icon />
              </span>
            ) : null}
            {verifying ? t('verifying') : t('label')}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
