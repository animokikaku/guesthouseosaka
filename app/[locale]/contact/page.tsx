import { ChevronRightIcon } from 'lucide-react'
import { Locale, useTranslations } from 'next-intl'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { Link } from '@/i18n/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function ContactPage({
  params
}: PageProps<'/[locale]/contact'>) {
  const { locale } = use(params)
  setRequestLocale(locale as Locale)
  const t = useTranslations('contact')

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      <ContactLink
        href="/contact/tour#tabs"
        title={t('nav.tour')}
        description={t('cards.tourDescription')}
      />
      <ContactLink
        href="/contact/move-in#tabs"
        title={t('nav.moveIn')}
        description={t('cards.moveInDescription')}
      />
      <ContactLink
        href="/contact/other#tabs"
        title={t('nav.general')}
        description={t('cards.generalDescription')}
      />
    </div>
  )
}

function ContactLink({
  href,
  title,
  description
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Item asChild className="flex-1">
      <Link href={href} className="flex w-full items-center gap-4">
        <ItemContent>
          <ItemTitle className="text-lg font-medium">{title}</ItemTitle>
          <ItemDescription className="text-md">{description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" aria-hidden />
        </ItemActions>
      </Link>
    </Item>
  )
}
