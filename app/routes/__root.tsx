import { GlobalError, GlobalNotFound } from '@/components/global-fallbacks'
import { routing } from '@/i18n/routing'
import { getHouseTheme } from '@/lib/house-theme'
import { cn } from '@/lib/utils'
import { createRootRoute, HeadContent, Scripts, useParams } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: GlobalNotFound,
  errorComponent: GlobalError
})

function RootDocument({ children }: { children: ReactNode }) {
  const { locale = routing.defaultLocale, house } = useParams({ strict: false })

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className={cn(
          'text-foreground group/body font-sans antialiased [--footer-height:--spacing(14)] [--header-height:--spacing(14)] xl:[--footer-height:--spacing(24)]',
          // Rendered with the page rather than applied by a script, so the
          // house's colors are there on first paint and follow navigations.
          `theme-${getHouseTheme(house)}`
        )}
      >
        {children}
        <Scripts />
      </body>
    </html>
  )
}
