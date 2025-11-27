import { FAQContactTable } from '@/app/[locale]/faq/(components)/faq-contact-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export default function FAQCard() {
  const t = useTranslations('faq')

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {t('card.title')}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-md">
          {t('card.description')}
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
