import '@/app/globals.css'

import { createRoot } from 'react-dom/client'
import type { ComponentType } from 'react'

type Story = ComponentType<Record<string, unknown>>
type MountParams = {
  story: string
  props?: Record<string, unknown>
}

function isStory(value: unknown): value is Story {
  return typeof value === 'function'
}

const storyModules = import.meta.glob('../../components/**/*.story.tsx')

const rootElement = document.querySelector('#root')

if (!(rootElement instanceof HTMLElement)) {
  throw new Error('The component gallery requires a #root element.')
}

const root = createRoot(rootElement)

window.mount = async ({ story, props = {} }: MountParams) => {
  const separatorIndex = story.lastIndexOf('/')
  const componentPath = story.slice(0, separatorIndex)
  const exportName = story.slice(separatorIndex + 1)
  const loadStoryModule = storyModules[`../../${componentPath}.story.tsx`]

  if (!loadStoryModule) {
    throw new Error(`Unknown component story: ${story}`)
  }

  const storyModule = await loadStoryModule()
  const descriptor =
    typeof storyModule === 'object' && storyModule !== null
      ? Object.getOwnPropertyDescriptor(storyModule, exportName)
      : undefined
  const Story = descriptor?.value

  if (!isStory(Story)) {
    throw new Error(`Unknown component story export: ${story}`)
  }

  root.render(<Story {...props} />)
}

window.unmount = async () => {
  root.render(null)
}
