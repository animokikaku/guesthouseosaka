import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { Link } from '@/i18n/navigation'
import type { ContactTypeItem } from '@/lib/types/components'
import { ChevronRightIcon } from 'lucide-react'

type ContactTypesListProps = {
  contactTypes: ContactTypeItem[]
}

export function ContactTypesList({ contactTypes }: ContactTypesListProps) {
  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {contactTypes.map(({ _id, slug, title, description }) => {
        return (
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
        )
      })}
    </div>
  )
}
