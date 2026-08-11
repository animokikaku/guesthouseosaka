'use client'

import { EllipsisHorizontalIcon } from '@sanity/icons/EllipsisHorizontal'
import { SyncIcon } from '@sanity/icons/Sync'
import { TrashIcon } from '@sanity/icons/Trash'
import { Box, Button, Card, Flex, Text } from '@sanity/ui'
import { Autocomplete, type BaseAutocompleteOption } from '@sanity/ui/autocomplete'
import { Menu, MenuItem } from '@sanity/ui/menu'
import { Popover } from '@sanity/ui/popover'
import { type ComponentType, type SVGProps, useId, useState } from 'react'
import { definePlugin, defineType, set, type StringInputProps, unset } from 'sanity'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

interface LucideIconPickerOptions {
  icons: Record<string, IconComponent>
}

interface IconOption extends BaseAutocompleteOption {
  value: string
  icon: IconComponent
  tags: string[]
}

function getAllowedIcons(options: StringInputProps['schemaType']['options']): string[] | undefined {
  if (!options || !('allowedIcons' in options) || !Array.isArray(options.allowedIcons)) {
    return undefined
  }

  return options.allowedIcons.filter((iconName): iconName is string => typeof iconName === 'string')
}

function IconOptionCard({ option }: { option: IconOption }) {
  const Icon = option.icon

  return (
    <Card as="button" padding={2} radius={2} tone="inherit" type="button">
      <Flex align="center" gap={3}>
        <Box style={{ display: 'flex', alignItems: 'center', fontSize: '1.2em' }}>
          <Icon aria-hidden width="1.5em" height="1.5em" />
        </Box>
        <Text size={1} weight="medium">
          {option.value}
        </Text>
      </Flex>
    </Card>
  )
}

interface SelectedIconCardProps {
  option: IconOption
  readOnly: boolean
  onClear: () => void
  onReplace: () => void
}

function SelectedIconCard({ option, readOnly, onClear, onReplace }: SelectedIconCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const Icon = option.icon

  return (
    <Card
      border
      padding={1}
      radius={2}
      tone="default"
      onClick={() => {
        if (!readOnly) onReplace()
      }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={2} padding={2}>
          <Box style={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem' }}>
            <Icon aria-hidden width="1.25rem" height="1.25rem" />
          </Box>
          <Text size={1} weight="medium">
            {option.value}
          </Text>
        </Flex>
        {!readOnly && (
          <Popover
            constrainSize
            content={
              <Menu>
                <MenuItem
                  icon={TrashIcon}
                  text="Clear"
                  tone="critical"
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsMenuOpen(false)
                    onClear()
                  }}
                />
                <MenuItem
                  icon={SyncIcon}
                  text="Replace"
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsMenuOpen(false)
                    onReplace()
                  }}
                />
              </Menu>
            }
            open={isMenuOpen}
            portal
          >
            <Button
              aria-label="Icon actions"
              icon={EllipsisHorizontalIcon}
              mode="bleed"
              padding={2}
              title="Icon actions"
              onClick={(event) => {
                event.stopPropagation()
                setIsMenuOpen((open) => !open)
              }}
            />
          </Popover>
        )}
      </Flex>
    </Card>
  )
}

function LucideIconInput({
  iconOptions,
  schemaType,
  value,
  readOnly = false,
  onChange
}: StringInputProps & { iconOptions: IconOption[] }) {
  const inputId = useId()
  const [isReplacing, setIsReplacing] = useState(false)
  const allowedIcons = getAllowedIcons(schemaType.options)
  const allowedIconSet = allowedIcons ? new Set(allowedIcons) : undefined
  const options = allowedIconSet
    ? iconOptions.filter((option) => allowedIconSet.has(option.value))
    : iconOptions
  const selectedOption = options.find((option) => option.value === value)

  const clear = () => {
    onChange(unset())
    setIsReplacing(false)
  }

  if (value && !isReplacing) {
    if (selectedOption) {
      return (
        <SelectedIconCard
          option={selectedOption}
          readOnly={readOnly}
          onClear={clear}
          onReplace={() => setIsReplacing(true)}
        />
      )
    }

    return (
      <Card
        border
        padding={1}
        radius={2}
        tone="caution"
        onClick={() => {
          if (!readOnly) setIsReplacing(true)
        }}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2} padding={2}>
            <Text size={1} muted>
              ?
            </Text>
            <Text size={1} weight="medium">
              {value} — not found
            </Text>
          </Flex>
          {!readOnly && (
            <Button
              aria-label="Clear invalid icon"
              icon={TrashIcon}
              mode="ghost"
              tone="critical"
              title="Clear invalid icon"
              onClick={(event) => {
                event.stopPropagation()
                clear()
              }}
            />
          )}
        </Flex>
      </Card>
    )
  }

  return (
    <Autocomplete<IconOption>
      id={inputId}
      disabled={readOnly}
      filterOption={(query, option) => {
        const searchTerm = query.trim().toLowerCase()
        return option.tags.some((tag) => tag.includes(searchTerm))
      }}
      openButton
      options={options}
      placeholder={isReplacing ? 'Replace icon…' : 'Search for an icon…'}
      renderOption={(option) => <IconOptionCard option={option} />}
      value={isReplacing ? selectedOption?.value : undefined}
      onBlur={() => setIsReplacing(false)}
      onChange={(selectedValue) => {
        onChange(set(selectedValue))
        setIsReplacing(false)
      }}
    />
  )
}

export const lucideIconPicker = definePlugin(({ icons }: LucideIconPickerOptions) => {
  const iconOptions: IconOption[] = Object.entries(icons).map(([name, icon]) => ({
    value: name,
    icon,
    tags: [name, ...name.split('-')]
  }))

  function ConfiguredLucideIconInput(props: StringInputProps) {
    return <LucideIconInput {...props} iconOptions={iconOptions} />
  }

  const lucideIconType = defineType({
    name: 'lucide-icon',
    type: 'string',
    components: { input: ConfiguredLucideIconInput }
  })

  return {
    name: 'lucide-icon-picker',
    schema: { types: [lucideIconType] }
  }
})
