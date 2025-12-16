import { ReactNode } from 'react'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
