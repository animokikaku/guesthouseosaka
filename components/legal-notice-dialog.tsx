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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { useLegalNotice } from '@/hooks/use-legal-notice'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { useFormatter, useTranslations } from 'next-intl'

const legalContentComponents: PortableTextComponents = {
  block: {
    h3: ({ children }) => <h3 className="mt-6 mb-3 text-base font-semibold">{children}</h3>,
    normal: ({ children }) => <p>{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  }
}

type LegalNoticeDialogProps = {
  children: React.ReactNode
  onAgree?: () => void
}

export function LegalNoticeDialog({ children, onAgree }: LegalNoticeDialogProps) {
  const t = useTranslations('LegalNoticeDialog')
  const formatter = useFormatter()
  const data = useLegalNotice()
  const isMobile = useIsMobile()

  // Fallback to initial policy publication date if lastUpdated is not set
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated)
    : new Date(Date.UTC(2025, 11, 4))

  const trigger = (
    <Button variant="link" size="sm" className="h-auto px-0 font-medium underline-offset-4">
      {children}
    </Button>
  )

  const content = (
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
          <PortableText value={data.content} components={legalContentComponents} />
        </div>
      ) : null}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{data?.title}</DrawerTitle>
            <DrawerDescription className="sr-only">{t('description')}</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">
            {content}
            {onAgree && (
              <DrawerClose asChild>
                <Button onClick={onAgree} className="mt-6 w-full">
                  {t('agree_button')}
                </Button>
              </DrawerClose>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{data?.title}</DialogTitle>
          <DialogDescription className="sr-only">{t('description')}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="secondary">{t('close_button')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
