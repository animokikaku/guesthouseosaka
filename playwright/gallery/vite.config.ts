import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export default defineConfig({
  root: projectRoot,
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'next/image',
        replacement: path.resolve(projectRoot, 'playwright/gallery/next-image.tsx')
      },
      {
        find: '@/sanity/lib/image',
        replacement: path.resolve(projectRoot, 'playwright/gallery/sanity-image.ts')
      },
      {
        find: '@',
        replacement: projectRoot
      }
    ]
  }
})
