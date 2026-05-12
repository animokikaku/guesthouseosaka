import { HouseIdentifier } from '@/lib/types'
import { fruit } from '@lucide/lab'
import { Apple, Citrus, Icon } from 'lucide-react'

interface HouseIconProps extends Omit<
  React.ComponentProps<typeof Icon>,
  'iconNode' | 'aria-hidden'
> {
  name: HouseIdentifier
}

export function HouseIcon({ name, ...props }: HouseIconProps) {
  switch (name) {
    case 'apple':
      return <Apple aria-hidden="true" {...props} />
    case 'lemon':
      return <Citrus aria-hidden="true" {...props} />
    case 'orange':
      return <Icon iconNode={fruit} aria-hidden="true" {...props} />
  }
}
