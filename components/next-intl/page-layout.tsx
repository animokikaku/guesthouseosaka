import ExternalLink from '@/components/next-intl/external-link'
import { useExtracted } from 'next-intl'
import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  title: ReactNode
}

export default function PageLayout({ children, title }: Props) {
  const t = useExtracted()

  return (
    <div className="bg-slate-850 relative flex grow flex-col py-36">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1 left-0 size-[20500px] translate-x-[-47.5%] rounded-full bg-linear-to-b from-slate-900 via-cyan-500" />
      </div>
      <div className="relative container flex grow flex-col px-4">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <div className="mt-6 text-gray-400 md:text-lg">{children}</div>
        <div className="mt-auto grid grid-cols-1 gap-4 pt-20 md:grid-cols-2 lg:gap-12">
          <ExternalLink
            description={t('Learn more about next-intl in the official docs.')}
            href={t('https://next-intl.dev')}
            title={t('Docs')}
          />
          <ExternalLink
            description={t('Browse the source code of this example on GitHub.')}
            href={t(
              'https://github.com/amannn/next-intl/tree/main/examples/example-app-router'
            )}
            title={t('Source code')}
          />
        </div>
      </div>
    </div>
  )
}
