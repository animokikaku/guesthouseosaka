import { SanityImage } from '@/components/sanity-image'
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
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/utils/theme'
import type { HomePageQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import { stegaClean } from '@sanity/client/stega'
import Image from 'next/image'

type House = NonNullable<HomePageQueryResult['houses']>[number]

type CollectionProps = {
  houses: House[]
  className?: string
}

export function Collection({ houses, className }: CollectionProps) {
  return (
    <ItemGroup className={cn('grid gap-8 md:grid-cols-3', className)}>
      {houses.map((house) => (
        <Item
          key={house._id}
          variant="default"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="listitem"
          className="h-full flex-col items-start p-0"
        >
          <Link
            aria-label={house.title ? stegaClean(house.title) : house.slug}
            href={{
              pathname: '/[house]' as const,
              params: { house: house.slug }
            }}
            className="group ring-offset-background focus-visible:ring-ring/50 block w-full rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <ItemHeader className="relative overflow-hidden rounded-sm">
              <CollectionImage image={house.image} />
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-fine:group-hover:opacity-100 group-focus-visible:opacity-100',
                  HOUSE_COLORS[house.slug].accent
                )}
              >
                {/* Lazy, not eager: the overlay is opacity-0 until hover, and
                    the collection sits a full viewport below the hero — so
                    eager loading cost three requests during the initial load
                    for art nobody had asked to see. next/image starts these as
                    the section scrolls into view, well ahead of any hover. */}
                <Image
                  {...assets[house.slug].icon}
                  alt={assets[house.slug].icon.alt}
                  className="size-12 object-contain opacity-90 drop-shadow-lg"
                />
              </div>
            </ItemHeader>
          </Link>
          <ItemContent className="self-start">
            <ItemTitle className="text-lg">{house.title}</ItemTitle>
            <ItemDescription className="text-start">{house.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}

type CollectionImageProps = {
  image: House['image']
}

function CollectionImage({ image }: CollectionImageProps) {
  if (!image.asset) return null

  const alt = image.alt || ''
  const blurDataURL = image.preview || undefined
  const placeholder = image.preview ? 'blur' : undefined

  // Card widths in the home page's collection grid: the nested
  // container-wrapper/container padding (32px a side, 48px from lg) and the
  // md:grid-cols-3 gap-8 columns, capped by max-w-7xl. Keep in sync with
  // app/[locale]/page.tsx and PageHeader.
  return (
    <>
      <SanityImage
        src={urlFor(image).fit('crop').width(800).height(400).url()}
        alt={alt}
        width={800}
        height={400}
        blurDataURL={blurDataURL}
        placeholder={placeholder}
        sizes="calc(100vw - 64px)"
        className="block aspect-2/1 w-full object-cover md:hidden"
      />
      <SanityImage
        src={urlFor(image).fit('crop').width(800).height(800).url()}
        alt={alt}
        width={800}
        height={800}
        blurDataURL={blurDataURL}
        placeholder={placeholder}
        sizes="(min-width: 1280px) 373px, (min-width: 1024px) calc(33.33vw - 53px), calc(33.33vw - 43px)"
        className="hidden aspect-square w-full object-cover transition-transform duration-300 group-focus-visible:scale-[1.02] md:block pointer-fine:group-hover:scale-[1.02]"
      />
    </>
  )
}
