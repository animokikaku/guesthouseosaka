import { formats, timeZone } from '@/i18n/formats'
import messages from '@/messages/en.json'
import type * as NextIntl from 'next-intl'

type IntlFactories = Pick<typeof NextIntl, 'createTranslator' | 'createFormatter'>

/**
 * `useTranslations`, `getTranslations` and `useFormatter` bound to the English
 * catalog. Takes the real `next-intl` exports as an argument because it is
 * called from inside the `next-intl` mock, where importing the module would
 * resolve to the mock itself.
 */
export function bindTestIntl({ createTranslator, createFormatter }: IntlFactories) {
  // Cached per namespace: the real hook returns a stable function, and
  // components memoize on it.
  const translators = new Map<string, ReturnType<typeof createTranslator>>()
  const formatter = createFormatter({ locale: 'en', formats, timeZone })

  function getTranslator(namespace?: string) {
    const key = namespace ?? ''
    let t = translators.get(key)
    if (!t) {
      // The namespace is a runtime string here, so the typed overloads can't follow it.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      t = createTranslator({ locale: 'en', messages, namespace: key as never, formats, timeZone })
      translators.set(key, t)
    }
    return t
  }

  return { getTranslator, getFormatter: () => formatter }
}
