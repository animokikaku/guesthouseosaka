/**
 * Ramka lightbox primitives with this site's Tailwind skin. The composed
 * viewer built from them is `LightboxGallery`
 * (`components/gallery/lightbox-gallery.tsx`).
 *
 * Conventions:
 * - Variables named `--lightbox-*` are written by the ramka runtime (gesture
 *   progress, motion timing) — the skin only reads them. Variables named
 *   `--lb-*` are this skin's own tokens, declared via arbitrary properties.
 * - Gesture-driven state rides on data attributes ramka sets on Content
 *   (`data-open`, `data-pulling`, `data-pull-dismissing`, `data-zoomed`),
 *   consumed through the named `group/lb` on Content. All view-transition CSS
 *   (morph group, snapshots, crossfade) is injected by the library; the skin
 *   ships none of it.
 */

import * as RamkaLightbox from '@ramka/react/lightbox'
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ZoomInIcon,
  ZoomOutIcon
} from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

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
export const controlClass = cn(
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
export const controlGroupClass = cn(
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
export const controlSegmentClass = cn(
  'relative h-auto w-9 rounded-none border-0 bg-transparent shadow-none',
  'backdrop-blur-none backdrop-saturate-100',
  'active:scale-100',
  'focus-visible:shadow-[inset_0_0_0_2px_rgb(0_0_0/0.25)]',
  'dark:bg-transparent dark:shadow-none',
  'dark:focus-visible:shadow-[inset_0_0_0_2px_rgb(255_255_255/0.4)]'
)

/** Hairline divider on the leading edge of a follow-up capsule segment. */
export const controlSegmentDividerClass =
  'before:absolute before:inset-y-[22%] before:left-0 before:w-px before:bg-black/15 dark:before:bg-white/20'

/**
 * Chrome that gets out of the way during gestures. `visibility` (not just
 * opacity/pointer-events) keeps hidden controls out of the tab order; its 0s
 * flip is delayed to the end of the fade-out, instant on fade-in. Pull-to-
 * dismiss (and the dismiss animation) hides all gesture chrome; `starting:`
 * fades it in on open.
 */
export const chromeGestureHideClass = cn(
  'visible opacity-100 [transition:opacity_200ms,visibility_0s_linear_0s] starting:opacity-0',
  'group-data-pulling/lb:invisible group-data-pulling/lb:opacity-0',
  'group-data-pulling/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]',
  'group-data-pull-dismissing/lb:invisible group-data-pull-dismissing/lb:opacity-0',
  'group-data-pull-dismissing/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
)

/** Chrome that also hides while the media is zoomed. */
export const chromeZoomHideClass = cn(
  'group-data-zoomed/lb:invisible group-data-zoomed/lb:opacity-0',
  'group-data-zoomed/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
)

/** Same, mobile only — on desktop the top controls stay usable while zoomed. */
export const mobileChromeZoomHideClass = cn(
  'max-md:group-data-zoomed/lb:invisible max-md:group-data-zoomed/lb:opacity-0',
  'max-md:group-data-zoomed/lb:[transition:opacity_200ms,visibility_0s_linear_200ms]'
)

/* ── Styled primitives (design-system re-exports) ───────────────────────── */

function Root({ license = 'gpl', ...props }: React.ComponentProps<typeof RamkaLightbox.Root>) {
  return <RamkaLightbox.Root license={license} {...props} />
}

function Trigger({ className, ...props }: React.ComponentProps<typeof RamkaLightbox.Trigger>) {
  return (
    <RamkaLightbox.Trigger
      data-slot="lightbox-trigger"
      className={cn(
        // Inset, not outset: an outset ring on a tightly-packed grid (2px
        // gaps) would land on top of the next tile and get painted over.
        'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset',
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
        // `ssrSlideShift` can't read the computed gap, so it gets a copy.
        '[--lightbox-ssr-slide-gap:1.25rem] md:[--lightbox-ssr-slide-gap:0px]',
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
        // A server-rendered strip sits at offset 0 until ramka positions it;
        // client-side opens are positioned before their first paint.
        'not-data-positioned:invisible',
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
/**
 * Styled Lightbox namespace — drop-in replacement for ramka's `Lightbox` with
 * this site's styles.
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
  Previous,
  Next
}
