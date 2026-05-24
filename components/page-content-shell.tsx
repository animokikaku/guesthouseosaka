import type { ReactNode } from 'react'

export function PageContentShell({ children }: { children: ReactNode }) {
  return (
    <div className="container-wrapper section-soft flex-1 md:pb-12">
      <div className="container">
        <div className="mx-auto w-full max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
