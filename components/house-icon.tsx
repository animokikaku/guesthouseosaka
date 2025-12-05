import { HouseIdentifier } from '@/lib/types'
import { fruit } from '@lucide/lab'
import { Apple, Citrus, Icon } from 'lucide-react'

interface HouseIconProps extends Omit<
  React.ComponentProps<typeof Icon>,
  'iconNode' | 'aria-label'
> {
  name: HouseIdentifier
}

export function HouseIcon({ name, ...props }: HouseIconProps) {
  switch (name) {
    case 'apple':
      return <Apple aria-label="apple" {...props} />
    case 'lemon':
      return <Citrus aria-label="lemon" {...props} />
    case 'orange':
      return <Icon iconNode={fruit} aria-label="orange" {...props} />
  }
}
