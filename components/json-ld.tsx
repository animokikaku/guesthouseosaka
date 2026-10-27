import type { Thing, WithContext } from 'schema-dts'

/** Structured data as a `head()` script, with `<` escaped so CMS strings can't close the script tag. */
export function jsonLdScript(data: WithContext<Thing>) {
  return { type: 'application/ld+json', children: JSON.stringify(data).replace(/</g, '\\u003c') }
}
