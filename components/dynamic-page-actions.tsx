'use client'

import { Button } from '@/components/ui/button'
import { useOptimistic } from '@/hooks/use-optimistic'
import { Link } from '@/i18n/navigation'
import { stegaClean } from '@sanity/client/stega'
import {
  BookTextIcon,
  CalendarIcon,
  ExternalLinkIcon,
  type LucideIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon
} from 'lucide-react'

// Map icon names from Sanity to Lucide components
const iconMap: Record<string, LucideIcon> = {
  mail: MailIcon,
  phone: PhoneIcon,
  'book-text': BookTextIcon,
  'external-link': ExternalLinkIcon,
  'map-pin': MapPinIcon,
  calendar: CalendarIcon
}

interface PageAction {
  _key: string
  icon: string | null
  label: string | null
  href: string | null
}

interface PageData {
  _id: string
  _type: string
  actions: PageAction[] | null
}

interface DynamicPageActionsProps {
  page: PageData
}

export function DynamicPageActions({ page }: DynamicPageActionsProps) {
  const [actions, attr] = useOptimistic(page, 'actions')

  if (!actions || actions.length === 0) return null

  return (
    <div className="flex items-center gap-2" data-sanity={attr.list()}>
      {actions.map((action, index) => {
        if (!action.href || !action.label) return null

        const key = stegaClean(action._key)
        const icon = action.icon ? stegaClean(action.icon) : null
        const href = stegaClean(action.href)
        const label = stegaClean(action.label)
        const Icon = icon ? iconMap[icon] : null
        // First action is 'default' variant, others are 'ghost'
        const variant = index === 0 ? 'default' : 'ghost'

        // Check if href is external or internal
        const isExternal =
          href.startsWith('http://') || href.startsWith('https://')

        // Parse href for internal links with hash
        const hasHash = href.includes('#')
        const [pathname, hash] = href.split('#')

        if (isExternal) {
          return (
            <Button
              key={key}
              asChild
              variant={variant}
              size="sm"
              data-sanity={attr.item(key)}
            >
              <a href={href} target="_blank" rel="noopener noreferrer">
                {Icon && <Icon />}
                {label}
              </a>
            </Button>
          )
        }

        return (
          <Button
            key={key}
            asChild
            variant={variant}
            size="sm"
            data-sanity={attr.item(key)}
          >
            <Link
              href={
                hasHash
                  ? { pathname: (pathname || '/') as '/', hash: `#${hash}` }
                  : (href as '/')
              }
            >
              {Icon && <Icon />}
              {label}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
