import type { Locale } from 'next-intl'

import { PageEmptyState } from '@/components/page-empty-state'
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
import { ChevronRightIcon } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: contactPageQuery,
    params: { locale }
  })

  if (!data || !data.contactTypes) {
    return <PageEmptyState />
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {data.contactTypes.map(({ _id, slug, title, description }) => (
        <Item key={_id} asChild className="flex-1">
          <Link
            href={{
              pathname: '/contact/[slug]',
              params: { slug },
              hash: '#tabs'
            }}
            className="flex w-full items-center gap-4"
          >
            <ItemContent>
              {title && (
                <ItemTitle className="text-lg font-medium">{title}</ItemTitle>
              )}
              {description && (
                <ItemDescription className="text-md">
                  {description}
                </ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" aria-hidden />
            </ItemActions>
          </Link>
        </Item>
      ))}
    </div>
  )
}
