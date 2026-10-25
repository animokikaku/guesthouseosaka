import { PageActions } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { localeToPrefix } from '@/i18n/routing'
import { Icon } from '@/lib/icons'
import { useSanityOptimisticArray } from '@/lib/sanity-optimistic'
import { FaqPageQueryResult } from '@/sanity.types'
import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute'
import { stegaClean } from '@sanity/client/stega'
import { useLocation, useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { useLocale } from 'use-intl'

type PageAction = NonNullable<NonNullable<FaqPageQueryResult>['actions']>[number]

/**
 * Where a CMS page action points. Editors enter either an absolute URL or an
 * unlocalized internal path, optionally with a hash (`/faq#phone`, or just
 * `#phone` for the page the action sits on).
 */
type PageActionHref = { external: boolean; href: string }

function resolvePageActionHref(
  href: string,
  currentPathname: string,
  localePrefix: string
): PageActionHref {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { external: true, href }
  }

  const [pathname, hash] = href.split('#')
  const localized = pathname
    ? `/${localePrefix}${pathname === '/' ? '' : pathname}`
    : currentPathname
  return { external: false, href: hash === undefined ? localized : `${localized}#${hash}` }
}

/** Whether a click should be left to the browser (new tab, download, …). */
function isModifiedClick(event: MouseEvent) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

interface DynamicPageActionsProps {
  documentId: string
  documentType: string
  actions: PageAction[] | null
}

export function DynamicPageActions(props: DynamicPageActionsProps) {
  const currentPathname = useLocation({ select: (location) => location.pathname })
  const localePrefix = localeToPrefix(useLocale())
  const navigate = useNavigate()

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

        const target = resolvePageActionHref(href, currentPathname, localePrefix)

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

        // CMS paths are only known at runtime, so they can't be typed `Link`
        // targets; navigate client-side by `href` instead.
        return (
          <a
            key={_key}
            href={target.href}
            onClick={(event) => {
              if (event.defaultPrevented || isModifiedClick(event)) return
              event.preventDefault()
              void navigate({ href: target.href })
            }}
            className={buttonVariants({ variant, size: 'sm' })}
            data-sanity={dataAttribute(`actions[_key=="${_key}"]`)}
          >
            <Icon name={icon} aria-hidden="true" />
            {stegaClean(label)}
          </a>
        )
      })}
    </PageActions>
  )
}
