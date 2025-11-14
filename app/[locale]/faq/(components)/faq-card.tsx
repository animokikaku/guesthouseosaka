import { FAQContactTable } from '@/app/[locale]/faq/(components)/faq-contact-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useExtracted } from 'next-intl'

export default function FAQCard() {
  const t = useExtracted()

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {t('Still have questions?')}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-md">
          {t('Have questions or need assistance? Our team is here to help!')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <FAQContactTable />
        </div>
      </CardContent>
    </Card>
  )
}
