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
import { Locale, useExtracted, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export type Language = {
  code: Locale
  label: React.ReactNode
}

const langs: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  fr: 'Français'
}

export function LanguageSwitcher({
  size = 'default'
}: {
  size?: 'icon-sm' | 'default'
}) {
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

  const languages = locales.map((locale) => ({
    code: locale,
    label: langs[locale]
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
  languages: Language[]
  value?: Locale
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
  const t = useExtracted()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger disabled={disabled} asChild>
        <Button
          aria-label={t('Select language')}
          size={size}
          className={className}
          variant={variant}
        >
          {size === 'default' ? (value ? langs[value] : t('Languages')) : null}
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuRadioGroup
          onValueChange={(value) => onChange?.(value as Locale)}
          value={value}
        >
          {languages.map(({ code, label }) => (
            <DropdownMenuRadioItem key={code} lang={code} value={code}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
