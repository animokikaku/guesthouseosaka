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
import { type HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import { HomePageQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import { getImageDimensions } from '@sanity/asset-utils'
import Image, { getImageProps } from 'next/image'

const ACCENT_CLASSES: Record<HouseIdentifier, string> = {
  orange: 'bg-orange-600/50',
  apple: 'bg-red-600/50',
  lemon: 'bg-yellow-600/50'
}

type CollectionHouses = NonNullable<HomePageQueryResult>['houses']

export function Collection({
  houses,
  className
}: {
  houses: CollectionHouses
  className?: string
}) {
  if (!houses) return null

  const items = houses.map((house) => {
    const { icon, background } = assets[house.slug]
    const alt = house.image.alt || house.title || house.slug
    const { width, height } = getImageDimensions(house.image.asset!)
    const imageBase = urlFor(house.image).auto('format')
    const commonImageProps = {
      alt,
      sizes: '(max-width: 768px) 100vw, 33vw',
      className:
        'block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]'
    }
    const {
      props: { srcSet: desktopSrcSet }
    } = getImageProps({
      ...commonImageProps,
      width: height,
      height: height,
      src: imageBase.width(height).height(height).fit('crop').url()
    })
    const {
      props: { srcSet: mobileSrcSet, ...mobileImageProps }
    } = getImageProps({
      ...commonImageProps,
      width: width,
      height: height,
      src: imageBase.width(width).url()
    })
    const blurStyle = house.image.preview
      ? {
          backgroundImage: `url(${house.image.preview})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      : undefined
    return {
      key: house._id,
      name: house.title,
      description: house.description,
      image: {
        desktopSrcSet,
        mobileSrcSet,
        mobileImageProps: {
          ...mobileImageProps,
          style: {
            width: '100%',
            height: 'auto',
            ...mobileImageProps.style,
            ...blurStyle
          }
        }
      },
      href: { pathname: '/[house]' as const, params: { house: house.slug } },
      accentClass: ACCENT_CLASSES[house.slug],
      icon,
      background
    }
  })

  return (
    <ItemGroup className={cn('grid gap-8 md:grid-cols-3 md:gap-8', className)}>
      {items.map(
        ({ key, name, description, image, accentClass, href, icon }) => (
          <Item
            key={key}
            variant="default"
            role="listitem"
            className="h-full flex-col items-start p-0"
          >
            <Link href={href} className="group block w-full">
              <ItemHeader className="relative overflow-hidden rounded-sm">
                <div className="relative aspect-2/1 w-full md:aspect-square">
                  <picture className="absolute inset-0">
                  <source
                    media="(min-width: 768px)"
                    srcSet={image.desktopSrcSet}
                  />
                  <source
                    media="(max-width: 767px)"
                    srcSet={image.mobileSrcSet}
                  />
                  <img
                    {...image.mobileImageProps}
                    alt={image.mobileImageProps.alt}
                  />
                </picture>
                </div>
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
        )
      )}
    </ItemGroup>
  )
}
