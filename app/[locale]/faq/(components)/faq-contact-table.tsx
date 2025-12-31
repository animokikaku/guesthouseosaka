'use client'

import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '@/components/ui/item'
import type { HousesBuildingQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import { getImageDimensions, type SanityImageSource } from '@sanity/asset-utils'
import { Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type House = Pick<
  NonNullable<HousesBuildingQueryResult>[number],
  'title' | 'slug' | 'phone' | 'image'
>

type FAQContactTableProps = {
  houses: House[]
}

export function FAQContactTable({ houses }: FAQContactTableProps) {
  return (
    <>
      {/* Mobile: Item cards */}
      <MobilePhoneCards houses={houses} />
      {/* Desktop: Table */}
      <DesktopPhoneTable houses={houses} />
    </>
  )
}

function MobilePhoneCards({ houses }: FAQContactTableProps) {
  return (
    <ItemGroup id="phone" className="w-full gap-2 sm:hidden">
      {houses.map(({ title, slug, phone, image }) => {
        const phoneNumber = phone?.international
        if (!phoneNumber) return null

        return (
          <Item
            key={slug}
            variant="outline"
            asChild
            className="gap-3 px-3 py-3"
          >
            <a href={`tel:${phoneNumber}`}>
              <ItemMedia variant="image" className="size-12 rounded-sm">
                {image?.asset && (
                  <HouseImage image={image} alt={title ?? slug} />
                )}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{title ?? slug}</ItemTitle>
                <ItemDescription className="font-mono">
                  {phoneNumber}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  size="icon"
                  variant="outline"
                  className="pointer-events-none rounded-full"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <Phone className="size-4" />
                </Button>
              </ItemActions>
            </a>
          </Item>
        )
      })}
    </ItemGroup>
  )
}

function DesktopPhoneTable({ houses }: FAQContactTableProps) {
  const t = useTranslations('FAQContactTable')

  const phones = houses.map(({ title, slug, phone }) => ({
    title: title ?? slug,
    withinJapan: phone?.domestic,
    overseas: phone?.international
  }))

  return (
    <table id="phone" className="hidden border-collapse text-sm sm:table">
      <thead>
        <tr>
          <th className="border-border border-b p-2 text-left"></th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('within_japan')}
          </th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('from_overseas')}
          </th>
        </tr>
      </thead>
      <tbody className="font-mono">
        {phones.map(({ title, withinJapan, overseas }) => (
          <tr
            className="border-border/50 last:border-border border-none"
            key={title}
          >
            <td className="text-muted-foreground p-2 text-right font-sans">
              {title}
            </td>
            <td className="p-2 text-center">
              <a
                href={`tel:${withinJapan}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {withinJapan}
              </a>
            </td>
            <td className="p-2 text-center">
              <a
                href={`tel:${overseas}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {overseas}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type HouseImageProps = {
  image: NonNullable<House['image']>
  alt: string
}

function HouseImage({ image, alt }: HouseImageProps) {
  if (!image.asset) return null

  const dimensions = getImageDimensions(image.asset as SanityImageSource)
  const src = urlFor(image).fit('crop').width(96).height(96).url()

  return (
    <Image
      src={src}
      alt={alt}
      placeholder={image.lqip ? "blur" : undefined}
      blurDataURL={image.lqip ?? undefined}
      width={dimensions.width}
      height={dimensions.height}
      className="size-full object-cover"
    />
  )
}
