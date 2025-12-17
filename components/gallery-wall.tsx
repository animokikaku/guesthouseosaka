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
  // const getLabel = useImageLabels()
  console.log(images)

  // const image = (img: (typeof homeImages)[number]) => ({
  //   ...img,
  //   src: url(img.src),
  //   alt: getLabel(img.id) || img.id.toString()
  // })

  const posts = [
    {
      id: images[0]._key,
      src: urlFor(images[0].image).url(),
      blurDataURL: images[0].lqip,
      alt: images[0].alt,
      overlay: 'from-amber-200/80 to-amber-400/40',
      desktop: { width: 142, height: 142, x: 56, y: 130 }
    },
    {
      id: images[1]._key,
      src: urlFor(images[1].image).url(),
      blurDataURL: images[1].lqip,
      alt: images[1].alt,
      overlay: 'from-slate-500/70 to-slate-800/60',
      desktop: { width: 272, height: 272, x: 212, y: 0 }
    },
    {
      id: images[2]._key,
      src: urlFor(images[2].image).url(),
      blurDataURL: images[2].lqip,
      alt: images[2].alt,
      overlay: 'from-stone-400/70 to-stone-700/60',
      desktop: { width: 123, height: 123, x: 496, y: 52 }
    },
    {
      id: images[3]._key,
      src: urlFor(images[3].image).url(),
      blurDataURL: images[3].lqip,
      alt: images[3].alt,
      overlay: 'from-emerald-400/70 to-emerald-700/50',
      desktop: { width: 168, height: 168, x: 173, y: 284 }
    },
    {
      src: urlFor(images[4].image).url(),
      id: images[4]._key,
      blurDataURL: urlFor(images[4].image).width(24).height(24).blur(10).url(),
      alt: images[4].alt,
      overlay: 'from-indigo-500/70 to-indigo-800/60',
      desktop: { width: 129, height: 129, x: 354, y: 284 }
    },
    {
      id: images[5]._key,
      src: urlFor(images[5].image).url(),
      blurDataURL: urlFor(images[5].image).width(24).height(24).blur(10).url(),
      alt: images[5].alt,
      overlay: 'from-rose-400/70 to-rose-700/50',
      desktop: { width: 194, height: 194, x: 496, y: 187 }
    }
  ]

  console.log(posts)

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
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16.66vw, 16.66vw"
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
