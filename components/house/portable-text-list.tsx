import type { PortableTextComponents } from '@portabletext/react'

/** List items for the house page's rich text: a primary-colored dot for bullets. */
export const houseListItemComponents: PortableTextComponents['listItem'] = {
  bullet: ({ children }) => (
    <li className="flex items-start gap-3">
      <div className="bg-primary mt-2 size-2 shrink-0 rounded-full" />
      <span className="text-foreground">{children}</span>
    </li>
  ),
  number: ({ children }) => <li>{children}</li>
}
