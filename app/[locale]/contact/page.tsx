import { ChevronRightIcon } from 'lucide-react'
import { Locale } from 'next-intl'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { Link } from '@/i18n/navigation'
import { getExtracted, setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getExtracted()

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      <ContactLink
        href="/contact/tour#tabs"
        title={t('Tour request')}
        description={t(
          'Schedule a visit to see our share houses and get a feel for what we offer.'
        )}
      />
      <ContactLink
        href="/contact/move-in#tabs"
        title={t('Move in request')}
        description={t(
          'Ready to move in? Share your preferences and timeline.'
        )}
      />
      <ContactLink
        href="/contact/other#tabs"
        title={t('General inquiry')}
        description={t(
          'Questions about rooms, pricing, or availability? We’re happy to help.'
        )}
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
