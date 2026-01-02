'use client'

import { PageActions } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import { Icon } from '@/lib/icons'
import { FaqPageQueryResult } from '@/sanity.types'
import { createDataAttribute, stegaClean } from 'next-sanity'
import { useOptimistic } from 'next-sanity/hooks'
import { SanityDocument } from 'sanity'

type PageAction = NonNullable<
  NonNullable<FaqPageQueryResult>['actions']
>[number]

interface DynamicPageActionsProps {
  documentId: string
  documentType: string
  actions: PageAction[] | null
}

export function DynamicPageActions(props: DynamicPageActionsProps) {
  const currentPathname = usePathname()

  const actions = useOptimistic<
    PageAction[] | null,
    SanityDocument & { actions?: PageAction[] }
  >(props.actions, (currentActions, action) => {
    if (action.id === props.documentId && action.document.actions) {
      // Optimistic document only has _ref values, not resolved references
      return action.document.actions.map(
        (link) => currentActions?.find((l) => l._key === link._key) ?? link
      )
    }
    return currentActions
  })

  if (!actions || actions.length === 0) return null

  const dataAttribute = createDataAttribute({
    id: props.documentId,
    type: props.documentType
  })

  return (
    <PageActions data-sanity={dataAttribute('actions')}>
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
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-sanity={dataAttribute(`actions[_key=="${_key}"]`)}
              >
                <Icon name={icon} aria-hidden="true" />
                {stegaClean(label)}
              </a>
            </Button>
          )
        }

        return (
          <Button
            key={_key}
            asChild
            variant={variant}
            size="sm"
            data-sanity={dataAttribute(`actions[_key=="${_key}"]`)}
          >
            <Link
              href={
                hasHash
                  ? { pathname: pathname as '/', hash: `#${hash}` }
                  : (href as '/')
              }
            >
              <Icon name={icon} />
              {stegaClean(label)}
            </Link>
          </Button>
        )
      })}
    </PageActions>
  )
}
