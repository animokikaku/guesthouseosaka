'use client'

import { PageActions } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import { Icon } from '@/lib/icons'
import { FaqPageQueryResult } from '@/sanity.types'

type PageAction = NonNullable<
  NonNullable<FaqPageQueryResult>['actions']
>[number]

interface DynamicPageActionsProps {
  actions: PageAction[] | null
}

export function DynamicPageActions({ actions }: DynamicPageActionsProps) {
  const currentPathname = usePathname()

  if (!actions || actions.length === 0) return null

  return (
    <PageActions>
      {actions.map(({ _key, icon, href, label }, index) => {
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
            <Button key={_key} asChild variant={variant} size="sm">
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon name={icon} />
                {label}
              </a>
            </Button>
          )
        }

        return (
          <Button key={_key} asChild variant={variant} size="sm">
            <Link
              href={
                hasHash
                  ? { pathname: pathname as '/', hash: `#${hash}` }
                  : (href as '/')
              }
            >
              <Icon name={icon} />
              {label}
            </Link>
          </Button>
        )
      })}
    </PageActions>
  )
}
