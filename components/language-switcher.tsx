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
import { cn } from '@/lib/utils'
import { Languages } from 'lucide-react'
import { hasLocale, Locale, useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'

const langs: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  fr: 'Français'
}

const languages = routing.locales.map((code) => ({ code, label: langs[code] }))

export function LanguageSwitcher({
  size = 'default'
}: {
  size?: 'icon-sm' | 'default' | 'responsive'
}) {
  const locale = useLocale()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  const handleOnChange = (lang: Locale) => {
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
    <LanguageSwitcherSelect
      value={locale}
      disabled={isPending}
      onChange={handleOnChange}
      size={size}
      variant="ghost"
    />
  )
}

type LanguageSwitcherSelectProps = {
  value: Locale
  disabled?: boolean
  align?: 'start' | 'center' | 'end'
  variant?: 'outline' | 'ghost'
  onChange?: (code: Locale) => void
  className?: string
  size?: 'default' | 'icon-sm' | 'responsive'
}

function LanguageSwitcherSelect({
  value,
  align = 'end',
  disabled = false,
  variant = 'outline',
  size = 'default',
  onChange,
  className
}: LanguageSwitcherSelectProps) {
  const t = useTranslations('LanguageSwitcher')

  const handleValueChange = (val: string) => {
    if (!hasLocale(routing.locales, val)) {
      return
    }

    if (val !== value) {
      onChange?.(val)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        disabled={disabled}
        render={
          <Button
            aria-label={t('aria_label')}
            size={size === 'responsive' ? 'default' : size}
            className={cn(
              size === 'responsive' &&
                'size-8 px-0 has-[>svg]:px-0 md:h-9 md:w-auto md:px-4 md:py-2 md:has-[>svg]:px-3',
              className
            )}
            variant={variant}
          >
            {size !== 'icon-sm' ? (
              <span className={cn(size === 'responsive' && 'hidden md:inline')}>
                {langs[value]}
              </span>
            ) : null}
            <Languages aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align={align} disableAnchorTracking positionMethod="fixed">
        <DropdownMenuRadioGroup onValueChange={handleValueChange} value={value}>
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
