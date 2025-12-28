'use client'

import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import Image, { ImageProps } from 'next/image'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

type GalleryImageButtonProps = ComponentPropsWithoutRef<'div'> & {
  imageClassName?: string
  containerClassName?: string
  sizes?: string
  imageProps: Omit<ImageProps, 'fill' | 'className'>
}

export const GalleryImageButton = forwardRef<
  HTMLDivElement,
  GalleryImageButtonProps
>(
  (
    {
      imageClassName,
      containerClassName,
      sizes,
      imageProps,
      className,
      children,
      ...divProps
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { alt, height, width, ...restImageProps } = imageProps
    const caption = stegaClean(alt)

    return (
      <div
        ref={ref}
        className={cn(
          'group relative cursor-pointer overflow-hidden',
          className
        )}
        {...divProps}
      >
        <div
          className={cn(
            'bg-muted/40 relative h-full w-full overflow-hidden',
            containerClassName
          )}
        >
          <Image
            fill
            alt={alt}
            className={cn(
              'object-cover transition-opacity duration-300 group-hover:opacity-90',
              imageClassName
            )}
            sizes={sizes}
            {...restImageProps}
          />
          {caption && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-end bg-linear-to-t from-black/70 to-transparent p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              aria-hidden
            >
              <span className="text-sm font-medium text-white">{caption}</span>
            </div>
          )}
        </div>
        {children}
      </div>
    )
  }
)

GalleryImageButton.displayName = 'GalleryImageButton'
