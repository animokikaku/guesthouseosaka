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
import { useFormatter, useTranslations } from 'next-intl'

const LAST_UPDATED_DATE = new Date(Date.UTC(2025, 11, 4))

export function LegalNoticeDialog({ children }: { children: React.ReactNode }) {
  const t = useTranslations('LegalNoticeDialog')
  const formatter = useFormatter()
  const intro = [t('intro.company'), t('intro.purpose')]
  const sections = [
    {
      title: t('sections.information_collected.title'),
      paragraphs: [t('sections.information_collected.paragraphs.0')],
      list: [
        t('sections.information_collected.list.0'),
        t('sections.information_collected.list.1'),
        t('sections.information_collected.list.2')
      ],
      closing: t('sections.information_collected.closing')
    },
    {
      title: t('sections.usage.title'),
      paragraphs: [t('sections.usage.paragraphs.0')],
      list: [
        t('sections.usage.list.0'),
        t('sections.usage.list.1'),
        t('sections.usage.list.2'),
        t('sections.usage.list.3')
      ],
      closing: t('sections.usage.closing')
    },
    {
      title: t('sections.retention.title'),
      paragraphs: [
        t('sections.retention.paragraphs.0'),
        t('sections.retention.paragraphs.1'),
        t('sections.retention.paragraphs.2')
      ]
    },
    {
      title: t('sections.sharing.title'),
      paragraphs: [
        t('sections.sharing.paragraphs.0'),
        t('sections.sharing.paragraphs.1')
      ]
    },
    {
      title: t('sections.rights.title'),
      paragraphs: [t('sections.rights.paragraphs.0')],
      list: [
        t('sections.rights.list.0'),
        t('sections.rights.list.1'),
        t('sections.rights.list.2')
      ],
      closing: t('sections.rights.closing')
    },
    {
      title: t('sections.security.title'),
      paragraphs: [
        t('sections.security.paragraphs.0'),
        t('sections.security.paragraphs.1')
      ]
    },
    {
      title: t('sections.contact.title'),
      paragraphs: [t('sections.contact.paragraphs.0')],
      details: [
        t('sections.contact.details.0'),
        t('sections.contact.details.1'),
        t('sections.contact.details.2'),
        t('sections.contact.details.3')
      ]
    },
    {
      title: t('sections.changes.title'),
      paragraphs: [
        t('sections.changes.paragraphs.0'),
        t('sections.changes.paragraphs.1')
      ]
    }
  ]

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
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm leading-6">
          <p className="text-muted-foreground text-xs">
            {t('last_updated', {
              date: formatter.dateTime(LAST_UPDATED_DATE, {
                dateStyle: 'long'
              })
            })}
          </p>
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
            <Button variant="secondary">{t('close_button')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
