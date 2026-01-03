import type { PortableTextComponents } from '@portabletext/react'

/**
 * Bullet list item with a styled dot indicator.
 * Used for default and location styles.
 */
const bulletListItem = ({ children }: { children?: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
    <span className="text-foreground">{children}</span>
  </li>
)

/**
 * Default PortableText style for general content.
 * Used in house-about section.
 */
export const defaultPortableText: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-foreground text-base leading-relaxed">{children}</p>
    )
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="text-foreground mt-4 list-decimal space-y-2 pl-5">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: bulletListItem,
    number: ({ children }) => <li>{children}</li>
  }
}

/**
 * Compact PortableText style for secondary content.
 * Used in pricing tables with muted, smaller text.
 */
export const compactPortableText: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-muted-foreground whitespace-pre-line text-sm">
        {children}
      </p>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-muted-foreground list-disc space-y-1 pl-3 text-sm">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground list-decimal space-y-1 pl-3 text-sm">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  }
}

/**
 * Location PortableText style with heading support.
 * Used in location modal with h3 blocks.
 */
export const locationPortableText: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="text-foreground mb-4 text-lg font-semibold">{children}</h3>
    ),
    normal: ({ children }) => <p className="text-foreground">{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="text-foreground mb-6 list-decimal space-y-2 pl-5">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: bulletListItem,
    number: ({ children }) => <li>{children}</li>
  }
}
