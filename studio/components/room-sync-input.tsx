/**
 * The Site Settings field that syncs room availability from shares.house now,
 * rather than at the next hourly run (see docs/rooms.md). It stores nothing.
 * The site checks the request with a preview secret the signed-in user
 * creates, as Presentation does, so the Studio holds no token.
 */
import { z } from '@/lib/zod'
import { siteUrl } from '@/studio/site-url'
import { SyncIcon } from '@sanity/icons/Sync'
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret'
import { Badge, Box, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import { useState } from 'react'
import { useClient, useCurrentUser } from 'sanity'

/** What `/api/sync-rooms` answers, with 200 or 502. */
const syncResponseSchema = z.object({
  results: z.array(
    z.union([
      z.object({
        house: z.string(),
        url: z.string(),
        ok: z.literal(true),
        rooms: z.number(),
        changed: z.number()
      }),
      z.object({ house: z.string(), url: z.string(), ok: z.literal(false), error: z.string() })
    ])
  ),
  purge: z.enum(['purged', 'skipped', 'failed'])
})

type State =
  | { status: 'idle' }
  | ({ status: 'done' } & z.infer<typeof syncResponseSchema>)
  | { status: 'syncing' }
  | { status: 'error'; message: string }

function houseName(house: string) {
  return house.charAt(0).toUpperCase() + house.slice(1)
}

function describeError(error: string) {
  // shares.house refuses requests that don't come from Japan.
  return error.includes('HTTP 403')
    ? `shares.house refused the request (${error}). It only answers from Japan; the hourly sync will try again.`
    : error
}

export function RoomSyncInput() {
  const client = useClient({ apiVersion: '2025-02-19' })
  const user = useCurrentUser()
  const [state, setState] = useState<State>({ status: 'idle' })

  async function sync() {
    setState({ status: 'syncing' })
    try {
      const { secret } = await createPreviewSecret(
        client,
        'guesthouseosaka/room-sync',
        location.origin,
        user?.id
      )
      // A text body, so the cross-origin request needs no preflight.
      const response = await fetch(new URL('/api/sync-rooms', siteUrl), {
        method: 'POST',
        body: secret
      }).catch(() => null)
      // The browser hides why: the site is down, unreachable, or refused the Studio's origin.
      if (!response) {
        setState({ status: 'error', message: `The Studio couldn’t reach the site at ${siteUrl}.` })
        return
      }
      if (response.status === 401) {
        setState({ status: 'error', message: 'The site couldn’t verify your Studio session.' })
        return
      }
      setState({ status: 'done', ...syncResponseSchema.parse(await response.json()) })
    } catch (error) {
      setState({
        status: 'error',
        message: `The sync couldn’t run: ${error instanceof Error ? error.message : String(error)}`
      })
    }
  }

  return (
    <Stack gap={4}>
      <Flex>
        <Button
          icon={SyncIcon}
          text={state.status === 'syncing' ? 'Syncing…' : 'Sync now'}
          tone="primary"
          loading={state.status === 'syncing'}
          disabled={state.status === 'syncing'}
          onClick={sync}
        />
      </Flex>

      {state.status === 'error' && (
        <Card padding={3} radius={2} tone="critical" border>
          <Text size={1}>{state.message}</Text>
        </Card>
      )}

      {state.status === 'done' && (
        <Stack gap={3}>
          {state.results.map((result) => (
            <Card
              key={result.url}
              padding={3}
              radius={2}
              border
              tone={result.ok ? 'default' : 'critical'}
            >
              <Flex align="center" gap={3}>
                <Box flex={1}>
                  <Stack gap={2}>
                    <Text weight="semibold">{houseName(result.house)}</Text>
                    <Text size={1} muted>
                      {result.ok
                        ? `${result.rooms} rooms, ${result.changed === 0 ? 'no changes' : `${result.changed} changed`}`
                        : describeError(result.error)}
                    </Text>
                  </Stack>
                </Box>
                <Badge tone={result.ok ? 'positive' : 'critical'}>
                  {result.ok ? 'Synced' : 'Failed'}
                </Badge>
              </Flex>
            </Card>
          ))}
          <Text size={1} muted>
            {state.purge === 'purged'
              ? 'The house pages now show the latest availability.'
              : state.purge === 'skipped'
                ? 'The house pages were already up to date.'
                : 'The house pages couldn’t be refreshed; the next sync will try again.'}
          </Text>
        </Stack>
      )}
    </Stack>
  )
}
