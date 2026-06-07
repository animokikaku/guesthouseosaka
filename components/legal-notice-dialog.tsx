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
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useLegalNotice } from '@/hooks/use-legal-notice'
import { useIsMobile } from '@/hooks/use-mobile'
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
  const lastUpdatedText = t('last_updated', {
    date: formatter.dateTime(lastUpdated, {
      dateStyle: 'long'
    })
  })

  const trigger = (
    <Button variant="link" size="sm" className="h-auto px-0 font-medium underline-offset-4">
      {children}
    </Button>
  )

  const content = (
    <div className="space-y-6 text-sm leading-6">
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
        <DrawerTrigger render={trigger} />
        <DrawerPopup>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{data?.title}</DrawerTitle>
              <DrawerDescription>{lastUpdatedText}</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="pb-8">{content}</DrawerBody>
            {onAgree ? (
              <DrawerFooter>
                <DrawerClose render={<Button onClick={onAgree} className="w-full" />}>
                  {t('agree_button')}
                </DrawerClose>
              </DrawerFooter>
            ) : null}
          </DrawerContent>
        </DrawerPopup>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{data?.title}</DialogTitle>
          <DialogDescription>{lastUpdatedText}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-y-auto">{content}</div>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>{t('close_button')}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
