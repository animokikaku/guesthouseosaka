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
import { stegaClean } from 'next-sanity'

const hrefMap = {
  tour: { pathname: '/contact/tour', hash: '#tabs' },
  'move-in': { pathname: '/contact/move-in', hash: '#tabs' },
  general: { pathname: '/contact/other', hash: '#tabs' }
} as const

type ContactPageProps = Pick<
  NonNullable<ContactPageQueryResult>,
  'contactTypes' | '_id' | '_type'
>

export function ContactTypesList(props: ContactPageProps) {
  const [contactTypes, attr] = useOptimistic(props, 'contactTypes')

  if (!contactTypes) {
    return null
  }

  return (
    <div
      className="mx-auto flex w-full flex-col gap-4"
      data-sanity={attr.list()}
    >
      {contactTypes.map(({ _key, title, description, key }) => (
        <Item
          key={_key}
          asChild
          className="flex-1"
          data-sanity={attr.item(_key)}
        >
          <Link
            href={hrefMap[stegaClean(key)]}
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
