import { FooterStyle } from '@/components/footer-style'
import { Image } from '@/components/image'
import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { assets } from '@/lib/assets'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'use-intl'

function ContactUsLink({ children }: { children: ReactNode }) {
  const locale = useLocale()
  return (
    <Link to="/$locale/contact/$slug" params={{ locale, slug: 'other' }} hash="tabs">
      {children}
    </Link>
  )
}

function renderContactLink(chunks: ReactNode) {
  return <ContactUsLink>{chunks}</ContactUsLink>
}

/** The locale layout's 404 page, for any unknown path under a supported locale. */
export function LocaleNotFound() {
  const t = useTranslations('NotFound')
  const locale = useLocale()

  return (
    <Empty>
      <FooterStyle plain />
      <EmptyHeader>
        <EmptyMedia>
          <Image preload {...assets.notFound} alt={assets.notFound.alt} />
        </EmptyMedia>
        <EmptyTitle className="text-2xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </EmptyTitle>
        <EmptyDescription className="text-base">{t('description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          to="/$locale"
          params={{ locale }}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          {t('back_home')}
        </Link>
        <EmptyDescription>{t.rich('contact_us', { link: renderContactLink })}</EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
