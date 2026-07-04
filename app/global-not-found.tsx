'use client'

import Error from 'next/error'

// This page renders when a route like `/unknown.txt` is requested.

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  )
}
