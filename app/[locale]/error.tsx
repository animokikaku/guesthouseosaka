'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function ErrorPage({ retry }: { retry: () => void }) {
  const t = useTranslations('ErrorPage')

  return (
    <div className="container-wrapper section-soft flex flex-1 items-center py-16">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold text-balance">{t('title')}</h1>
        <p className="text-muted-foreground text-pretty">{t('description')}</p>
        <Button type="button" onClick={retry}>
          {t('retry')}
        </Button>
      </div>
    </div>
  )
}
