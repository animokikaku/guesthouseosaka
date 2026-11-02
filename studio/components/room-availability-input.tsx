/**
 * Site Settings' Room Availability field: headed as the Studio heads other
 * fields, with its "…" menu (see `room-availability-actions.ts`) to show or
 * hide the rooms and sync them now. A card lists each house's sync status,
 * on or off (see docs/rooms.md).
 */
import { z } from '@/lib/zod'
import { siteUrl } from '@/studio/site-url'
import { DotIcon } from '@sanity/icons/Dot'
import { HomeIcon } from '@sanity/icons/Home'
import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { Tooltip } from '@sanity/ui/tooltip'
import { useEffect, useState, type ComponentProps } from 'react'
import { useIntentLink } from 'sanity/router'
import {
  DefaultPreview,
  FormField,
  PreviewCard,
  useClient,
  useFieldActions,
  type BooleanInputProps,
  type SanityClient
} from 'sanity'
import { useRoomSync, type SyncResult } from './room-sync'

const SHARES_HOUSE = 'shares.house'

/** What `GET /api/sync-rooms` answers: each house's last sync, and whether the site shows its rooms. */
const statusesSchema = z.object({
  houses: z.array(
    z.object({
      house: z.string(),
      syncedAt: z.nullable(z.string()),
      rooms: z.number(),
      fresh: z.boolean()
    })
  )
})

type HouseStatus = z.infer<typeof statusesSchema>['houses'][number]

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** "5 minutes ago", "2 hours ago", "yesterday"… */
function timeAgo(date: Date) {
  const seconds = (date.getTime() - Date.now()) / 1000
  const units = [
    ['day', 86_400],
    ['hour', 3600],
    ['minute', 60]
  ] as const
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relativeTime.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

/** Renders again every minute, so a time ago stays right while the Studio is open. */
function useMinuteTick() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick((tick) => tick + 1), 60_000)
    return () => clearInterval(timer)
  }, [])
}

/** Each house's English title and hero image (a thumbnail URL), by its ID (`orange`…). */
interface HousePreview {
  _id: string
  title: string | null
  image: string | null
}

type HousePreviews = Record<string, HousePreview>

const housesQuery = `*[_type == "house"]{
  _id,
  slug,
  "title": coalesce(title[language == "en"][0].value, title[0].value),
  "image": image.asset->url + "?w=66&h=66&fit=crop&auto=format"
}`

interface Houses {
  /** From the site; undefined when it can't say. */
  statuses: HouseStatus[] | undefined
  /** From the dataset; empty when it fails, and the rows show the IDs, capitalized, and an icon. */
  previews: HousePreviews
}

async function loadHouses(client: SanityClient): Promise<Houses> {
  const [statuses, previews] = await Promise.all([
    fetch(new URL('/api/sync-rooms', siteUrl))
      .then(async (response) => statusesSchema.parse(await response.json()).houses)
      .catch(() => undefined),
    client
      .withConfig({ perspective: 'published' })
      .fetch<Array<HousePreview & { slug: string }>>(housesQuery)
      .then((rows) => Object.fromEntries(rows.map(({ slug, ...preview }) => [slug, preview])))
      .catch(() => ({}))
  ])
  return { statuses, previews }
}

/** The houses. Set them again after a sync. */
function useHouses(client: SanityClient) {
  const [houses, setHouses] = useState<Houses>()
  useEffect(() => {
    let current = true
    void loadHouses(client).then((loaded) => current && setHouses(loaded))
    return () => {
      current = false
    }
  }, [client])
  return [houses, setHouses] as const
}

function houseName(house: string) {
  return house.charAt(0).toUpperCase() + house.slice(1)
}

function describeError(error: string) {
  // shares.house refuses requests that don't come from Japan.
  return error.includes('HTTP 403')
    ? `shares.house refused the request (${error}). It only answers from Japan; the hourly sync will try again.`
    : error
}

/**
 * A green or red dot, drawn as the Studio draws a document's state: its dot
 * icon at small text size. `label` names it for screen readers; without, it's
 * hidden from them.
 */
function StatusDot({ ok, label }: { ok: boolean; label?: string }) {
  return (
    <Text size={1}>
      <DotIcon
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        style={{
          color: ok
            ? 'var(--card-badge-positive-dot-color)'
            : 'var(--card-badge-critical-dot-color)'
        }}
      />
    </Text>
  )
}

/** A tooltip with the Studio's own spacing: the card's and the content's, 4px each. */
function StudioTooltip({
  content,
  placement,
  children
}: {
  content: React.ReactNode
  placement: 'top' | 'left'
  children: React.ReactElement
}) {
  return (
    <Tooltip portal padding={1} placement={placement} content={<Box padding={1}>{content}</Box>}>
      {children}
    </Tooltip>
  )
}

/** As the document lists show a document's state: a dot, and on hover, the state and when. */
function SyncStatus({ ok, label, at }: { ok: boolean; label: string; at: Date | null }) {
  useMinuteTick()
  return (
    <StudioTooltip
      placement="left"
      content={
        <Flex align="center" gap={2}>
          <StatusDot ok={ok} />
          <Text size={1}>
            {label}
            {at && (
              <>
                {' - '}
                <span style={{ color: 'var(--card-muted-fg-color)' }}>{timeAgo(at)}</span>
              </>
            )}
          </Text>
        </Flex>
      }
    >
      <Flex>
        <StatusDot ok={ok} label={label} />
      </Flex>
    </StudioTooltip>
  )
}

/**
 * What a house's row says: its listed rooms (with what changed, or why it
 * failed, when this editor just synced), and its dot.
 */
function describeHouse(
  status: HouseStatus,
  result: SyncResult | undefined,
  finishedAt: Date | undefined
) {
  const syncedAt = status.syncedAt === null ? null : new Date(status.syncedAt)
  const rooms = `${status.rooms} rooms`
  if (result && !result.ok) {
    return {
      subtitle: describeError(result.error),
      dot: { ok: false, label: 'Failed', at: finishedAt ?? null }
    }
  }
  if (result) {
    return {
      subtitle: `${rooms}, ${result.changed === 0 ? 'no changes' : `${result.changed} changed`}`,
      dot: { ok: status.fresh, label: 'Synced', at: syncedAt }
    }
  }
  if (!syncedAt) {
    return { subtitle: 'Not synced yet', dot: { ok: false, label: 'Never synced', at: null } }
  }
  // The site hides rooms last synced over two days ago.
  const label = status.fresh ? 'Synced' : 'Out of date, hidden on the site'
  return { subtitle: rooms, dot: { ok: status.fresh, label, at: syncedAt } }
}

/**
 * A house's row, as the Studio lists documents: image, title, subtitle and
 * state, opening the house when clicked (once its document is known).
 */
function HouseRow({
  house,
  preview,
  subtitle,
  dot
}: {
  house: string
  preview: HousePreview | undefined
  subtitle: string
  dot: ComponentProps<typeof SyncStatus>
}) {
  const { href, onClick } = useIntentLink({
    intent: 'edit',
    params: { id: preview?._id ?? '', type: 'house' }
  })
  const row = (
    <DefaultPreview
      title={preview?.title ?? houseName(house)}
      subtitle={subtitle}
      // The house documents' icon when there's no image, as the Studio does.
      media={preview?.image ? <img src={preview.image} alt="" /> : <HomeIcon />}
      status={<SyncStatus {...dot} />}
    />
  )
  if (!preview) return row
  return (
    // No padding of its own: the preview has it, as in the Studio's lists.
    <PreviewCard __unstable_focusRing as="a" href={href} onClick={onClick} radius={2}>
      {row}
    </PreviewCard>
  )
}

/** The description, with shares.house linking to it. */
function withSharesHouseLink(description: BooleanInputProps['schemaType']['description']) {
  if (typeof description !== 'string' || !description.includes(SHARES_HOUSE)) return description
  const [before, after] = description.split(SHARES_HOUSE, 2)
  return (
    <>
      {before}
      <a href={`https://${SHARES_HOUSE}/`} target="_blank" rel="noreferrer">
        {SHARES_HOUSE}
      </a>
      {after}
    </>
  )
}

export function RoomAvailabilityInput({
  id,
  path,
  presence,
  schemaType,
  elementProps,
  validation
}: BooleanInputProps) {
  const { ref: focusRef, onFocus, onBlur } = elementProps
  const client = useClient({ apiVersion: '2025-02-19' })
  const sync = useRoomSync()
  const [houses, setHouses] = useHouses(client)
  const {
    actions,
    focused,
    __internal_comments: comments,
    __internal_slot: slot
  } = useFieldActions()

  // Reloads the houses once a sync this editor started finishes.
  const finishedAt = sync.status === 'done' ? sync.finishedAt : undefined
  useEffect(() => {
    if (!finishedAt) return
    let current = true
    void loadHouses(client).then((loaded) => current && setHouses(loaded))
    return () => {
      current = false
    }
  }, [client, finishedAt, setHouses])

  const done = sync.status === 'done' ? sync : undefined
  const card = Boolean(houses?.statuses || sync.status === 'error' || done?.purge === 'failed')

  return (
    // The Studio's own header, with presence, comments and the "…" menu.
    <FormField
      __unstable_headerActions={actions}
      __unstable_presence={presence}
      __internal_comments={comments}
      __internal_slot={slot}
      inputId={id}
      path={path}
      title={schemaType.title}
      description={withSharesHouseLink(schemaType.description)}
      validation={validation}
    >
      {/*
       * What the Studio focuses, as when Presentation opens this field: there's
       * no switch, only the menu's actions.
       */}
      <Box
        ref={focusRef}
        id={id}
        tabIndex={-1}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ outline: 'none' }}
      >
        {card && (
          <Card
            border
            radius={2}
            // The field has focus: the card shows the focus ring, as an array's
            // does. An outline paints over the sections' backgrounds.
            style={
              focused
                ? { outline: '1px solid var(--card-focus-ring-color)', outlineOffset: -1 }
                : undefined
            }
          >
            {houses?.statuses && (
              <Stack gap={1} padding={1}>
                {houses.statuses.map((status) => {
                  const { subtitle, dot } = describeHouse(
                    status,
                    done?.results.find((result) => result.house === status.house),
                    done?.finishedAt
                  )
                  return (
                    <HouseRow
                      key={status.house}
                      house={status.house}
                      preview={houses.previews[status.house]}
                      subtitle={subtitle}
                      dot={dot}
                    />
                  )
                })}
              </Stack>
            )}

            {sync.status === 'error' && (
              <Card borderTop={Boolean(houses?.statuses)} padding={3} tone="critical">
                <Text size={1}>{sync.message}</Text>
              </Card>
            )}

            {done?.purge === 'failed' && (
              <Card borderTop padding={3} tone="caution">
                <Text size={1}>
                  The house pages couldn’t be refreshed; the next sync will try again.
                </Text>
              </Card>
            )}
          </Card>
        )}
      </Box>
    </FormField>
  )
}
