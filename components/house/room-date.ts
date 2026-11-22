import type { useFormatter } from 'use-intl'

/**
 * A room's date (`YYYY-MM-DD`, in Japan) as the site writes it: "Dec 8", with
 * the year only when it isn't `today`'s.
 */
export function formatRoomDate(
  formatter: ReturnType<typeof useFormatter>,
  date: string,
  today: string
) {
  return formatter.dateTime(new Date(`${date}T00:00:00+09:00`), {
    month: 'short',
    day: 'numeric',
    year: date.slice(0, 4) === today.slice(0, 4) ? undefined : 'numeric'
  })
}
