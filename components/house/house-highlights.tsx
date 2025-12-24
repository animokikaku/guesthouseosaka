'use client'

import { useNestedOptimistic } from '@/hooks/use-optimistic'
import type { HouseQueryResult } from '@/sanity.types'

interface HouseHighlightsData extends Pick<
  NonNullable<HouseQueryResult>,
  '_id' | '_type'
> {
  highlights: NonNullable<NonNullable<HouseQueryResult>['about']>['highlights']
}

export function HouseHighlights({ data }: { data: HouseHighlightsData }) {
  const [highlights, attr] = useNestedOptimistic(
    { _id: data._id, _type: data._type },
    'about.highlights',
    data.highlights
  )

  if (!highlights || highlights.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <ul className="space-y-2" data-sanity={attr.list()}>
        {highlights.map((highlight) => (
          <li
            key={highlight._key}
            className="flex items-start gap-3"
            data-sanity={attr.item(highlight._key)}
          >
            <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
            <span className="text-foreground">{highlight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
