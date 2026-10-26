import { intlConfig } from '@/i18n/messages'
import { stegaClean } from '@sanity/client/stega'
import type { MakeRouteMatch, RegisteredRouter } from '@tanstack/react-router'
import { createTranslator, type Locale, type Messages } from 'use-intl'

type LocaleLayoutMatch = MakeRouteMatch<RegisteredRouter['routeTree'], '/$locale'>

/**
 * What a page's `head()` needs from the locale layout's loader: the site name
 * for the title template and social cards, and the catalog for fallback
 * titles. Return types are spelled out so route types don't infer in a cycle.
 */
export function getLocaleHeadData(matches: ReadonlyArray<{ routeId: string }>): {
  siteName: string | undefined
  messages: Messages | undefined
} {
  const layout = matches.find((match): match is LocaleLayoutMatch => match.routeId === '/$locale')
  return {
    siteName: stegaClean(layout?.loaderData?.settings?.siteName) ?? undefined,
    messages: layout?.loaderData?.messages
  }
}

/** A `Metadata` translator for `head()`, outside React. */
export function getMetadataTranslator(locale: Locale, messages: Messages) {
  return createTranslator({ locale, messages, namespace: 'Metadata', ...intlConfig })
}
