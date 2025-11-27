'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'

export function LegalNoticeDialog({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  const intro = [
    t('legal.privacy.intro.company'),
    t('legal.privacy.intro.purpose')
  ]
  const sections = [
    {
      title: t('legal.privacy.sections.informationCollected.title'),
      paragraphs: [
        t('legal.privacy.sections.informationCollected.paragraphs.0')
      ],
      list: [
        t('legal.privacy.sections.informationCollected.list.0'),
        t('legal.privacy.sections.informationCollected.list.1'),
        t('legal.privacy.sections.informationCollected.list.2')
      ],
      closing: t('legal.privacy.sections.informationCollected.closing')
    },
    {
      title: t('legal.privacy.sections.usage.title'),
      paragraphs: [t('legal.privacy.sections.usage.paragraphs.0')],
      list: [
        t('legal.privacy.sections.usage.list.0'),
        t('legal.privacy.sections.usage.list.1'),
        t('legal.privacy.sections.usage.list.2'),
        t('legal.privacy.sections.usage.list.3')
      ],
      closing: t('legal.privacy.sections.usage.closing')
    },
    {
      title: t('legal.privacy.sections.retention.title'),
      paragraphs: [
        t('legal.privacy.sections.retention.paragraphs.0'),
        t('legal.privacy.sections.retention.paragraphs.1'),
        t('legal.privacy.sections.retention.paragraphs.2')
      ]
    },
    {
      title: t('legal.privacy.sections.sharing.title'),
      paragraphs: [
        t('legal.privacy.sections.sharing.paragraphs.0'),
        t('legal.privacy.sections.sharing.paragraphs.1')
      ]
    },
    {
      title: t('legal.privacy.sections.rights.title'),
      paragraphs: [t('legal.privacy.sections.rights.paragraphs.0')],
      list: [
        t('legal.privacy.sections.rights.list.0'),
        t('legal.privacy.sections.rights.list.1'),
        t('legal.privacy.sections.rights.list.2')
      ],
      closing: t('legal.privacy.sections.rights.closing')
    },
    {
      title: t('legal.privacy.sections.security.title'),
      paragraphs: [
        t('legal.privacy.sections.security.paragraphs.0'),
        t('legal.privacy.sections.security.paragraphs.1')
      ]
    },
    {
      title: t('legal.privacy.sections.contact.title'),
      paragraphs: [t('legal.privacy.sections.contact.paragraphs.0')],
      details: [
        t('legal.privacy.sections.contact.details.0'),
        t('legal.privacy.sections.contact.details.1'),
        t('legal.privacy.sections.contact.details.2'),
        t('legal.privacy.sections.contact.details.3')
      ]
    },
    {
      title: t('legal.privacy.sections.changes.title'),
      paragraphs: [
        t('legal.privacy.sections.changes.paragraphs.0'),
        t('legal.privacy.sections.changes.paragraphs.1')
      ]
    }
  ]

  const lastUpdated = t('legal.privacy.lastUpdated')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="h-auto px-0 font-medium underline-offset-4"
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('legal.privacy.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm leading-6">
          {lastUpdated && (
            <p className="text-muted-foreground text-xs">{lastUpdated}</p>
          )}
          <div className="space-y-2">
            {intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {sections.map(({ title, paragraphs, list, closing, details }) => (
            <section key={title} className="space-y-3">
              <h3 className="text-base font-semibold">{title}</h3>
              <div className="space-y-2">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {list?.length ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {closing ? <p>{closing}</p> : null}
              </div>
              {details?.length ? (
                <div className="space-y-1">
                  {details.map((detail, index) => (
                    <p key={`detail-${index}`}>{detail}</p>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="secondary">{t('common.close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
