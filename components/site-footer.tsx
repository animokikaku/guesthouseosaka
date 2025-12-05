import { Icons } from '@/components/icons'
import { urls } from '@/lib/config'
import { useTranslations } from 'next-intl'

export function SiteFooter() {
  const t = useTranslations('SiteFooter')
  const year = new Date().getFullYear()

  return (
    <footer className="group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent group-has-[.snap-footer]/body:md:snap-end dark:bg-transparent">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex min-h-(--footer-height) flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex-nowrap">
          <div className="text-muted-foreground flex-1 px-1 text-left text-xs leading-loose sm:text-sm">
            <span className="sr-only">{t('brand_name')}</span>© {year}{' '}
            {t('company_name')}
          </div>
          <div className="text-muted-foreground flex-1 px-1 text-left text-xs leading-loose sm:text-sm">
            <span className="sr-only">
              Built with ❤️ by{' '}
              <a href={urls.author.url} target="_blank" rel="noopener">
                {urls.author.name}
              </a>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <SocialLink
              href={urls.socials.facebook}
              icon={<Icons.facebook className="size-5" />}
            />
            <SocialLink
              href={urls.socials.instagram}
              icon={<Icons.instagram className="size-5" />}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      className="text-muted-foreground hover:text-foreground transition-colors"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  )
}
