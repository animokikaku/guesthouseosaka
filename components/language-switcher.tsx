import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { localeConfig } from '@/i18n/locales'
import { LOCALE_COOKIE, routing } from '@/i18n/routing'
import { useNavigate } from '@tanstack/react-router'
import { Languages } from 'lucide-react'
import { hasLocale, useLocale, useTranslations } from 'use-intl'
import { useTransition } from 'react'

const languages = routing.locales.map((code) => ({ code, label: localeConfig[code].label }))

/** Shows the current language name from `md` up; an icon-only button below. */
export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('LanguageSwitcher')
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const handleValueChange = (lang: string) => {
    if (!hasLocale(routing.locales, lang) || lang === locale) return

    // Remembered for visits to `/`, which the server redirects by it. Set here
    // rather than on every response, so pages stay cacheable.
    document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`

    startTransition(async () => {
      // The same page, in the chosen language.
      await navigate({
        to: '.',
        params: (current) => ({ ...current, locale: lang }),
        replace: true,
        resetScroll: false
      })
    })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        disabled={isPending}
        render={
          <Button
            aria-label={t('aria_label')}
            variant="ghost"
            className="size-8 px-0 has-[>svg]:px-0 md:h-9 md:w-auto md:px-4 md:py-2 md:has-[>svg]:px-3"
          >
            <span className="hidden md:inline">{localeConfig[locale].label}</span>
            <Languages aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" disableAnchorTracking positionMethod="fixed">
        <DropdownMenuRadioGroup onValueChange={handleValueChange} value={locale}>
          {languages.map(({ code, label }) => (
            <DropdownMenuRadioItem key={code} lang={code} value={code} closeOnClick>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
