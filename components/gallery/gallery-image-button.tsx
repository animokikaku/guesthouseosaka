'use client'

import { ImageHoverOverlay } from '@/components/image-hover-overlay'
import { cn } from '@/lib/utils'
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
    return (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden transition-opacity hover:opacity-90',
          className
        )}
        {...divProps}
      >
        <div
          className={cn(
            'bg-muted/40 relative h-full w-full cursor-pointer overflow-hidden',
            containerClassName
          )}
        >
          <Image
            fill
            alt={alt}
            className={cn('object-cover', imageClassName)}
            sizes={sizes}
            {...restImageProps}
          />
          {alt && <ImageHoverOverlay>{alt}</ImageHoverOverlay>}
        </div>
        {children}
      </div>
    )
  }
)

GalleryImageButton.displayName = 'GalleryImageButton'
