'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Languages } from 'lucide-react'
import { hasLocale, Locale, useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'

const langs: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  fr: 'Français',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文'
}

const languages = routing.locales.map((code) => ({ code, label: langs[code] }))

/** Shows the current language name from `md` up; an icon-only button below. */
export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('LanguageSwitcher')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  const handleValueChange = (lang: string) => {
    if (!hasLocale(routing.locales, lang) || lang === locale) return

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: lang, scroll: false }
      )
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
            <span className="hidden md:inline">{langs[locale]}</span>
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
