import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Link } from '@/i18n/navigation'
import { PageEmptyState } from '@/components/page-empty-state'
import { sanityFetch } from '@/sanity/lib/live'
import { contactTypesListQuery } from '@/sanity/lib/queries'
import { ChevronRightIcon } from 'lucide-react'
import type { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

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
              {title && <ItemTitle className="text-lg font-medium">{title}</ItemTitle>}
              {description && <ItemDescription className="text-md">{description}</ItemDescription>}
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
