'use client'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { useOptimistic } from '@/hooks/use-optimistic'
import { Link } from '@/i18n/navigation'
import type { ContactPageQueryResult } from '@/sanity.types'
import { ChevronRightIcon } from 'lucide-react'

type ContactPage = NonNullable<ContactPageQueryResult>
type ContactPageData = Pick<ContactPage, '_id' | '_type' | 'contactTypes'> & {
  contactTypes: NonNullable<ContactPage['contactTypes']>
}

export function ContactTypesList(props: ContactPageData) {
  const [contactTypes, attr] = useOptimistic(props, 'contactTypes')

  return (
    <div
      className="mx-auto flex w-full flex-col gap-4"
      data-sanity={attr.list()}
    >
      {contactTypes.map(({ _key, slug, title, description }) => {
        return (
          <Item
            key={_key}
            asChild
            className="flex-1"
            data-sanity={attr.item(_key)}
          >
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
