'use client'

import { useOptimistic } from '@/hooks/use-optimistic'
import type { SettingsQueryResult } from '@/sanity.types'

type SiteFooterProps = {
  settings: SettingsQueryResult
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear()
  const [socialLinks, attr] = useOptimistic(settings, 'socialLinks')

  return (
    <footer className="group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent group-has-[.snap-footer]/body:md:snap-end dark:bg-transparent">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex min-h-(--footer-height) flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex-nowrap">
          <div className="text-muted-foreground flex-1 px-1 text-left text-xs leading-loose sm:text-sm">
            <span className="sr-only">
              ゲストハウス大阪 ー Guest House Osaka
            </span>
            © {year} {settings?.companyName}
          </div>
          <div
            className="flex shrink-0 items-center gap-3"
            data-sanity={attr.list()}
          >
            {socialLinks?.map((link) => {
              if (!link.icon || !link.url) return null
              return (
                <SocialLink
                  key={link._key}
                  data-sanity={attr.item(link._key)}
                  href={link.url}
                  platform={link.platform ?? 'social'}
                  icon={link.icon}
                />
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  platform,
  icon,
  ...props
}: {
  href: string
  platform: string
  icon: string
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className="text-muted-foreground hover:text-foreground transition-colors [&_svg]:size-5"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      dangerouslySetInnerHTML={{ __html: icon }}
      {...props}
    />
  )
}
