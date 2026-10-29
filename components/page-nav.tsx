import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export function PageNav({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('scroll-mt-24', className)} {...props}>
      <div className="flex items-center justify-between gap-4 py-4">{children}</div>
    </div>
  )
}

/** A horizontally scrolling row of tab links inside a {@link PageNav}. */
export function PageNavTabs({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-150 lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props} />
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

/** Base style for a {@link PageNavTabs} link; callers add the `data-active` color. */
export const pageNavTabClass =
  'text-muted-foreground hover:text-primary flex h-7 shrink-0 items-center justify-center rounded-md px-4 text-center text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset'
