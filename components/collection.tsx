import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle
} from '@/components/ui/item'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { HouseIdentifier, HouseIdentifierSchema, Routes } from '@/lib/types'
import { cn } from '@/lib/utils'
import { default as Image, ImageProps } from 'next/image'

interface HouseItem {
  name: string
  description: string
  image: ImageProps
  accentClass: string
  icon: ImageProps
  href: Routes
}

const ACCENT_CLASSES: Record<HouseIdentifier, string> = {
  orange: 'bg-orange-600/50',
  apple: 'bg-red-600/50',
  lemon: 'bg-yellow-600/50'
}

export function Collection({ className }: { className?: string }) {
  const houses = useHouseLabels()

  const items = HouseIdentifierSchema.options.map<HouseItem>((house) => {
    const { name, summary } = houses[house]
    const { icon, background } = assets[house]
    return {
      name,
      description: summary,
      accentClass: ACCENT_CLASSES[house],
      href: `/${house}`,
      icon,
      image: background
    }
  })

  return (
    <ItemGroup className={cn('grid gap-8 md:grid-cols-3 md:gap-8', className)}>
      {items.map(({ name, description, image, accentClass, icon, href }) => (
        <Item
          key={name}
          variant="default"
          role="listitem"
          className="h-full flex-col items-start p-0"
        >
          <Link href={href} className="group block w-full">
            <ItemHeader className="relative overflow-hidden rounded-sm">
              <Image
                {...image}
                alt={image.alt}
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, 800px"
                quality={90}
                className="aspect-2/1 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] md:aspect-square md:h-auto"
              />
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100',
                  accentClass
                )}
              >
                <Image
                  {...icon}
                  alt={icon.alt}
                  loading="eager"
                  className="h-12 w-12 object-contain opacity-90 drop-shadow-lg"
                />
              </div>
            </ItemHeader>
          </Link>
          <ItemContent className="self-start">
            <ItemTitle className="text-lg">{name}</ItemTitle>
            <ItemDescription className="text-md text-start">
              {description}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
