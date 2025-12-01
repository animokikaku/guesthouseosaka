import { ChevronRightIcon } from 'lucide-react'
import { Locale } from 'next-intl'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle
} from '@/components/ui/item'
import { useContactNavigation } from '@/hooks/use-contact-navigation'
import { Link } from '@/i18n/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function ContactPage({
  params
}: PageProps<'/[locale]/contact'>) {
  const { locale } = use(params)

  setRequestLocale(locale as Locale)
  const nav = useContactNavigation()

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      {Object.entries(nav).map(([key, props]) => (
        <ContactLink key={`contact-link-${key}`} {...props} />
      ))}
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
