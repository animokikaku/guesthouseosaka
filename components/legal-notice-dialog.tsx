'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useLegalNotice } from '@/hooks/use-legal-notice'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { useFormatter, useTranslations } from 'next-intl'

const legalContentComponents: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-base font-semibold">{children}</h3>
    ),
    normal: ({ children }) => <p>{children}</p>
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-1 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-1 pl-5">{children}</ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  }
}

export function LegalNoticeDialog({ children }: { children: React.ReactNode }) {
  const t = useTranslations('LegalNoticeDialog')
  const formatter = useFormatter()
  const data = useLegalNotice()

  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated)
    : new Date(Date.UTC(2025, 11, 4))

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
          <DialogTitle>{data?.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 text-sm leading-6">
          <p className="text-muted-foreground text-xs">
            {t('last_updated', {
              date: formatter.dateTime(lastUpdated, {
                dateStyle: 'long'
              })
            })}
          </p>
          {data?.content ? (
            <div className="space-y-2">
              <PortableText
                value={data.content}
                components={legalContentComponents}
              />
            </div>
          ) : null}
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
