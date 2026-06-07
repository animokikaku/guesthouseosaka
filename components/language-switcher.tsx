'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { Languages } from 'lucide-react'
import { hasLocale, Locale, useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

const langs: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  fr: 'Français'
}

export function LanguageSwitcher({ size = 'default' }: { size?: 'icon-sm' | 'default' }) {
  const { locales } = routing
  const locale = useLocale()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  const handleOnChange = useCallback(
    (lang: Locale) => {
      startTransition(() => {
        router.replace(
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          { pathname, params },
          { locale: lang, scroll: false }
        )
      })
    },
    [router, pathname, params]
  )

  const languages = locales.map((loc) => ({
    code: loc,
    label: langs[loc]
  }))

  return (
    <LanguageSwitcherSelect
      languages={languages}
      value={locale}
      disabled={isPending}
      onChange={handleOnChange}
      size={size}
      variant="ghost"
    />
  )
}

type LanguageSwitcherSelectProps = {
  languages: { code: Locale; label: React.ReactNode }[]
  value: Locale
  disabled?: boolean
  align?: 'start' | 'center' | 'end'
  variant?: 'outline' | 'ghost'
  onChange?: (code: Locale) => void
  className?: string
  size?: 'default' | 'icon-sm'
}

function LanguageSwitcherSelect({
  languages,
  value,
  align = 'end',
  disabled = false,
  variant = 'outline',
  size = 'default',
  onChange,
  className
}: LanguageSwitcherSelectProps) {
  const t = useTranslations('LanguageSwitcher')
  const [open, setOpen] = useState(false)

  const handleValueChange = useCallback(
    (val: string) => {
      if (!hasLocale(routing.locales, val)) {
        return
      }

      if (val !== value) {
        onChange?.(val)
      }
    },
    [onChange, value]
  )

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={disabled}
        render={
          <Button aria-label={t('aria_label')} size={size} className={className} variant={variant}>
            {size === 'default' ? langs[value] : null}
            <Languages />
          </Button>
        }
      />
      <LanguageMenuContent align={align}>
        <DropdownMenuRadioGroup onValueChange={handleValueChange} value={value}>
          {languages.map(({ code, label }) => (
            <DropdownMenuRadioItem
              key={code}
              lang={code}
              onClick={() => setOpen(false)}
              value={code}
            >
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </LanguageMenuContent>
    </DropdownMenu>
  )
}

function LanguageMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        disableAnchorTracking
        positionMethod="fixed"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="language-menu-content"
          className={cn(
            'z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95 animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!',
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}
