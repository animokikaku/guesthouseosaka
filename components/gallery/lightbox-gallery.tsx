/**
 * The site's lightbox viewer, composed from the `components/ui/lightbox`
 * primitives: bleed or snug slides, glass controls, a caption and counter
 * placard, and a desktop thumbnail strip.
 */

import { GalleryHorizontalIcon, RectangleHorizontalIcon } from 'lucide-react'
import { useTranslations } from 'use-intl'
import * as React from 'react'
import { flushSync } from 'react-dom'

import { SanityImage } from '@/components/sanity-image'
import {
  chromeGestureHideClass,
  chromeZoomHideClass,
  controlClass,
  controlGroupClass,
  controlSegmentClass,
  controlSegmentDividerClass,
  Lightbox,
  mobileChromeZoomHideClass
} from '@/components/ui/lightbox'
import { LIGHTBOX_THUMBNAIL_SIZE, type LightboxItem } from '@/lib/gallery-image'
import { cn } from '@/lib/utils'

type SlidesLayout = 'bleed' | 'snug'

/** Inline styles that carry the `--lb-*`/`--lightbox-*` custom properties the skin reads/writes. */
type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>

/**
 * The snug/bleed choice is a user preference, so it survives across galleries
 * and visits. Guarded reads/writes: localStorage throws in some private modes,
 * where the choice lasts for the session instead. The server always renders
 * bleed, which a deep link's server-rendered viewer hydrates with before
 * switching to the stored layout.
 */
const SLIDES_LAYOUT_STORAGE_KEY = 'ramka-lightbox-slides-layout'

let sessionSlidesLayout: SlidesLayout | null = null
const slidesLayoutListeners = new Set<() => void>()

function subscribeSlidesLayout(listener: () => void) {
  slidesLayoutListeners.add(listener)
  return () => {
    slidesLayoutListeners.delete(listener)
  }
}

function getSlidesLayout(): SlidesLayout {
  if (sessionSlidesLayout) return sessionSlidesLayout
  try {
    const value = window.localStorage.getItem(SLIDES_LAYOUT_STORAGE_KEY)
    return value === 'snug' ? 'snug' : 'bleed'
  } catch {
    return 'bleed'
  }
}

function getServerSlidesLayout(): SlidesLayout {
  return 'bleed'
}

function setSlidesLayout(layout: SlidesLayout) {
  sessionSlidesLayout = layout
  try {
    window.localStorage.setItem(SLIDES_LAYOUT_STORAGE_KEY, layout)
  } catch {
    // Storage unavailable — the toggle still works for this session.
  }
  for (const listener of slidesLayoutListeners) listener()
}

function itemAspectRatio(item: LightboxItem): number {
  return item.width / item.height
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

function LightboxThumbnails({
  items,
  thumbnailsLabel
}: {
  items: LightboxItem[]
  thumbnailsLabel: string
}) {
  if (items.length <= 1) return null

  return (
    // The strip is desktop-only; mobile shows the counter instead.
    <Lightbox.ThumbnailStrip className="max-md:hidden">
      <Lightbox.ThumbnailStripTrack aria-label={thumbnailsLabel}>
        {items.map((item, i) => (
          <Lightbox.Thumbnail key={item.id} index={i}>
            <SanityImage
              src={item.thumb}
              blurHash={item.thumbBlurHash}
              alt={item.alt}
              width={LIGHTBOX_THUMBNAIL_SIZE}
              height={LIGHTBOX_THUMBNAIL_SIZE}
              draggable={false}
            />
          </Lightbox.Thumbnail>
        ))}
      </Lightbox.ThumbnailStripTrack>
      {/* Decorative ring over the active tab — the track scrolls under it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[calc(var(--lb-thumb-size)+8px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-black dark:border-white"
      />
    </Lightbox.ThumbnailStrip>
  )
}

/**
 * Default product chrome — Portal → Backdrop + Content → Slides/Zoom + glass
 * controls / caption + counter placard / desktop ThumbnailStrip. Supports bleed
 * (full-width) and snug (aspect-sized cards) via the top-right layout toggle.
 */
export function LightboxGallery({
  items,
  ariaLabel,
  inPlace = false,
  captionFallback
}: {
  items: LightboxItem[]
  ariaLabel: string
  /** Renders the viewer where it sits instead of portalling it to `body`, so a server render can open it. */
  inPlace?: boolean
  /** The caption a server-rendered open viewer paints until its items register theirs. */
  captionFallback?: React.ReactNode
}) {
  const t = useTranslations('Lightbox')
  const slidesLayout = React.useSyncExternalStore(
    subscribeSlidesLayout,
    getSlidesLayout,
    getServerSlidesLayout
  )
  const snug = slidesLayout === 'snug'
  // Single item → no thumbnail strip → solo layout (tighter, centered bottom band).
  const solo = items.length <= 1

  const toggleSlidesLayout = () => {
    const next = snug ? 'bleed' : 'snug'
    // Crossfade the remounted slides (`Slides` is keyed by layout) rather than
    // swapping them in one frame.
    if (
      typeof document.startViewTransition !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setSlidesLayout(next)
      return
    }
    document.startViewTransition(() => flushSync(() => setSlidesLayout(next)))
  }

  const slidesStyle: CSSVarStyle | undefined =
    snug && items.length > 0
      ? {
          '--lb-snug-ratio-start': itemAspectRatio(items[0]),
          '--lb-snug-ratio-end': itemAspectRatio(items[items.length - 1])
        }
      : undefined

  return (
    <Lightbox.Portal container={inPlace ? null : undefined}>
      <Lightbox.Backdrop />
      <Lightbox.Content
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
        <Lightbox.Slides
          key={slidesLayout}
          aria-label={t('full_size_images')}
          aria-roledescription={t('carousel')}
          preload={2}
          // A server-rendered open viewer paints the linked slide rather than
          // the first. Snug cards differ in width, which the shift can't follow.
          ssrSlideShift={!snug}
          className={snug ? snugSlidesClass : undefined}
          style={slidesStyle}
        >
          {items.map((item, i) => {
            const ratio = itemAspectRatio(item)
            const slideStyle: CSSVarStyle | undefined = snug
              ? { '--lb-snug-ratio': ratio }
              : undefined
            return (
              <Lightbox.Slide
                key={item.id}
                className={snug ? snugSlideClass : undefined}
                style={slideStyle}
              >
                <Lightbox.Item
                  index={i}
                  caption={item.caption ?? item.alt}
                  aria-label={t('counter', { current: String(i + 1), total: String(items.length) })}
                  aria-roledescription={t('slide')}
                  className={snug ? snugItemClass : undefined}
                >
                  <Lightbox.Zoom maxZoom={4}>
                    <Lightbox.Media width={item.width} height={item.height}>
                      <SanityImage
                        width={item.width}
                        height={item.height}
                        src={item.src}
                        alt={item.alt}
                        sizes="100vw"
                        quality={90}
                        // `Slides` only mounts the active slide and its
                        // `preload` neighbours, so every mounted image is one
                        // the visitor is about to see.
                        loading="eager"
                        draggable={false}
                      />
                    </Lightbox.Media>
                  </Lightbox.Zoom>
                </Lightbox.Item>
              </Lightbox.Slide>
            )
          })}
        </Lightbox.Slides>

        {/* 0.75rem/1rem insets match the gallery header's own padding, so the
            back arrow lands where the page's back button sat. */}
        <div
          className={cn(
            'absolute top-[calc(1rem+env(safe-area-inset-top,0px))] left-4 z-1',
            chromeGestureHideClass,
            mobileChromeZoomHideClass
          )}
        >
          <Lightbox.Close aria-label={t('close')} />
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
              chromeZoomHideClass
            )}
          >
            <Lightbox.Previous aria-label={t('previous')} />
          </div>
        )}

        {!solo && (
          <div
            className={cn(
              'absolute top-(--lb-inset-top) bottom-(--lb-inset-bottom) right-4 z-1 hidden items-center md:flex',
              chromeGestureHideClass,
              chromeZoomHideClass
            )}
          >
            <Lightbox.Next aria-label={t('next')} />
          </div>
        )}

        <div
          className={cn(
            'absolute top-[calc(0.75rem+env(safe-area-inset-top,0px))] right-3 z-1 flex gap-2',
            chromeGestureHideClass,
            // On mobile, zoom also hides the top controls — the media fills the screen.
            mobileChromeZoomHideClass
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
            <Lightbox.ZoomOut className={controlSegmentClass} aria-label={t('zoom_out')} />
            <Lightbox.ZoomIn
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
            chromeZoomHideClass,
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
            <Lightbox.Caption>{captionFallback}</Lightbox.Caption>
            {/* "1 of 1" is noise — skip the counter for single-item galleries. */}
            {solo ? null : (
              <Lightbox.Counter>
                {({ current, total }) =>
                  t('counter', { current: String(current), total: String(total) })
                }
              </Lightbox.Counter>
            )}
          </div>
          <LightboxThumbnails items={items} thumbnailsLabel={t('thumbnails')} />
        </div>
      </Lightbox.Content>
    </Lightbox.Portal>
  )
}
