import { GalleryImageButton } from '@/components/gallery/gallery-image-button'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { getImages } from '@/lib/images/server'
import { HouseIdentifier } from '@/lib/types'
import { getTranslations } from 'next-intl/server'

export async function ImageBlockGallery({ id }: { id: HouseIdentifier }) {
  const t = await getTranslations('ImageBlockGallery')
  const { images: getHouseImages } = await getImages(id)

  const images = getHouseImages({ category: 'room', limit: 5 })

  if (id === 'orange') {
    const [mainImage] = getHouseImages({ category: 'common-spaces', limit: 1 })
    images.unshift(mainImage)
  }

  const galleryHref = {
    pathname: '/[house]/gallery',
    params: { house: id }
  } as const

  return (
    <div className="hidden justify-center sm:flex">
      <div className="w-full">
        <div className="relative aspect-2/1 min-h-[300px] overflow-hidden rounded-xl lg:aspect-7/3">
          <Link href={galleryHref} className="block h-full w-full">
            <div className="grid h-full w-full grid-cols-4 grid-rows-2 gap-0.5">
              <GalleryImageButton
                className="col-span-2 row-span-2"
                sizes="(min-width: 1120px) 560px, 50vw"
                imageProps={{ ...images[0], preload: true }}
              />
              <GalleryImageButton
                className="col-span-1 col-start-3 row-start-1"
                imageProps={images[1]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageButton
                className="col-span-1 col-start-4 row-start-1"
                imageProps={images[2]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageButton
                className="col-span-1 col-start-3 row-start-2"
                imageProps={images[3]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageButton
                className="col-span-1 col-start-4 row-start-2"
                imageProps={images[4]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
            </div>
          </Link>
          <Button
            variant="secondary"
            asChild
            className="absolute right-4 bottom-4"
          >
            <Link href={galleryHref}>
              <Icons.gallery className="h-4 w-4" />
              <span>{t('view_gallery')}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
