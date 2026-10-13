import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Link } from '@/i18n/navigation'
import { PageEmptyState } from '@/components/page-empty-state'
import { getCanonicalMetadata } from '@/lib/metadata'
import { sanityFetch } from '@/sanity/lib/live'
import { contactTypesListQuery } from '@/sanity/lib/queries'
import { ChevronRightIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return { alternates: getCanonicalMetadata('/contact', locale) }
}

export default async function ContactPage() {
  const locale = await getLocale()

  // Use separate query to avoid stega deduplication with layout
  const { data: contactTypes } = await sanityFetch({
    query: contactTypesListQuery,
    params: { locale }
  })

  if (!contactTypes || contactTypes.length === 0) {
    return <PageEmptyState />
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {contactTypes.map(({ _id, slug, title, description }) => (
        <Item
          key={_id}
          render={
            <Link
              prefetch
              href={{
                pathname: '/contact/[slug]',
                params: { slug },
                hash: '#tabs'
              }}
            />
          }
          className="flex-1"
        >
          <ItemContent>
            {title && <ItemTitle className="text-lg font-medium">{title}</ItemTitle>}
            {description && <ItemDescription>{description}</ItemDescription>}
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" aria-hidden />
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}
