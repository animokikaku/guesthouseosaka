import { FAQContactTable } from '@/app/[locale]/faq/(components)/faq-contact-table'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import type { FaqPageQueryResult } from '@/sanity.types'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { useTranslations } from 'next-intl'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold">{children}</h2>
    ),
    normal: ({ children }) => (
      <p className="text-muted-foreground text-md">{children}</p>
    )
  }
}

type FAQCardProps = {
  contactSection: NonNullable<FaqPageQueryResult>['contactSection'] | null
}

export default function FAQCard({ contactSection }: FAQCardProps) {
  const t = useTranslations('FAQCard')

  return (
    <Card>
      <CardHeader className="text-center">
        {contactSection && (
          <PortableText value={contactSection} components={components} />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <FAQContactTable />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <div className="text-muted-foreground text-sm">＊{t('subtext')}</div>
      </CardFooter>
    </Card>
  )
}
