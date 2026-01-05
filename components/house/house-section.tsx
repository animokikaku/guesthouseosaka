import { cn } from '@/lib/utils'

function HouseSection({
  className,
  ...props
}: React.ComponentProps<'section'>) {
  return <section className={cn(className)} {...props} />
}

function HouseSectionHeading({
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2 className={cn('mb-6 text-2xl font-semibold', className)} {...props} />
  )
}

function HouseSectionContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('space-y-6', className)} {...props} />
}

export { HouseSection, HouseSectionContent, HouseSectionHeading }
