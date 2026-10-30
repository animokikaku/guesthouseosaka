// @vitest-environment node

import { parse, TYPE, type MessageFormatElement } from '@formatjs/icu-messageformat-parser'
import { readFileSync } from 'node:fs'
import { routing } from '../routing'

type Catalog = { [key: string]: string | Catalog }

function load(locale: string): Catalog {
  return JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'))
}

/** Every message keyed by its dotted path, as `t('a.b')` would look it up. */
function flatten(catalog: Catalog, prefix = ''): Map<string, string> {
  return new Map(
    Object.entries(catalog).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key
      return typeof value === 'string' ? [[path, value] as const] : [...flatten(value, path)]
    })
  )
}

/** The arguments and rich-text tags a message expects from the code, e.g. `{count}`, `<link>`. */
function placeholders(elements: MessageFormatElement[], found = new Set<string>()) {
  for (const element of elements) {
    if (element.type === TYPE.tag) {
      found.add(`<${element.value}>`)
      placeholders(element.children, found)
    } else if ('value' in element && element.type !== TYPE.literal) {
      found.add(`{${element.value}}`)
    }
    if (element.type === TYPE.plural || element.type === TYPE.select) {
      for (const option of Object.values(element.options)) placeholders(option.value, found)
    }
  }
  return [...found].toSorted()
}

const source = flatten(load(routing.defaultLocale))
const translations = routing.locales.filter((locale) => locale !== routing.defaultLocale)

// Translations are written apart from the code (by hand or `eloqnt translate`),
// so these guard what the code relies on: that every key exists and every
// message fills in the same values.
describe.each(translations)('%s messages', (locale) => {
  const messages = flatten(load(locale))

  it('have exactly the keys of the English catalog', () => {
    expect([...messages.keys()].toSorted()).toEqual([...source.keys()].toSorted())
  })

  it('fill in the same placeholders as English', () => {
    const mismatches = Object.fromEntries(
      [...source].flatMap(([key, english]) => {
        const expected = placeholders(parse(english))
        const actual = placeholders(parse(messages.get(key) ?? ''))
        return actual.join() === expected.join() ? [] : [[key, { expected, actual }]]
      })
    )

    expect(mismatches).toEqual({})
  })
})
