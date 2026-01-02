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
import { getImageDimensions } from '@sanity/asset-utils'
import { Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { stegaClean } from 'next-sanity'
import { default as Image } from 'next/image'

type House = Pick<
  NonNullable<HousesBuildingQueryResult>[number],
  '_id' | 'title' | 'phone' | 'image'
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
      {houses.map(({ _id, title, phone, image }) => {
        return (
          <Item key={_id} variant="outline" asChild className="gap-3 px-3 py-3">
            <a href={`tel:${phone.international}`}>
              <ItemMedia variant="image" className="size-12 rounded-sm">
                <HouseImage
                  image={image}
                  alt={image.alt ? stegaClean(image.alt) : ''}
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{stegaClean(title)}</ItemTitle>
                <ItemDescription className="font-mono">
                  {phone.international ?? 'ー'}
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
        {houses.map(({ _id, title, phone }) => {
          return (
            <tr
              className="border-border/50 last:border-border border-none"
              key={_id}
            >
              <td className="text-muted-foreground p-2 text-right font-sans">
                {stegaClean(title)}
              </td>
              <td className="p-2 text-center">
                <a
                  href={`tel:${phone.domestic}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {phone.domestic ?? 'ー'}
                </a>
              </td>
              <td className="p-2 text-center">
                <a
                  href={`tel:${phone.international}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {phone.international ?? 'ー'}
                </a>
              </td>
            </tr>
          )
        })}
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

  const dimensions = getImageDimensions(image.asset)
  const src = urlFor(image).fit('crop').width(96).height(96).url()

  return (
    <Image
      src={src}
      alt={alt}
      placeholder={image.preview ? 'blur' : undefined}
      blurDataURL={image.preview ?? undefined}
      width={dimensions.width}
      height={dimensions.height}
      className="size-full object-cover"
    />
  )
}
