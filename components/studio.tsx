import config from '@/sanity.config'
import { Studio } from 'sanity'

/** The embedded Studio, filling the viewport as next-sanity's `NextStudio` did. */
export default function EmbeddedStudio() {
  return (
    <div data-ui="StudioLayout" style={{ height: '100vh', maxHeight: '100dvh', overflow: 'auto' }}>
      <Studio config={config} unstable_globalStyles />
    </div>
  )
}
