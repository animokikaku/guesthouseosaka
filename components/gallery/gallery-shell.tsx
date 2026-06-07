import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type GalleryShellProps = {
  children: ReactNode
  className?: string
}

export function GalleryShell({ children, className }: GalleryShellProps) {
  return (
    <div
      className={cn(
        'bg-background text-foreground flex h-full w-full flex-col overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}
