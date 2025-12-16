import { FAQContactTable } from '@/app/[locale]/faq/(components)/faq-contact-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export default function FAQCard() {
  const t = useTranslations('FAQCard')

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        <CardDescription className="text-muted-foreground text-md">
          {t('description')}
        </CardDescription>
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
