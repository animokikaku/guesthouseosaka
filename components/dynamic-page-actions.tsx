'use client'

import { PageActions } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import { Icon } from '@/lib/icons'
import { useSanityOptimisticArray } from '@/lib/sanity-optimistic'
import { FaqPageQueryResult } from '@/sanity.types'
import { createDataAttribute, stegaClean } from 'next-sanity'

type PageAction = NonNullable<NonNullable<FaqPageQueryResult>['actions']>[number]

/**
 * Where a CMS page action points. Editors enter either an absolute URL or an
 * internal path, optionally with a hash (`/faq#phone`, or just `#phone` for
 * the page the action sits on).
 */
type PageActionHref =
  | { external: true; href: string }
  | { external: false; pathname: string; hash?: string }

function resolvePageActionHref(href: string, currentPathname: string): PageActionHref {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { external: true, href }
  }

  const [pathname, hash] = href.split('#')
  return hash === undefined
    ? { external: false, pathname }
    : { external: false, pathname: pathname || currentPathname, hash: `#${hash}` }
}

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

        const target = resolvePageActionHref(href, currentPathname)

        if (target.external) {
          return (
            <a
              key={_key}
              href={target.href}
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
            href={
              target.hash
                ? { pathname: target.pathname as '/', hash: target.hash }
                : (target.pathname as '/')
            }
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
