type ComponentStoryMountParams = {
  story: string
  props?: Record<string, unknown>
}

interface Window {
  mount: (params: ComponentStoryMountParams) => Promise<void>
  unmount: () => Promise<void>
}
