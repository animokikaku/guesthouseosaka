import PageLayout from '@/components/next-intl/page-layout'
import { useExtracted } from 'next-intl'

export default function NotFoundPage() {
  const t = useExtracted()

  return (
    <PageLayout title={t('Page not found')}>
      <p className="max-w-[460px]">
        {t(
          'Please double-check the browser address bar or use the navigation to go to a known page.'
        )}
      </p>
    </PageLayout>
  )
}
