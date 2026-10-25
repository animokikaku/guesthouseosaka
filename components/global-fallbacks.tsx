import type { ReactNode } from 'react'

/**
 * Pages for failures outside the locale layout, where there are no
 * translations or site styles, so they mirror Next's built-in pages with
 * inline styles.
 */
function GlobalMessage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem'
      }}
    >
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500 }}>{title}</h1>
      <p style={{ margin: 0, paddingLeft: '1.5rem', borderLeft: '1px solid currentColor' }}>
        {children}
      </p>
    </div>
  )
}

/** For a path that matches no locale, like `/unknown.txt`. */
export function GlobalNotFound() {
  return <GlobalMessage title="404">This page could not be found.</GlobalMessage>
}

/** For an error in the locale layout itself, before its translations load. */
export function GlobalError() {
  return <GlobalMessage title="500">Something went wrong. Please reload the page.</GlobalMessage>
}
