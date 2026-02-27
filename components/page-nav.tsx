import { cn } from '@/lib/utils'

interface PageNavProps extends React.ComponentProps<'div'> {
  contentClassName?: string
}

export function PageNav({ children, className, contentClassName, ...props }: PageNavProps) {
  return (
    <div className={cn('scroll-mt-24', className)} {...props}>
      <div className={cn('flex items-center justify-between gap-4 py-4', contentClassName)}>
        {children}
      </div>
    </div>
  )
}
