import { ChevronRightIcon } from 'lucide-react'
import type { Locale } from 'next-intl'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { Link } from '@/i18n/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageQuery } from '@/sanity/lib/queries'
import { setRequestLocale } from 'next-intl/server'

const hrefMap = {
  tour: { pathname: '/contact/tour', hash: '#tabs' },
  'move-in': { pathname: '/contact/move-in', hash: '#tabs' },
  general: { pathname: '/contact/other', hash: '#tabs' }
} as const

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: contactPageQuery,
    params: { locale }
  })

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {data?.contactTypes?.map((contactType) => (
        <ContactLink
          key={contactType._key}
          href={hrefMap[contactType.key]}
          title={contactType.title ?? ''}
          description={contactType.description ?? ''}
        />
      ))}
    </div>
  )
}

function ContactLink({
  href,
  title,
  description
}: {
  href: (typeof hrefMap)[keyof typeof hrefMap]
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
