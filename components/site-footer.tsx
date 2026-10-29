import { BrandIcon } from '@/lib/icons/brand'
import { OptimisticArray } from '@/components/optimistic-array'
import type { SettingsQueryResult } from '@/sanity.types'
import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute'
import { stegaClean } from '@sanity/client/stega'

type SiteFooterProps = {
  settings: NonNullable<SettingsQueryResult>
  year: number
}

type Settings = NonNullable<SettingsQueryResult>

export function SiteFooter({ settings, year }: SiteFooterProps) {
  const dataAttribute = createDataAttribute({
    id: settings._id,
    type: settings._type
  })

  return (
    <footer
      data-slot="site-footer"
      // Pages opt in with a marker class: `footer-snap` makes the footer a
      // scroll-snap target. The page leaves the DOM on navigation, so it
      // doesn't outlive it.
      className="md:group-has-[.footer-snap]/body:snap-end"
    >
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex min-h-(--footer-height) flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex-nowrap">
          <div className="text-muted-foreground flex-1 px-1 text-left text-xs leading-loose sm:text-sm">
            <span className="sr-only">ゲストハウス大阪 ー Guest House Osaka</span>© {year}{' '}
            {settings.companyName}
          </div>
          <div
            className="flex shrink-0 items-center gap-3"
            data-sanity={dataAttribute('socialLinks')}
          >
            <OptimisticArray
              documentId={settings._id}
              value={settings.socialLinks}
              select={(document: Settings) => document.socialLinks}
            >
              {(links) =>
                links?.map((link) => (
                  <SocialLink
                    key={link._key}
                    href={link.url}
                    icon={link.icon}
                    label={link.label}
                    data-sanity={dataAttribute(`socialLinks[_key=="${link._key}"]`)}
                  />
                ))
              }
            </OptimisticArray>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  icon,
  label,
  'data-sanity': dataSanity,
  ...props
}: {
  href: string
  icon: string
  label: string
  'data-sanity'?: string
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className="text-muted-foreground hover:text-foreground"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={stegaClean(label)}
      data-sanity={dataSanity}
      {...props}
    >
      {/* The anchor owns the accessible name, so the mark is decorative here. */}
      <BrandIcon name={icon} aria-hidden="true" className="size-5" />
    </a>
  )
}
