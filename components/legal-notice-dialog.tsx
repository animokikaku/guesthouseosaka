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
import { useExtracted } from 'next-intl'

export function LegalNoticeDialog({ children }: { children: React.ReactNode }) {
  const t = useExtracted()
  const intro = [
    t(
      'Animo Kikaku Co., Ltd. (“the Company”, “we”, “our”, or “us”) respects your privacy and is committed to protecting your personal information.'
    ),
    t(
      'This Privacy Policy explains how we collect, use, store, and protect the information you provide through the contact forms and other features on this website (“the Service”).'
    )
  ]
  const sections = [
    {
      title: t('1. Information We Collect'),
      paragraphs: [
        t(
          'When you contact us through the Service, we may collect the following personal information:'
        )
      ],
      list: [
        t(
          'Basic details: your name, age, gender, nationality, email address, and (optionally) telephone number'
        ),
        t(
          'Inquiry details: message content, questions, and form submission data'
        ),
        t(
          'Accommodation details: preferred tour dates, move-in dates, and housing preferences'
        )
      ],
      closing: t(
        'We collect this information directly from you when you submit a form or communicate with us.'
      )
    },
    {
      title: t('2. How We Use Your Information'),
      paragraphs: [
        t(
          'We use your personal information only for legitimate business purposes, including:'
        )
      ],
      list: [
        t('Responding to your inquiries or requests'),
        t('Arranging property tours and managing move-in procedures'),
        t('Providing information, updates, and support related to the Service'),
        t(
          'Maintaining internal records necessary for business operations and compliance'
        )
      ],
      closing: t(
        'We do not use your information for marketing purposes without your explicit consent.'
      )
    },
    {
      title: t('3. Retention Period'),
      paragraphs: [
        t(
          'We retain your personal information only as long as necessary to fulfill the purposes described above.'
        ),
        t(
          'Generally, this means up to 10 years after your business relationship with us ends.'
        ),
        t(
          'After this period, the information will be securely deleted or anonymized.'
        )
      ]
    },
    {
      title: t('4. Sharing and International Transfers'),
      paragraphs: [
        t(
          'We do not share or sell your personal information to third parties.'
        ),
        t(
          'Your data will not be transferred outside Japan without your consent, unless required by law or necessary to protect legal rights in accordance with the Act on the Protection of Personal Information (APPI) and other applicable regulations.'
        )
      ]
    },
    {
      title: t('5. Your Rights'),
      paragraphs: [t('You have the right to:')],
      list: [
        t('Request access to the personal information we hold about you'),
        t(
          'Request correction, addition, or deletion of inaccurate or outdated information'
        ),
        t(
          'Withdraw your consent to the processing of your information (where applicable)'
        )
      ],
      closing: t(
        'We will respond promptly and transparently to all legitimate requests in accordance with Japanese privacy law.'
      )
    },
    {
      title: t('6. Security Measures'),
      paragraphs: [
        t(
          'We take appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, misuse, alteration, or disclosure.'
        ),
        t('Access to personal data is restricted to authorized personnel only.')
      ]
    },
    {
      title: t('7. Contact Us'),
      paragraphs: [
        t(
          'If you have any questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact us at:'
        )
      ],
      details: [
        t('Animo Kikaku Co., Ltd.'),
        t('1-21-21 Hannancho, Abeno-ku, Osaka, Japan'),
        t('📧 orange@guesthouseosaka.com'),
        t('👤 Representative Director: Kenji Hisamoto')
      ]
    },
    {
      title: t('8. Changes to This Policy'),
      paragraphs: [
        t('We may update this Privacy Policy from time to time.'),
        t(
          'Any significant changes will be announced on this page, with the updated date clearly indicated.'
        )
      ]
    }
  ]

  const lastUpdated = t('Last updated: November 2025')

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
          <DialogTitle>{t('Privacy Policy')}</DialogTitle>
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
            <Button variant="secondary">{t('Close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
