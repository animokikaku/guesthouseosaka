'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { useSelector, type AnyReactFormApi } from '@tanstack/react-form'
import { Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FormCardProps {
  title?: string | null
  description?: string | null
  formId: string
  form: AnyReactFormApi
  children: React.ReactNode
  className?: string
}

export function FormCard({ title, description, formId, form, children, className }: FormCardProps) {
  const t = useTranslations('SubmitButton')
  const isSubmitting = useSelector(form.atom, (state) => state.isSubmitting)

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
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          {/* Outside the <form>, so it submits through the native `form=` association. */}
          <Button type="submit" form={formId} disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? (
              <span aria-hidden="true" className="inline-flex animate-spin">
                <Loader2Icon />
              </span>
            ) : null}
            {t('label')}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
