import { cn } from '@/lib/utils'
import { HomePageQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'

const BASE_WIDTH = 750
const BASE_HEIGHT = 452

type GalleryWallImages = NonNullable<HomePageQueryResult>['galleryWall']

export function GalleryWall({
  images,
  className
}: {
  images: GalleryWallImages
  className?: string
}) {
  const posts = images.map((img, index) => {
    const layouts = [
      { width: 142, height: 142, x: 56, y: 130 },
      { width: 272, height: 272, x: 212, y: 0 },
      { width: 123, height: 123, x: 496, y: 52 },
      { width: 168, height: 168, x: 173, y: 284 },
      { width: 129, height: 129, x: 354, y: 284 },
      { width: 194, height: 194, x: 496, y: 187 }
    ]
    const overlays = [
      'from-amber-200/80 to-amber-400/40',
      'from-slate-500/70 to-slate-800/60',
      'from-stone-400/70 to-stone-700/60',
      'from-emerald-400/70 to-emerald-700/50',
      'from-indigo-500/70 to-indigo-800/60',
      'from-rose-400/70 to-rose-700/50'
    ]
    const layout = layouts[index]

    return {
      id: img._key,
      src: urlFor(img.image)
        .width(layout.width * 2) // 2x for retina
        .height(layout.height * 2)
        .fit('crop') // Use hotspot/crop data
        .url(),
      blurDataURL: img.lqip,
      alt: img.alt,
      overlay: overlays[index],
      desktop: layout
    }
  })

  return (
    <div className={cn('w-full', className)}>
      <div className="relative ml-auto aspect-750/452 w-full">
        {posts.map(({ id, src, alt, blurDataURL, overlay, desktop }) => {
          const widthPercent = (desktop.width / BASE_WIDTH) * 100
          const heightPercent = (desktop.height / BASE_HEIGHT) * 100
          const leftPercent = (desktop.x / BASE_WIDTH) * 100
          const topPercent = (desktop.y / BASE_HEIGHT) * 100

          return (
            <div
              key={id}
              role="presentation"
              aria-hidden
              className="group bg-muted absolute overflow-hidden rounded-[18%] shadow-sm transition-shadow hover:shadow-xl"
              style={{
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                left: `${leftPercent}%`,
                top: `${topPercent}%`
              }}
            >
              <Image
                src={src}
                alt={alt || ''}
                width={desktop.width}
                height={desktop.height}
                blurDataURL={blurDataURL || undefined}
                placeholder={blurDataURL ? 'blur' : undefined}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {overlay ? (
                <div
                  className={`pointer-events-none absolute inset-0 bg-linear-to-br ${overlay} opacity-40`}
                />
              ) : null}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
