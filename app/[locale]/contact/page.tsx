import { ChevronRightIcon } from 'lucide-react'
import { Locale } from 'next-intl'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import {
  ContactNavigationKey,
  useContactNavigation
} from '@/hooks/use-contact-navigation'
import { Link } from '@/i18n/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function ContactPage({
  params
}: PageProps<'/[locale]/contact'>) {
  const { locale } = use(params)

  setRequestLocale(locale as Locale)
  const navLabel = useContactNavigation()
  const keys: ContactNavigationKey[] = ['tour', 'move-in', 'general']

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {keys.map((key) => {
        const { href, title, description } = navLabel(key)
        return (
          <ContactLink
            key={`contact-link-${key}`}
            href={href}
            title={title}
            description={description}
          />
        )
      })}
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
