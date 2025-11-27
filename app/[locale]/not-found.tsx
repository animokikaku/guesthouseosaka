// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function NotFound() {
  const t = useTranslations('errors.notFound')
  const { notFound } = assets

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Image priority {...notFound} alt={notFound.alt} />
        </EmptyMedia>
        <EmptyTitle className="text-2xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </EmptyTitle>
        <EmptyDescription className="text-base">
          {t('description')}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline" size="lg">
          <Link href="/">{t('backToHome')}</Link>
        </Button>
        <EmptyDescription>
          {t.rich('contactSupport', {
            link: (chunks) => <Link href="/contact/other#tabs">{chunks}</Link>
          })}
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
