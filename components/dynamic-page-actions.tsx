'use client'

import { PageActions } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import { Icon } from '@/lib/icons'
import { useSanityOptimisticArray } from '@/lib/sanity-optimistic'
import { FaqPageQueryResult } from '@/sanity.types'
import { createDataAttribute, stegaClean } from 'next-sanity'

type PageAction = NonNullable<NonNullable<FaqPageQueryResult>['actions']>[number]

interface DynamicPageActionsProps {
  documentId: string
  documentType: string
  actions: PageAction[] | null
}

export function DynamicPageActions(props: DynamicPageActionsProps) {
  const currentPathname = usePathname()

  const actions = useSanityOptimisticArray<
    PageAction,
    PageAction[] | null,
    { actions?: PageAction[] }
  >(props.documentId, props.actions, (document) => document.actions ?? null)

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
        const isExternal = href.startsWith('http://') || href.startsWith('https://')

        // Parse href for internal links with hash
        const hasHash = href.includes('#')
        const [rawPathname, hash] = href.split('#')
        // Handle hash-only links (e.g., "#section") by using current pathname
        const pathname = rawPathname || currentPathname

        if (isExternal) {
          return (
            <a
              key={_key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-sanity={dataAttribute(`actions[_key=="${_key}"]`)}
              className={buttonVariants({ variant, size: 'sm' })}
            >
              <Icon name={icon} aria-hidden="true" />
              {stegaClean(label)}
            </a>
          )
        }

        // next-intl cannot infer typed routes from CMS-provided paths after runtime parsing.
        // oxlint-disable typescript/no-unsafe-type-assertion
        return (
          <Link
            key={_key}
            href={hasHash ? { pathname: pathname as '/', hash: `#${hash}` } : (href as '/')}
            className={buttonVariants({ variant, size: 'sm' })}
            data-sanity={dataAttribute(`actions[_key=="${_key}"]`)}
          >
            <Icon name={icon} aria-hidden="true" />
            {stegaClean(label)}
          </Link>
        )
        // oxlint-enable typescript/no-unsafe-type-assertion
      })}
    </PageActions>
  )
}
