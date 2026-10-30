import { PageEmptyState } from '@/components/page-empty-state'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { canonicalLink } from '@/lib/metadata'
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'

const contactLayout = getRouteApi('/$locale/contact')

export const Route = createFileRoute('/$locale/contact/')({
  head: ({ params: { locale } }) => ({
    links: [canonicalLink({ to: '/$locale/contact' }, locale)]
  }),
  component: ContactPage
})

function ContactPage() {
  const { locale } = Route.useParams()
  // Lists the contact types the section layout already loaded.
  const contactTypes = contactLayout.useLoaderData({ select: (data) => data.contactTypes })

  if (contactTypes.length === 0) {
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
