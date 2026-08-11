// Required since @sanity/ui v4: static styles are extracted to a stylesheet at
// build time instead of being injected at runtime.
import '@sanity/ui/styles.css'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
