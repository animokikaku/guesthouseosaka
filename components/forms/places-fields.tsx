'use client'

import { defineAppFieldGroup } from '@/components/forms/app-form'
import { HouseIcon } from '@/components/house-icon'
import type { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/utils/theme'
import type { HousesTitlesQueryResult } from '@/sanity.types'

const placesFieldGroup = defineAppFieldGroup(({ strict }) => ({
  places: strict<HouseIdentifier[]>()
}))

interface PlacesFieldsProps {
  fields: typeof placesFieldGroup.fields
  label: string
  description?: string
  houseTitles: HousesTitlesQueryResult
}

function PlacesFields({ fields, description, label, houseTitles }: PlacesFieldsProps) {
  const placeOptions = houseTitles.map(({ slug, title }) => ({
    value: slug,
    label: (
      <>
        <HouseIcon name={slug} strokeWidth={1.25} />
        <span className="text-muted-foreground sm:text-inherit">{title ?? slug}</span>
      </>
    ),
    className: cn('data-pressed:bg-transparent', HOUSE_COLORS[slug].toggleSvg)
  }))

  return (
    <fields.Field
      name="places"
      children={(field) => (
        <field.ToggleGroupField label={label} description={description} options={placeOptions} />
      )}
    />
  )
}

export const FieldGroupPlaces = placesFieldGroup.bindComponent(PlacesFields, 'fields')
