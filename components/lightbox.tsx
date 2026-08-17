'use client'

/**
 * Default lightbox, Tailwind variant — single-file design-system package
 * entry (no CSS file to copy). A plain-CSS variant with the identical
 * component API lives in `../css/lightbox.tsx`.
 *
 * Re-exports ramka Lightbox primitives with this skin attached, plus composed
 * `Lightbox.Gallery` (bleed or snug slides, glass controls, desktop thumbnail strip).
 *
 * Conventions:
 * - Requires Tailwind CSS v4 (`starting:`, `not-*`, bare `data-*` variants)
 *   plus the shadcn `cn` helper and `lucide-react`.
 * - Variables named `--lightbox-*` are written by the ramka runtime (gesture
 *   progress, motion timing) — this file only reads them. Variables named
 *   `--lb-*` are this skin's own tokens, declared via arbitrary properties.
 * - Gesture-driven state rides on data attributes ramka sets on Content
 *   (`data-open`, `data-pulling`, `data-pull-dismissing`, `data-zoomed`),
 *   consumed here through the named `group/lb` on Content. All
 *   view-transition CSS (morph group, snapshots, crossfade) is injected by
 *   the library; the skin ships none of it.
 *
 * Package boundary: only the styled primitives + Gallery. Trigger layouts,
 * album grids, user cards, and other app UI belong in the consuming app
 * (docs: `demo.tsx`) — not in this module.
 */

import * as React from 'react'
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GalleryHorizontalIcon,
  RectangleHorizontalIcon,
  ZoomInIcon,
  ZoomOutIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Lightbox as RamkaLightbox } from 'ramka'

import { sanityImageLoader } from '@/lib/sanity-image-loader'
import { cn } from '@/lib/utils'

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

export type SlidesLayout = 'bleed' | 'snug'

/** Inline styles that carry the `--lb-*`/`--lightbox-*` custom properties the skin reads/writes. */
type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>

/**
 * The snug/bleed choice is a user preference, so it survives across galleries
 * and visits. Guarded reads/writes: localStorage throws in some private modes,
 * and `window` doesn't exist during SSR (the portal renders nothing while
 * closed, so the pre-hydration value is never visible anyway).
 */
const SLIDES_LAYOUT_STORAGE_KEY = 'ramka-lightbox-slides-layout'

function readStoredSlidesLayout(): SlidesLayout | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(SLIDES_LAYOUT_STORAGE_KEY)
    return value === 'snug' || value === 'bleed' ? value : null
  } catch {
    return null
  }
}

function storeSlidesLayout(layout: SlidesLayout) {
  try {
    window.localStorage.setItem(SLIDES_LAYOUT_STORAGE_KEY, layout)
  } catch {
    // Storage unavailable — the toggle still works for this session.
  }
}

function itemAspectRatio(item: LightboxItem): number {
  return item.width / item.height
}

/* ── Shared class recipes ───────────────────────────────────────────────── */

/**
 * Glass control pill (iOS-style liquid glass). The focus ring rides on
 * box-shadow (the pill clips outlines poorly), so focus-visible restates the
 * resting shadows plus the ring. Hover/press tint is a background-image
 * overlay so one recipe serves both the standalone pills (which have a
 * background-color) and the transparent segments inside a control group.
 * Note `scale` in the transition list: Tailwind v4 scale utilities write the
 * `scale` property, not `transform`.
 */
const controlClass = cn(
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full',
  'border border-black/20 bg-white/55 text-neutral-900',
  'shadow-[0_0.5px_1px_rgb(0_0_0/0.12),0_1px_2px_rgb(0_0_0/0.08),inset_0_0.5px_0_rgb(255_255_255/0.65)]',
  'backdrop-blur-2xl backdrop-saturate-150',
  'transition-[background-color,box-shadow,transform,scale,opacity,color] duration-150 ease-out',
  'outline-none',
  'hover:bg-[linear-gradient(rgb(0_0_0/0.05),rgb(0_0_0/0.05))]',
  'active:scale-[0.96] active:bg-[linear-gradient(rgb(0_0_0/0.09),rgb(0_0_0/0.09))]',
  'focus-visible:shadow-[0_0_0_2px_rgb(0_0_0/0.25),0_0.5px_1px_rgb(0_0_0/0.12),0_1px_2px_rgb(0_0_0/0.08),inset_0_0.5px_0_rgb(255_255_255/0.65)]',
  'disabled:pointer-events-none disabled:opacity-30',
  '[&_svg]:block [&_svg]:size-4',
  'dark:border-white/25 dark:bg-neutral-900/45 dark:text-white',
  'dark:shadow-[0_0_0_0.5px_#000,0_0.5px_1px_rgb(0_0_0/0.45),0_1px_2px_rgb(0_0_0/0.35),inset_0_0.5px_0_rgb(255_255_255/0.14)]',
  'dark:hover:bg-[linear-gradient(rgb(255_255_255/0.08),rgb(255_255_255/0.08))]',
  'dark:active:bg-[linear-gradient(rgb(255_255_255/0.12),rgb(255_255_255/0.12))]',
  'dark:focus-visible:shadow-[0_0_0_2px_rgb(255_255_255/0.4),0_0_0_0.5px_#000,0_0.5px_1px_rgb(0_0_0/0.45),0_1px_2px_rgb(0_0_0/0.35),inset_0_0.5px_0_rgb(255_255_255/0.14)]'
)

/**
 * Ghost icon button — ArrowLeftIcon, `size-9`, `rounded-full`, no glass
 * chrome. Mirrors `GalleryModalCloseButton` (the gallery page's own back
 * button) so leaving the lightbox reads as the same gesture as leaving the
 * gallery, rather than a generic dialog dismiss.
 */
const backClass = cn(
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full',
  'bg-transparent text-inherit outline-none transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
  '[&_svg]:block [&_svg]:size-6'
)

/**
 * Joined capsule — one glass pill holding several segments (zoom −/+) with a
 * hairline divider, like iOS grouped controls. The pill owns the glass
 * chrome; segments (see `controlSegmentClass`) become flat, full-height hit
 * areas.
 */
const controlGroupClass = cn(
  'inline-flex items-stretch overflow-hidden rounded-full',
  'border border-black/20 bg-white/55',
  'shadow-[0_0.5px_1px_rgb(0_0_0/0.12),0_1px_2px_rgb(0_0_0/0.08),inset_0_0.5px_0_rgb(255_255_255/0.65)]',
  'backdrop-blur-2xl backdrop-saturate-150',
  'dark:border-white/25 dark:bg-neutral-900/45',
  'dark:shadow-[0_0_0_0.5px_#000,0_0.5px_1px_rgb(0_0_0/0.45),0_1px_2px_rgb(0_0_0/0.35),inset_0_0.5px_0_rgb(255_255_255/0.14)]'
)

/**
 * Segment inside `controlGroupClass`: sheds its own glass chrome (the pill
 * owns it), doesn't shrink on press (the pill is one rigid control), and uses
 * an inset focus ring (the pill clips outset rings). Each segment is as wide
 * as the pill is tall → a two-segment capsule is exactly 2:1.
 */
const controlSegmentClass = cn(
  'relative h-auto w-9 rounded-none border-0 bg-transparent shadow-none',
  'backdrop-blur-none backdrop-saturate-100',
  'active:scale-100',
  'focus-visible:shadow-[inset_0_0_0_2px_rgb(0_0_0/0.25)]',
  'dark:bg-transparent dark:shadow-none',
  'dark:focus-visible:shadow-[inset_0_0_0_2px_rgb(255_255_255/0.4)]'
)

/** Hairline divider on the leading edge of a follow-up capsule segment. */
const controlSegmentDividerClass =
  'before:absolute before:inset-y-[22%] before:left-0 before:w-px before:bg-black/15 dark:before:bg-white/20'

/**
 * Chrome that gets out of the way during gestures. `visibility` (not just
 * opacity/pointer-events) keeps hidden controls out of the tab order; its 0s
 * flip is delayed to the end of the fade-out, instant on fade-in. Pull-to-
 * dismiss (and the dismiss animation) hides all gesture chrome; `starting:`
 * fades it in on open.
 */
const chromeGestureHideClass = cn(
  'visible opacity-100 [transition:opacity_200ms,visibility_0s_linear_0s] starting:opacity-0',
  'group-data-pulling/lb:invisible group-data-pulling/lb:opacity-0',
  'group-data-pulling/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]',
  'group-data-pull-dismissing/lb:invisible group-data-pull-dismissing/lb:opacity-0',
  'group-data-pull-dismissing/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
)

/* ── Styled primitives (design-system re-exports) ───────────────────────── */

function Root(props: React.ComponentProps<typeof RamkaLightbox.Root>) {
  return <RamkaLightbox.Root {...props} />
}

function Trigger({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Trigger>) {
  return (
    <RamkaLightbox.Trigger
      data-slot="lightbox-trigger"
      className={cn(
        'cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        className
      )}
      {...props}
    />
  )
}

function Portal({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Portal>) {
  return (
    <RamkaLightbox.Portal
      data-slot="lightbox-portal"
      className={cn('[--lb-ease-out-expo:cubic-bezier(0.16,1,0.3,1)]', className)}
      {...props}
    />
  )
}

function Backdrop({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Backdrop>) {
  return (
    <RamkaLightbox.Backdrop
      data-slot="lightbox-backdrop"
      className={cn(
        // Solid — the page underneath is fully covered while open.
        'fixed inset-0 z-70 bg-white opacity-0 dark:bg-black',
        // Duration cascade: `--lightbox-pull-snap-*` exist only while a
        // cancelled pull-to-dismiss springs back (so the refade matches the
        // item's spring); otherwise `--lightbox-vt-duration` — the Root's
        // `viewTransition` preset timing, which the library always sets on
        // the Portal host. The 360ms literal is just a safety net.
        'transition-opacity',
        'duration-(--lightbox-pull-snap-duration,var(--lightbox-vt-duration,360ms))',
        'ease-(--lightbox-pull-snap-easing,var(--lb-ease-out-expo))',
        // `--lightbox-pull-progress` is 0 → 1 while pull-to-dismiss drags;
        // `starting:` fades from 0 on the first frame after [data-open].
        'data-open:opacity-[calc(1-var(--lightbox-pull-progress,0)*0.6)]',
        'data-open:starting:opacity-0',
        'data-pulling:transition-none', // follow the finger
        className
      )}
      {...props}
    />
  )
}

function Content({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Content>) {
  return (
    <RamkaLightbox.Content
      data-slot="lightbox-content"
      className={cn(
        // `group/lb` publishes ramka's state attributes (data-pulling,
        // data-pull-dismissing, data-zoomed) to all chrome below.
        'group/lb fixed inset-0 z-70 flex flex-col overscroll-contain opacity-0 outline-none',
        // Same preset clock as the backdrop and the morph.
        'transition-opacity duration-(--lightbox-vt-duration,360ms) ease-(--lb-ease-out-expo)',
        'data-open:opacity-100 data-open:starting:opacity-0',
        // Letterbox insets around the media (read by Slide padding and the
        // snug width formula). Mobile: top clears the close-button row above;
        // bottom clears a caption that can wrap to 2 lines (see `Caption`)
        // plus the counter below it. Desktop: roomier, and the bottom adds
        // the thumbnail-strip row + one-line caption bar.
        '[--lb-inset-top:calc(4rem+env(safe-area-inset-top,0px))]',
        '[--lb-inset-bottom:calc(5rem+env(safe-area-inset-bottom,0px))]',
        '[--lb-inset-inline:0px]',
        'md:[--lb-inset-top:calc(4.5rem+env(safe-area-inset-top,0px))]',
        'md:[--lb-inset-bottom:calc(7.5rem+env(safe-area-inset-bottom,0px))]',
        'md:[--lb-inset-inline:3rem]',
        className
      )}
      {...props}
    />
  )
}

/**
 * Exit control — a back arrow, not a glass close button. It mirrors the
 * gallery page's own back button so leaving the viewer looks like the same
 * gesture as leaving the gallery.
 */
function Close({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.Close>) {
  return (
    <RamkaLightbox.Close
      data-slot="lightbox-close"
      className={cn(backClass, className)}
      aria-label="Close"
      {...props}
    >
      {children ?? <ArrowLeftIcon strokeWidth={2} />}
    </RamkaLightbox.Close>
  )
}

function Previous({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.Previous>) {
  return (
    <RamkaLightbox.Previous
      data-slot="lightbox-previous"
      className={cn(controlClass, '[&_svg]:size-4.5', className)}
      aria-label="Previous"
      {...props}
    >
      {children ?? <ChevronLeftIcon strokeWidth={2.25} />}
    </RamkaLightbox.Previous>
  )
}

function Next({ className, children, ...props }: React.ComponentProps<typeof RamkaLightbox.Next>) {
  return (
    <RamkaLightbox.Next
      data-slot="lightbox-next"
      className={cn(controlClass, '[&_svg]:size-4.5', className)}
      aria-label="Next"
      {...props}
    >
      {children ?? <ChevronRightIcon strokeWidth={2.25} />}
    </RamkaLightbox.Next>
  )
}

function Slides({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Slides>) {
  return (
    <RamkaLightbox.Slides
      data-slot="lightbox-slides"
      className={cn(
        'flex-1 gap-5 md:gap-0 scrollbar-none [&::-webkit-scrollbar]:hidden',
        className
      )}
      {...props}
    />
  )
}

function Slide({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Slide>) {
  return (
    <RamkaLightbox.Slide
      data-slot="lightbox-slide"
      className={cn(
        'h-full min-w-full flex-[0_0_100%] px-(--lb-inset-inline) pt-(--lb-inset-top) pb-(--lb-inset-bottom)',
        className
      )}
      {...props}
    />
  )
}

function Item({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Item>) {
  return <RamkaLightbox.Item data-slot="lightbox-item" className={className} {...props} />
}

function Media({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Media>) {
  return (
    <RamkaLightbox.Media
      data-slot="lightbox-media"
      className={cn('overflow-hidden md:rounded-lg [&_img]:select-none', className)}
      {...props}
    />
  )
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
      data-slot="lightbox-zoom-in"
      className={cn(controlClass, 'max-md:hidden', className)}
      aria-label="Zoom in"
      {...props}
    >
      {children ?? <ZoomInIcon strokeWidth={2.25} />}
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
      data-slot="lightbox-zoom-out"
      className={cn(controlClass, 'max-md:hidden', className)}
      aria-label="Zoom out"
      {...props}
    >
      {children ?? <ZoomOutIcon strokeWidth={2.25} />}
    </RamkaLightbox.ZoomOut>
  )
}

function Counter({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Counter>) {
  return (
    <RamkaLightbox.Counter
      data-slot="lightbox-counter"
      // md+: the thumbnail strip shows position, so the counter collapses to
      // sr-only and keeps only its aria-live announcement role.
      className={cn(
        'text-[0.6875rem] leading-tight text-neutral-500 tabular-nums md:sr-only dark:text-neutral-400',
        className
      )}
      {...props}
    />
  )
}

function Caption({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Caption>) {
  return (
    <RamkaLightbox.Caption
      data-slot="lightbox-caption"
      className={cn(
        // Mobile has no thumbnail strip competing for width, so long captions
        // wrap instead of cropping — up to 2 lines (`--lb-inset-bottom` above
        // reserves room for that). Desktop keeps the original one-line bar.
        'pointer-events-auto line-clamp-2 max-w-full text-[0.8125rem] leading-tight font-medium text-neutral-900 select-text md:line-clamp-1 dark:text-neutral-50',
        className
      )}
      {...props}
    />
  )
}

function ThumbnailStrip({
  className,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.ThumbnailStrip>) {
  return (
    <RamkaLightbox.ThumbnailStrip
      data-slot="lightbox-thumbnail-strip"
      className={cn(
        '[--lb-thumb-size:3.5rem] [--lb-strip-fade:32px]',
        // Soft edge fade over the scrolling thumbs (eased ramp, not linear).
        '[--lb-strip-mask:linear-gradient(to_right,rgb(0_0_0/0)_0,rgb(0_0_0/0.156)_calc(var(--lb-strip-fade)*0.25),rgb(0_0_0/0.5)_calc(var(--lb-strip-fade)*0.5),rgb(0_0_0/0.844)_calc(var(--lb-strip-fade)*0.75),#000_var(--lb-strip-fade),#000_calc(100%-var(--lb-strip-fade)),rgb(0_0_0/0.844)_calc(100%-var(--lb-strip-fade)*0.75),rgb(0_0_0/0.5)_calc(100%-var(--lb-strip-fade)*0.5),rgb(0_0_0/0.156)_calc(100%-var(--lb-strip-fade)*0.25),rgb(0_0_0/0)_100%)]',
        // pointer-events-auto counteracts the bottom band's click-through.
        'pointer-events-auto w-full min-w-0 self-stretch py-1',
        '[-webkit-mask-image:var(--lb-strip-mask)] mask-(--lb-strip-mask)',
        className
      )}
      {...props}
    />
  )
}

function ThumbnailStripTrack({
  className,
  ...props
}: React.ComponentProps<typeof RamkaLightbox.ThumbnailStripTrack>) {
  return (
    <RamkaLightbox.ThumbnailStripTrack
      data-slot="lightbox-thumbnail-strip-track"
      className={cn('flex w-max items-center gap-2', className)}
      {...props}
    />
  )
}

function Thumbnail({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Thumbnail>) {
  return (
    <RamkaLightbox.Thumbnail
      data-slot="lightbox-thumbnail"
      className={cn(
        'relative block size-(--lb-thumb-size) shrink-0 cursor-pointer overflow-hidden rounded-md',
        '[&_img]:block [&_img]:size-full [&_img]:object-cover',
        className
      )}
      {...props}
    />
  )
}

function ThumbnailGroup(props: React.ComponentProps<typeof RamkaLightbox.ThumbnailGroup>) {
  return <RamkaLightbox.ThumbnailGroup {...props} />
}

/* ── Snug layout (aspect-sized cards + peeking neighbors) ───────────────── */

/*
 * Card width = the largest size that fits the letterbox at the item's aspect
 * ratio: min(scrollport width minus gutters, letterbox height × ratio). The
 * `--lb-snug-ratio*` values are per-item aspect ratios set inline by the
 * Gallery; cqw/cqh resolve against the Slides scrollport (the library makes
 * it a size container). -start/-end are the first/last item's ratios, needed
 * by the ::before/::after spacers so the first/last card can center in the
 * scrollport under scroll-snap.
 */
const snugSlidesClass = cn(
  '[--lb-snug-gap:1.25rem] gap-(--lb-snug-gap) md:gap-(--lb-snug-gap)',
  '[--lb-snug-width-start:min(calc(100cqw-2*var(--lb-inset-inline)),calc((100cqh-var(--lb-inset-top)-var(--lb-inset-bottom))*var(--lb-snug-ratio-start,1)))]',
  '[--lb-snug-width-end:min(calc(100cqw-2*var(--lb-inset-inline)),calc((100cqh-var(--lb-inset-top)-var(--lb-inset-bottom))*var(--lb-snug-ratio-end,1)))]',
  'md:before:pointer-events-none md:before:flex-[0_0_calc((100cqw-var(--lb-snug-width-start))/2-var(--lb-snug-gap))]',
  'md:after:pointer-events-none md:after:flex-[0_0_calc((100cqw-var(--lb-snug-width-end))/2-var(--lb-snug-gap))]'
)

const snugSlideClass = cn(
  // No horizontal padding on the card itself — the gutter lives in the width
  // formula only, so neighbors can peek right up to the card edge. z-0 is the
  // stacking baseline for the zoomed-card promotion below.
  'z-0 px-0',
  '[--lb-snug-width:min(calc(100cqw-2*var(--lb-inset-inline)),calc((100cqh-var(--lb-inset-top)-var(--lb-inset-bottom))*var(--lb-snug-ratio)))]',
  'md:w-(--lb-snug-width) md:min-w-0 md:flex-[0_0_auto]',
  // The zoomed active card paints above the peeking neighbors.
  'group-data-zoomed/lb:has-data-active:z-1'
)

/*
 * Neighbor cards dim as the active item is pulled to dismiss
 * (`--lightbox-pull-progress`) or zoomed (`--lightbox-zoom-progress`) — both
 * library-written, 0 → 1. `filter` tracks the gesture 1:1 (transitioning it
 * would lag the finger); `opacity` transitions so the pull snap-back resolves
 * on the same spring as the item.
 */
const snugItemClass = cn(
  'transition-opacity',
  'duration-(--lightbox-pull-snap-duration,500ms)',
  'ease-(--lightbox-pull-snap-easing,var(--lb-ease-out-expo))',
  'not-data-active:[--lb-neighbor-dim:max(var(--lightbox-pull-progress,0),var(--lightbox-zoom-progress,0))]',
  'not-data-active:opacity-[calc(1-var(--lightbox-pull-progress,0)*0.85)]',
  'not-data-active:[filter:opacity(calc(1-var(--lb-neighbor-dim)))_blur(calc(var(--lb-neighbor-dim)*6px))]',
  'group-data-pulling/lb:transition-none' // follow the finger
)

/* ── Composed Gallery (product chrome) ──────────────────────────────────── */

/** Strip tabs are `--lb-thumb-size` (3.5rem/56px) and `object-fit: cover` — request 2× that. */
const THUMBNAIL_SIZE = 112

function GalleryThumbnailStrip({
  items,
  thumbnailsLabel
}: {
  items: LightboxItem[]
  thumbnailsLabel: string
}) {
  if (items.length <= 1) return null

  return (
    // The strip is desktop-only; mobile shows the counter instead.
    <ThumbnailStrip className="max-md:hidden">
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
      {/* Decorative ring over the active tab — the track scrolls under it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[calc(var(--lb-thumb-size)+8px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-black dark:border-white"
      />
    </ThumbnailStrip>
  )
}

/**
 * Default product chrome — Portal → Backdrop + Content → Slides/Zoom + glass
 * controls / caption + counter placard / desktop ThumbnailStrip. Supports bleed (full-width)
 * and snug (aspect-sized cards) via the top-right layout toggle or `slidesLayout`.
 */
function Gallery({
  items,
  ariaLabel,
  slidesLayout: slidesLayoutProp,
  onSlidesLayoutChange
}: {
  items: LightboxItem[]
  ariaLabel: string
  slidesLayout?: SlidesLayout
  onSlidesLayoutChange?: (layout: SlidesLayout) => void
}) {
  const t = useTranslations('Lightbox')
  const [slidesLayoutInternal, setSlidesLayoutInternal] = React.useState<SlidesLayout>(
    () => readStoredSlidesLayout() ?? 'bleed'
  )
  const slidesLayout = slidesLayoutProp ?? slidesLayoutInternal
  const snug = slidesLayout === 'snug'
  // Single item → no thumbnail strip → solo layout (tighter, centered bottom band).
  const solo = items.length <= 1

  const setSlidesLayout = React.useCallback(
    (next: SlidesLayout) => {
      storeSlidesLayout(next)
      onSlidesLayoutChange?.(next)
      if (slidesLayoutProp === undefined) {
        setSlidesLayoutInternal(next)
      }
    },
    [onSlidesLayoutChange, slidesLayoutProp]
  )

  const toggleSlidesLayout = React.useCallback(() => {
    setSlidesLayout(slidesLayout === 'snug' ? 'bleed' : 'snug')
  }, [setSlidesLayout, slidesLayout])

  const snugEdgeRatios =
    snug && items.length > 0
      ? {
          start: itemAspectRatio(items[0]),
          end: itemAspectRatio(items[items.length - 1])
        }
      : null

  const slidesStyle: CSSVarStyle | undefined = snugEdgeRatios
    ? {
        '--lb-snug-ratio-start': snugEdgeRatios.start,
        '--lb-snug-ratio-end': snugEdgeRatios.end
      }
    : undefined

  return (
    <Portal>
      <Backdrop />
      <Content
        aria-label={ariaLabel}
        className={cn(
          // Snug: the horizontal inset is a scrollport gutter consumed by the
          // card width formula — not per-slide padding.
          snug && 'md:[--lb-inset-inline:2rem]',
          // Solo (single item — no thumbnail strip): only the caption placard
          // sits below, so match the top inset and keep the letterbox symmetric.
          solo && 'md:[--lb-inset-bottom:calc(4.5rem+env(safe-area-inset-bottom,0px))]'
        )}
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
          className={snug ? snugSlidesClass : undefined}
          style={slidesStyle}
        >
          {items.map((item, i) => {
            const ratio = itemAspectRatio(item)
            const slideStyle: CSSVarStyle | undefined = snug
              ? { '--lb-snug-ratio': ratio }
              : undefined
            return (
              <Slide
                key={item.id ?? i}
                className={snug ? snugSlideClass : undefined}
                style={slideStyle}
              >
                <Item
                  index={i}
                  caption={item.caption ?? item.alt}
                  className={snug ? snugItemClass : undefined}
                >
                  <Zoom maxZoom={6}>
                    <Media width={item.width} height={item.height}>
                      <Image
                        width={item.width}
                        height={item.height}
                        src={item.src}
                        alt={item.alt}
                        sizes="100vw"
                        loader={sanityImageLoader}
                        // Only the initially-active slide preloads (the one
                        // relevant to LCP on open); later slides stay lazy
                        // even though `Slides` keeps a couple mounted for swipe.
                        priority={i === 0}
                        draggable={false}
                      />
                    </Media>
                  </Zoom>
                </Item>
              </Slide>
            )
          })}
        </Slides>

        {/* 0.75rem/1rem insets match the gallery header's own padding, so the
            back arrow lands where the page's back button sat. */}
        <div
          className={cn(
            'absolute top-[calc(1rem+env(safe-area-inset-top,0px))] left-4 z-1',
            chromeGestureHideClass,
            'max-md:group-data-zoomed/lb:invisible max-md:group-data-zoomed/lb:opacity-0',
            'max-md:group-data-zoomed/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
          )}
        >
          <Close aria-label={t('close')} />
        </div>

        {/* Desktop only — mobile already has swipe, and these would sit over
            the pull-to-dismiss / pinch-zoom gesture surface. `top`/`bottom`
            (not `inset-y-0`) span the media box, not the full dialog — the
            insets are asymmetric (desktop reserves more room at the bottom
            for the strip + caption), so centering on the viewport would drift
            off the image's actual vertical center. */}
        {!solo && (
          <div
            className={cn(
              'absolute top-(--lb-inset-top) bottom-(--lb-inset-bottom) left-4 z-1 hidden items-center md:flex',
              chromeGestureHideClass,
              'group-data-zoomed/lb:invisible group-data-zoomed/lb:opacity-0',
              'group-data-zoomed/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
            )}
          >
            <Previous aria-label={t('previous')} />
          </div>
        )}

        {!solo && (
          <div
            className={cn(
              'absolute top-(--lb-inset-top) bottom-(--lb-inset-bottom) right-4 z-1 hidden items-center md:flex',
              chromeGestureHideClass,
              'group-data-zoomed/lb:invisible group-data-zoomed/lb:opacity-0',
              'group-data-zoomed/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
            )}
          >
            <Next aria-label={t('next')} />
          </div>
        )}

        <div
          className={cn(
            'absolute top-[calc(0.75rem+env(safe-area-inset-top,0px))] right-3 z-1 flex gap-2',
            chromeGestureHideClass,
            // On mobile, zoom also hides the top controls — the media fills the screen.
            'max-md:group-data-zoomed/lb:invisible max-md:group-data-zoomed/lb:opacity-0',
            'max-md:group-data-zoomed/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
          )}
        >
          {/* Layout toggle: the icon is a miniature of the CURRENT layout —
              snug shows a card with neighbours, bleed one wide slide. */}
          <button
            type="button"
            className={cn(controlClass, 'max-md:hidden [&_svg]:size-4.5')}
            aria-pressed={snug}
            aria-label={snug ? t('switch_to_bleed_slides') : t('switch_to_snug_slides')}
            onClick={toggleSlidesLayout}
          >
            {snug ? (
              <GalleryHorizontalIcon strokeWidth={2.25} />
            ) : (
              <RectangleHorizontalIcon strokeWidth={2.25} />
            )}
          </button>
          {/* Zoom −/+ share one capsule with a hairline divider. */}
          <div className={cn(controlGroupClass, 'max-md:hidden')}>
            <ZoomOut className={controlSegmentClass} aria-label={t('zoom_out')} />
            <ZoomIn
              className={cn(controlSegmentClass, controlSegmentDividerClass)}
              aria-label={t('zoom_in')}
            />
          </div>
        </div>

        <div
          className={cn(
            // Click-through the inset band; caption opts back in for text selection.
            'pointer-events-none absolute inset-x-0 bottom-0 z-1 flex flex-col items-center gap-3',
            'px-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]',
            chromeGestureHideClass,
            // Zoom hides the bottom placard (the zoomed media pans under it).
            'group-data-zoomed/lb:invisible group-data-zoomed/lb:opacity-0',
            'group-data-zoomed/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]',
            // Solo (no strip): center the placard in the bottom inset band
            // instead of pinning it to the viewport edge.
            solo && 'min-h-(--lb-inset-bottom) justify-center pb-[env(safe-area-inset-bottom,0px)]'
          )}
        >
          {/*
            Caption under the media, placard-style. The counter is visible on
            mobile where there's no strip to show position; on md+ the strip
            covers that, so the counter collapses to sr-only and keeps only
            its aria-live announcement role.
          */}
          <div className="flex max-w-full flex-col items-center text-center">
            <Caption />
            {/* "1 of 1" is noise — skip the counter for single-item galleries. */}
            {solo ? null : (
              <Counter>
                {({ current, total }) =>
                  t('counter', { current: String(current), total: String(total) })
                }
              </Counter>
            )}
          </div>
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
  Media,
  Zoom,
  ZoomIn,
  ZoomOut,
  Counter,
  Caption,
  ThumbnailStrip,
  ThumbnailStripTrack,
  Thumbnail,
  ThumbnailGroup,
  Previous,
  Next,
  Gallery
}
