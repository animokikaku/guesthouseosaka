'use client'

import { useRouter } from '@/i18n/navigation'
import { useDraftModeEnvironment } from 'next-sanity/hooks'
import { LoaderCircle, X } from 'lucide-react'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'
import { cn } from '@/lib/utils'

async function disableDraftMode() {
  await fetch('/api/draft-mode/disable')
}

export function DraftModeIndicator() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const environment = useDraftModeEnvironment()

  // Only show when in standalone preview mode (not inside Presentation Tool)
  if (environment !== 'live' && environment !== 'unknown') {
    return null
  }

  const handleDisable = () => {
    startTransition(async () => {
      await disableDraftMode()
      router.refresh()
    })
  }

  return (
    <div
      className={cn(
        'fixed top-3 left-1/2 z-50 -translate-x-1/2',
        'animate-in fade-in slide-in-from-top-1 duration-500 ease-out'
      )}
    >
      <ButtonGroup
        className={cn(
          'relative overflow-hidden rounded-full shadow-2xl',
          'bg-zinc-900 ring-1 ring-white/10',
          'before:pointer-events-none before:absolute before:inset-0 before:rounded-full',
          'before:bg-linear-to-r before:from-rose-500/20 before:via-transparent before:via-40% before:to-transparent'
        )}
      >
        {/* Live indicator */}
        <ButtonGroupText
          className={cn(
            'border-none bg-transparent shadow-none',
            'py-1.5 pr-0.5 pl-3'
          )}
        >
          <span className="relative flex size-2 mr-1">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
          </span>
          <span className="font-mono text-xs font-medium tracking-widest text-zinc-300 uppercase">
            Preview
          </span>
        </ButtonGroupText>

        {/* Exit button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDisable}
          disabled={isPending}
          className={cn(
            'rounded-l-none rounded-r-full border-none',
            'text-zinc-400',
            'hover:bg-zinc-800 hover:text-zinc-100',
            'focus-visible:ring-rose-500/50'
          )}
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <X className="size-4" />
          )}
        </Button>
      </ButtonGroup>
    </div>
  )
}
