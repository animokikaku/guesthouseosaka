import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

type FormCardProps = {
  /** Form title displayed in the card header */
  title?: ReactNode
  /** Form description displayed below the title */
  description?: ReactNode
  /** Unique form ID used for form submission and button association */
  formId: string
  /** Form submit handler */
  onSubmit: () => void
  /** Form content (fields wrapped in FieldGroup) */
  children: ReactNode
  /** Footer content (typically form buttons via AppForm) */
  footer: ReactNode
  /** Additional class names for the Card container */
  className?: string
  /** Additional class names for the CardFooter */
  footerClassName?: string
}

export function FormCard({
  title,
  description,
  formId,
  onSubmit,
  children,
  footer,
  className,
  footerClassName
}: FormCardProps) {
  return (
    <Card className={cn('mx-auto w-full max-w-2xl', className)}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          {children}
        </form>
      </CardContent>
      <CardFooter className={footerClassName}>
        <Field orientation="horizontal">{footer}</Field>
      </CardFooter>
    </Card>
  )
}
