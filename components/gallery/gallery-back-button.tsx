import { Button, buttonVariants } from '@/components/ui/button'
import type { HouseIdentifier } from '@/lib/types'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'use-intl'

// The gallery's two ways back to the house page look alike, and the lightbox's
// own close control (`components/ui/lightbox.tsx`) mirrors them both.

function BackButtonContent({ label }: { label: string }) {
  return (
    <>
      <ArrowLeftIcon aria-hidden="true" className="size-6" />
      <span className="sr-only">{label}</span>
    </>
  )
}

/** Closes the gallery modal, which then navigates back to the house page. */
export function GalleryModalCloseButton() {
  const t = useTranslations('GalleryModal')

  return (
    <DialogPrimitive.Close
      render={<Button variant="ghost" size="icon" className="shrink-0 rounded-full" />}
    >
      <BackButtonContent label={t('close')} />
    </DialogPrimitive.Close>
  )
}

/** Links from the full gallery page back to the house page. */
export function GalleryPageBackLink({ house }: { house: HouseIdentifier }) {
  const t = useTranslations('GalleryPage')
  const locale = useLocale()

  return (
    <Link
      to="/$locale/$house"
      params={{ locale, house }}
      className={buttonVariants({
        variant: 'ghost',
        size: 'icon',
        className: 'shrink-0 rounded-full'
      })}
    >
      <BackButtonContent label={t('close')} />
    </Link>
  )
}
