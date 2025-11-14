import { routing } from '@/i18n/routing'
import { HouseIdentifierSchema } from '@/lib/types'
import { Metadata } from 'next'
import { getExtracted } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'
import z from 'zod'

const ParamsSchema = z.object({
  locale: z.enum(routing.locales),
  house: HouseIdentifierSchema
})

export function generateStaticParams() {
  const houses = HouseIdentifierSchema.options
  return routing.locales.flatMap((locale) =>
    houses.map((house) => ({ locale, house }))
  )
}

export async function validateParams(params: Promise<unknown>) {
  const { success, data } = ParamsSchema.safeParse(await params)
  if (!success) {
    notFound()
  }
  return data
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/[house]'>, 'children'>
): Promise<Metadata> {
  const { locale, house } = await validateParams(props.params)
  const t = await getExtracted({ locale })

  switch (house) {
    case 'orange':
      return {
        title: t('Orange House'),
        description: t('Relaxed spacious Japanese-style lounge')
      }
    case 'apple':
      return {
        title: t('Apple House'),
        description: t('Share house 8 minutes walk from Namba Station')
      }
    case 'lemon':
      return {
        title: t('Lemon House'),
        description: t('Well-equipped private rooms and a luxurious lounge')
      }
  }
}

export default function HouseLayout({
  children,
  modal
}: LayoutProps<'/[locale]/[house]'> & {
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
