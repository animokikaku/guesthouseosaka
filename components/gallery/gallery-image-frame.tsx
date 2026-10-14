import type { GalleryImageProps } from '@/lib/gallery-image'
import { SanityImage } from '@/components/sanity-image'
import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef } from 'react'

type GalleryImageFrameProps = ComponentPropsWithoutRef<'div'> & {
  sizes?: string
  imageProps: GalleryImageProps
}

export function GalleryImageFrame({
  sizes,
  imageProps,
  className,
  children,
  ...divProps
}: GalleryImageFrameProps) {
  // `fill` sizes the image from its container, so the intrinsic dimensions are dropped.
  const { alt, height: _height, width: _width, ...restImageProps } = imageProps

  return (
    <div
      data-slot="gallery-image-frame"
      className={cn('group relative cursor-pointer overflow-hidden', className)}
      {...divProps}
    >
      <div
        data-slot="gallery-image-media"
        className="bg-muted/40 relative h-full w-full overflow-hidden"
      >
        <SanityImage
          fill
          alt={alt}
          className="object-cover transition-opacity duration-300 pointer-fine:group-hover:opacity-90"
          sizes={sizes}
          {...restImageProps}
        />
        {alt && (
          <div
            data-slot="gallery-image-caption"
            className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-end bg-linear-to-t from-black/70 to-transparent p-3 opacity-0 transition-[opacity,transform] duration-300 ease-out pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100"
            aria-hidden="true"
          >
            <span className="text-sm font-medium text-white">{alt}</span>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
