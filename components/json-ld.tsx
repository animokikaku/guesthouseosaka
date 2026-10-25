import type { Thing, WithContext } from 'schema-dts'

/** Structured data, with `<` escaped so CMS strings can't close the script tag. */
export function JsonLd({ data }: { data: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** {@link JsonLd} as a `head()` script. */
export function jsonLdScript(data: WithContext<Thing>) {
  return { type: 'application/ld+json', children: JSON.stringify(data).replace(/</g, '\\u003c') }
}
