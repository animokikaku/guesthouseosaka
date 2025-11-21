import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle
} from '@/components/ui/item'
import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { Routes } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useExtracted } from 'next-intl'
import { default as Image, ImageProps } from 'next/image'

interface HouseItem {
  name: string
  description: string
  image: ImageProps
  accentClass: string
  icon: ImageProps
  href: Routes
}

export function Collection({ className }: { className?: string }) {
  const t = useExtracted()

  const items: HouseItem[] = [
    {
      name: t('Orange House'),
      description: t('Relaxed spacious Japanese-style lounge'),
      accentClass: 'bg-orange-600/50',
      href: '/orange',
      icon: assets.orange.icon,
      image: assets.orange.background
    },
    {
      name: t('Apple House'),
      description: t('Share house 8 minutes walk from Namba Station'),
      accentClass: 'bg-red-600/50',
      href: '/apple',
      icon: assets.apple.icon,
      image: assets.apple.background
    },
    {
      name: t('Lemon House'),
      description: t('Well-equipped private rooms and a luxurious lounge'),
      accentClass: 'bg-yellow-600/50',
      href: '/lemon',
      icon: assets.lemon.icon,
      image: assets.lemon.background
    }
  ]

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
