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
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { getImageDimensions } from '@sanity/asset-utils'
import { createDataAttribute } from 'next-sanity'
import Image from 'next/image'

const { projectId, dataset, stega } = client.config()

const dataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === 'string' ? stega.studioUrl : ''
}

const ACCENT_CLASSES: Record<HouseIdentifier, string> = {
  orange: 'bg-orange-600/50',
  apple: 'bg-red-600/50',
  lemon: 'bg-yellow-600/50'
}

type CollectionHouses = NonNullable<HomePageQueryResult>['houses']

export function Collection({
  houses,
  className,
  documentId,
  documentType
}: {
  houses: CollectionHouses
  className?: string
  documentId: NonNullable<HomePageQueryResult>['_id']
  documentType: NonNullable<HomePageQueryResult>['_type']
}) {
  if (!houses) return null

  return (
    <ItemGroup
      className={cn('grid gap-8 md:grid-cols-3 md:gap-8', className)}
      data-sanity={createDataAttribute({
        ...dataAttributeConfig,
        id: documentId,
        type: documentType,
        path: 'houses'
      }).toString()}
    >
      {houses.map((house) => (
        <Item
          key={house._key}
          variant="default"
          role="listitem"
          className="h-full flex-col items-start p-0"
          data-sanity={createDataAttribute({
            ...dataAttributeConfig,
            id: documentId,
            type: documentType,
            path: `houses[_key=="${house._key}"]`
          }).toString()}
        >
          <Link
            href={{
              pathname: '/[house]' as const,
              params: { house: house.slug }
            }}
            className="group block w-full"
          >
            <ItemHeader className="relative overflow-hidden rounded-sm">
              <CollectionImage image={house.image} />
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100',
                  ACCENT_CLASSES[house.slug]
                )}
              >
                <Image
                  {...assets[house.slug].icon}
                  alt={assets[house.slug].icon.alt}
                  loading="eager"
                  className="h-12 w-12 object-contain opacity-90 drop-shadow-lg"
                />
              </div>
            </ItemHeader>
          </Link>
          <ItemContent className="self-start">
            <ItemTitle className="text-lg">{house.title}</ItemTitle>
            <ItemDescription className="text-md text-start">
              {house.description}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}

function CollectionImage({
  image
}: {
  image: NonNullable<CollectionHouses>[number]['image']
}) {
  const buildImage = urlFor(image)
  const dimensions = getImageDimensions(image.asset!)
  const alt = image.alt || ''
  const blurDataURL = image.preview || undefined
  const placeholder = image.preview ? 'blur' : undefined
  const width = dimensions.width
  const height = dimensions.height

  return (
    <>
      <Image
        src={buildImage.url()}
        alt={alt}
        width={width}
        height={height}
        blurDataURL={blurDataURL}
        placeholder={placeholder}
        quality={90}
        className="block aspect-2/1 w-full object-cover md:hidden"
      />
      <Image
        src={buildImage.fit('crop').width(800).height(800).url()}
        alt={alt}
        width={800}
        height={800}
        blurDataURL={blurDataURL}
        placeholder={placeholder}
        className="hidden aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] md:block"
      />
    </>
  )
}
