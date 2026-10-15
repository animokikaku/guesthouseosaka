import { createTranslator } from 'next-intl'
import { formats, timeZone } from '../../../i18n/formats'
import en from '../../../messages/en.json'
import ja from '../../../messages/ja.json'

/**
 * Copy as the app renders it, looked up by message key: tests stay tied to the
 * message a component shows (a renamed key is a type error, a wrong one fails)
 * without restating wording that copy edits are free to change. Shared by the
 * unit, component and E2E suites, so imports stay relative.
 */
export const message = createTranslator({ locale: 'en', messages: en, formats, timeZone })

/** {@link message} for the Japanese catalog, for locale-specific assertions. */
export const japaneseMessage = createTranslator({ locale: 'ja', messages: ja, formats, timeZone })
