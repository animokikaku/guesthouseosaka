'use client'

import { PageActions } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useOptimistic } from '@/hooks/use-optimistic'
import { Link, usePathname } from '@/i18n/navigation'
import { Icon } from '@/lib/icons'
import { ContactPageQueryResult, FaqPageQueryResult } from '@/sanity.types'
import { stegaClean } from '@sanity/client/stega'

interface DynamicPageActionsProps {
  page:
    | Pick<NonNullable<FaqPageQueryResult>, 'actions' | '_id' | '_type'>
    | Pick<NonNullable<ContactPageQueryResult>, 'actions' | '_id' | '_type'>
}

export function DynamicPageActions({ page }: DynamicPageActionsProps) {
  const [actions, attr] = useOptimistic(page, 'actions')
  const currentPathname = usePathname()

  if (!actions || actions.length === 0) return null

  return (
    <PageActions data-sanity={attr.list()}>
      {actions.map((action, index) => {
        const key = stegaClean(action._key)
        const iconName = stegaClean(action.icon)
        const href = stegaClean(action.href)
        const label = stegaClean(action.label)
        // First action is 'default' variant, others are 'ghost'
        const variant = index === 0 ? 'default' : 'ghost'

        // Check if href is external or internal
        const isExternal =
          href.startsWith('http://') || href.startsWith('https://')

        // Parse href for internal links with hash
        const hasHash = href.includes('#')
        const [rawPathname, hash] = href.split('#')
        // Handle hash-only links (e.g., "#section") by using current pathname
        const pathname = rawPathname || currentPathname

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
                <Icon name={iconName} />
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
                  ? { pathname: pathname as '/', hash: `#${hash}` }
                  : (href as '/')
              }
            >
              <Icon name={iconName} />
              {label}
            </Link>
          </Button>
        )
      })}
    </PageActions>
  )
}
