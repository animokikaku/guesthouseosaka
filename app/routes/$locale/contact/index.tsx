import { PageEmptyState } from '@/components/page-empty-state'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { canonicalLink } from '@/lib/metadata'
import { getContactTypes } from '@/sanity/lib/loaders.functions'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'

export const Route = createFileRoute('/$locale/contact/')({
  loader: ({ params: { locale } }) => getContactTypes({ data: { locale } }),
  head: ({ params: { locale } }) => ({ links: [canonicalLink('/contact', locale)] }),
  component: ContactPage
})

function ContactPage() {
  const { locale } = Route.useParams()
  const contactTypes = Route.useLoaderData()

  if (!contactTypes || contactTypes.length === 0) {
    return <PageEmptyState />
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {contactTypes.map(({ _id, slug, title, description }) => (
        <Item
          key={_id}
          render={<Link to="/$locale/contact/$slug" params={{ locale, slug }} hash="tabs" />}
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
