import { Badge } from '@/components/ui/badge'
import type { GalleryCategory } from '@/lib/gallery'
import { urlFor } from '@/sanity/lib/image'
import { stegaClean } from '@sanity/client/stega'
import Image from 'next/image'

type CategoryThumbnailProps = {
  category: GalleryCategory
}

export function CategoryThumbnail({ category }: CategoryThumbnailProps) {
  const thumbnail = category.thumbnail
  const firstItemKey = category.items[0]?._key
  if (!thumbnail || !firstItemKey) return null

  const src = urlFor(thumbnail).width(256).height(192).dpr(2).fit('crop').url()

  return (
    <button
      onClick={() => {
        const targetElement = document.getElementById(category._id)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      className="group focus-visible:ring-ring flex h-auto w-[154px] shrink-0 cursor-pointer flex-col gap-2 rounded-lg p-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative aspect-4/3 w-32 overflow-hidden rounded-md">
        <Image
          src={src}
          alt={stegaClean(thumbnail.alt) ?? ''}
          fill
          placeholder={thumbnail.preview ? 'blur' : undefined}
          blurDataURL={thumbnail.preview ?? undefined}
          className="object-cover"
          sizes="128px"
        />
        <div className="absolute right-0 bottom-0">
          <Badge
            variant="secondary"
            className="min-w-7 rounded-none rounded-tl-md rounded-br-md text-xs"
          >
            {category.count}
          </Badge>
        </div>
      </div>
      <span className="text-muted-foreground group-hover:text-foreground line-clamp-2 text-xs font-medium transition-colors">
        {category.label}
      </span>
    </button>
  )
}
