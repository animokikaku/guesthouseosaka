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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
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
    <div id="phone" className="w-full sm:w-auto">
      {/* Mobile: Item cards */}
      <MobilePhoneCards houses={houses} />
      {/* Desktop: Table */}
      <DesktopPhoneTable houses={houses} />
    </div>
  )
}

function MobilePhoneCards({ houses }: FAQContactTableProps) {
  return (
    <ItemGroup role="presentation" className="w-full gap-2 sm:hidden">
      {houses.map(({ _id, title, phone, image }) => {
        return (
          <Item
            key={_id}
            variant="outline"
            render={
              <a href={`tel:${phone.international}`}>
                <ItemMedia variant="image" className="size-12 rounded-sm">
                  <HouseImage image={image} alt={image.alt ? stegaClean(image.alt) : ''} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{stegaClean(title)}</ItemTitle>
                  <ItemDescription className="font-mono">{phone.international}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    render={<span />}
                    nativeButton={false}
                    size="icon"
                    variant="outline"
                    className="pointer-events-none rounded-full"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <Phone />
                  </Button>
                </ItemActions>
              </a>
            }
            className="gap-3 p-3"
          />
        )
      })}
    </ItemGroup>
  )
}

function DesktopPhoneTable({ houses }: FAQContactTableProps) {
  const t = useTranslations('FAQContactTable')

  return (
    <div className="hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead aria-label={t('house')} />
            <TableHead className="text-muted-foreground text-center font-medium">
              {t('within_japan')}
            </TableHead>
            <TableHead className="text-muted-foreground text-center font-medium">
              {t('from_overseas')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-mono">
          {houses.map(({ _id, title, phone }) => {
            return (
              <TableRow className="border-none" key={_id}>
                <TableCell className="text-muted-foreground text-right font-sans">
                  {stegaClean(title)}
                </TableCell>
                <TableCell className="text-center">
                  <a
                    href={`tel:${phone.domestic}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {phone.domestic}
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <a
                    href={`tel:${phone.international}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {phone.international}
                  </a>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
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
