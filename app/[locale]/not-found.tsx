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
import { useExtracted } from 'next-intl'
import Image from 'next/image'

export default function NotFound() {
  const t = useExtracted()
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Image src="/404.svg" alt="Not found" width={750} height={500} />
        </EmptyMedia>
        <EmptyTitle className="text-2xl font-bold tracking-tight sm:text-4xl">
          {t('Oops!')}
        </EmptyTitle>
        <EmptyDescription className="text-base">
          {t(
            "The page you're looking for isn't found, we suggest you back to home."
          )}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline" size="lg">
          <Link href="/">{t('Back to home page')}</Link>
        </Button>
        <EmptyDescription>
          {t.rich('Need help? <link>Contact support</link>.', {
            link: (chunks) => <Link href="/contact/other#tabs">{chunks}</Link>
          })}
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
