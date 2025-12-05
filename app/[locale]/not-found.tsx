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
  const t = useTranslations('NotFound')

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Image priority {...assets.notFound} alt={assets.notFound.alt} />
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
          <Link href="/">{t('back_home')}</Link>
        </Button>
        <EmptyDescription>
          {t.rich('contact_us', {
            link: (chunks) => (
              <Link href={{ pathname: '/contact/other', hash: '#tabs' }}>
                {chunks}
              </Link>
            )
          })}
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
