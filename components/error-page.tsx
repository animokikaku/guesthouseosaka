import { Button } from '@/components/ui/button'
import { useTranslations } from 'use-intl'

export function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations('ErrorPage')

  return (
    <div className="container-wrapper flex flex-1 items-center py-16">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold text-balance">{t('title')}</h1>
        <p className="text-muted-foreground text-pretty">{t('description')}</p>
        <Button type="button" onClick={reset}>
          {t('retry')}
        </Button>
      </div>
    </div>
  )
}
