'use client'

/**
 * Default lightbox — app-specific skin over ramka's primitives.
 *
 * Re-exports ramka Lightbox primitives with this skin attached, plus composed
 * `Lightbox.Gallery` (bleed or snug slides, glass controls, desktop thumbnail
 * strip). Slides advance by swipe, arrow keys and the thumbnail strip — there
 * is no on-screen prev/next chrome.
 *
 * Boundary: only the styled primitives + Gallery. Trigger layouts, album
 * grids and other app UI belong in the consuming app, not this module. The
 * chrome's own text (close/zoom/thumbnails labels) is translated here via the
 * `Lightbox` message namespace, since this file is app-specific rather than a
 * portable copy-paste package.
 */

import Image from 'next/image'
import { Lightbox as RamkaLightbox } from 'ramka'
import { useTranslations } from 'next-intl'
import * as React from 'react'

import './lightbox.css'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

/* ── Icons (inline — no lucide dependency for copy-paste) ───────────────── */

/** Matches the app's `ArrowLeftIcon` so the viewer's exit reads as the page's back button. */
function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M19 12H5m7 7-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconZoomIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3M11 8v6M8 11h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconZoomOut() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3M8 11h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Item shape for `Lightbox.Gallery` — pass real intrinsic pixel size. */
export type LightboxItem = {
  id?: string | number
  src: string
  thumb: string
  alt: string
  caption?: string
  width: number
  height: number
}

/** Inline styles that carry the `--lightbox-*` custom properties the skin reads. */
type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>

/** `snug` sizes each slide to its aspect ratio; `bleed` gives it the full width. */
export type SlidesLayout = 'bleed' | 'snug'

function itemAspectRatio(item: LightboxItem): number {
  return item.width / item.height
}

/* ── Styled primitives (design-system re-exports) ───────────────────────── */

function Root(props: React.ComponentProps<typeof RamkaLightbox.Root>) {
  return <RamkaLightbox.Root {...props} />
}

function Trigger({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Trigger>) {
  return <RamkaLightbox.Trigger className={cx('lb-trigger', className)} {...props} />
}

function Portal({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Portal>) {
  return <RamkaLightbox.Portal className={cx('lb-portal', className)} {...props} />
}

function Backdrop({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Backdrop>) {
  return <RamkaLightbox.Backdrop className={cx('lb-backdrop', className)} {...props} />
}

function Content({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Content>) {
  return <RamkaLightbox.Content className={cx('lb-content', className)} {...props} />
}

/**
 * Exit control — a back arrow at the top left, not a glass close button. It
 * mirrors the gallery page's own back button so leaving the viewer looks like
 * the same gesture as leaving the gallery.
 */
function Close({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.Close>) {
  return (
    <RamkaLightbox.Close className={cx('lb-back', className)} aria-label="Close" {...props}>
      {children ?? <IconArrowLeft />}
    </RamkaLightbox.Close>
  )
}

function Slides({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Slides>) {
  return <RamkaLightbox.Slides className={cx('lb-slides', className)} {...props} />
}

function Slide({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Slide>) {
  return <RamkaLightbox.Slide className={cx('lb-slide', className)} {...props} />
}

function Item(props: React.ComponentProps<typeof RamkaLightbox.Item>) {
  return <RamkaLightbox.Item {...props} />
}

function Media({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Media>) {
  return <RamkaLightbox.Media className={cx('lb-media', className)} {...props} />
}

function Zoom(props: React.ComponentProps<typeof RamkaLightbox.Zoom>) {
  return <RamkaLightbox.Zoom {...props} />
}

function ZoomIn({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.ZoomIn>) {
  return (
    <RamkaLightbox.ZoomIn
      className={cx('lb-control', 'lb-control-md', className)}
      aria-label="Zoom in"
      {...props}
    >
      {children ?? <IconZoomIn />}
    </RamkaLightbox.ZoomIn>
  )
}

function ZoomOut({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.ZoomOut>) {
  return (
    <RamkaLightbox.ZoomOut
      className={cx('lb-control', 'lb-control-md', className)}
      aria-label="Zoom out"
      {...props}
    >
      {children ?? <IconZoomOut />}
    </RamkaLightbox.ZoomOut>
  )
}

function Caption({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Caption>) {
  return <RamkaLightbox.Caption className={cx('lb-caption', className)} {...props} />
}

function ThumbnailStrip({
  className,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.ThumbnailStrip>) {
  return <RamkaLightbox.ThumbnailStrip className={cx('lb-thumbnail-strip', className)} {...props} />
}

function ThumbnailStripTrack(
  props: React.ComponentProps<typeof RamkaLightbox.ThumbnailStripTrack>
) {
  return <RamkaLightbox.ThumbnailStripTrack {...props} />
}

function Thumbnail(props: React.ComponentProps<typeof RamkaLightbox.Thumbnail>) {
  return <RamkaLightbox.Thumbnail {...props} />
}

function ItemGroup(props: React.ComponentProps<typeof RamkaLightbox.ItemGroup>) {
  return <RamkaLightbox.ItemGroup {...props} />
}

function ThumbnailGroup(props: React.ComponentProps<typeof RamkaLightbox.ThumbnailGroup>) {
  return <RamkaLightbox.ThumbnailGroup {...props} />
}

/* ── Composed Gallery (product chrome) ──────────────────────────────────── */

/** Strip tabs are square (`--lb-thumb-h`) and `object-fit: cover` — request 2× that. */
const THUMBNAIL_SIZE = 128

function GalleryThumbnailStrip({
  items,
  thumbnailsLabel
}: {
  items: LightboxItem[]
  thumbnailsLabel: string
}) {
  if (items.length <= 1) return null

  return (
    <ThumbnailStrip className="lb-thumbnail-strip-desktop">
      <ThumbnailStripTrack aria-label={thumbnailsLabel}>
        {items.map((item, i) => (
          <Thumbnail key={item.id ?? i} index={i}>
            <Image
              src={item.thumb}
              alt={item.alt}
              width={THUMBNAIL_SIZE}
              height={THUMBNAIL_SIZE}
              draggable={false}
            />
          </Thumbnail>
        ))}
      </ThumbnailStripTrack>
      <span className="lb-thumbnail-strip-indicator" aria-hidden />
    </ThumbnailStrip>
  )
}

/**
 * Default product chrome — Portal → Backdrop + Content → Slides/Zoom + back
 * arrow / glass controls / caption / desktop ThumbnailStrip.
 *
 * Two slide layouts, selected with `slidesLayout`: `bleed` (default) gives every
 * slide the full width and letterboxes it, `snug` sizes each slide to its own
 * aspect ratio with peeking neighbours. There is no on-screen toggle — the
 * consuming app picks the layout.
 */
function Gallery({
  items,
  ariaLabel,
  slidesLayout = 'bleed'
}: {
  items: LightboxItem[]
  ariaLabel: string
  slidesLayout?: SlidesLayout
}) {
  const t = useTranslations('Lightbox')
  const snug = slidesLayout === 'snug'

  const snugEdgeRatios =
    snug && items.length > 0
      ? {
          start: itemAspectRatio(items[0]),
          end: itemAspectRatio(items[items.length - 1])
        }
      : null

  const slidesStyle: CSSVarStyle | undefined = snugEdgeRatios
    ? {
        '--lightbox-snug-ratio-start': snugEdgeRatios.start,
        '--lightbox-snug-ratio-end': snugEdgeRatios.end
      }
    : undefined

  return (
    <Portal>
      <Backdrop />
      <Content
        aria-label={ariaLabel}
        className={snug ? 'lb-content-snug' : undefined}
        // Consumer-provided handlers on `Content` run before ramka's own Escape
        // handling (see ramka's `mergeProps`), so stopping propagation here
        // still lets ramka close the lightbox — it only keeps the keydown from
        // reaching Base UI's document-level dismiss listener and closing an
        // outer dialog (e.g. the route-intercept gallery modal) in the same
        // keypress.
        onKeyDown={(event) => {
          if (event.key === 'Escape') event.stopPropagation()
        }}
      >
        <Slides
          key={slidesLayout}
          aria-label={t('full_size_images')}
          preload={2}
          className={snug ? 'lb-slides-snug' : undefined}
          style={slidesStyle}
        >
          {items.map((item, i) => {
            const slideStyle: CSSVarStyle | undefined = snug
              ? { '--lightbox-snug-ratio': itemAspectRatio(item) }
              : undefined
            return (
              <Slide
                key={item.id ?? i}
                className={snug ? 'lb-slide-snug' : undefined}
                style={slideStyle}
              >
                <Item index={i} caption={item.caption ?? item.alt}>
                  <Zoom maxZoom={6}>
                    <Media width={item.width} height={item.height}>
                      <Image
                        width={item.width}
                        height={item.height}
                        src={item.src}
                        alt={item.alt}
                        sizes="100vw"
                        // Only the initially-active slide preloads (the one
                        // relevant to LCP on open); later slides stay lazy
                        // even though `Slides` keeps a couple mounted for swipe.
                        preload={i === 0}
                        draggable={false}
                      />
                    </Media>
                  </Zoom>
                </Item>
              </Slide>
            )
          })}
        </Slides>

        <div className={cx('lb-top-left', 'lb-chrome-pull-hide')}>
          <Close aria-label={t('close')} />
        </div>

        <div className={cx('lb-top-right', 'lb-chrome-pull-hide')}>
          <ZoomOut aria-label={t('zoom_out')} />
          <ZoomIn aria-label={t('zoom_in')} />
        </div>

        <div
          className={cx('lb-bottom', 'lb-chrome-pull-hide', items.length <= 1 && 'lb-bottom-solo')}
        >
          <Caption />
          <GalleryThumbnailStrip items={items} thumbnailsLabel={t('thumbnails')} />
        </div>
      </Content>
    </Portal>
  )
}

/**
 * Styled Lightbox namespace — drop-in replacement for `import { Lightbox } from 'ramka'`
 * with this preset’s styles and composed Gallery.
 */
export const Lightbox = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Content,
  Close,
  Slides,
  Slide,
  Item,
  ItemGroup,
  Media,
  Zoom,
  ZoomIn,
  ZoomOut,
  Caption,
  ThumbnailStrip,
  ThumbnailStripTrack,
  Thumbnail,
  ThumbnailGroup,
  Gallery
}
