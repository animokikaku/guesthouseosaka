import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { cn } from 'cn/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export default defineConfig({
  root: projectRoot,
  cacheDir: 'node_modules/.vite-playwright-components',
  plugins: [
    tailwindcss(),
    react(),
    cn({ content: ['{app,components,lib}/**/*.{ts,tsx}'], out: 'generated/cn-tables.ts' })
  ],
  optimizeDeps: {
    entries: ['app/**/*.story.tsx', 'components/**/*.story.tsx']
  },
  resolve: {
    alias: [
      {
        find: '@/sanity/lib/image',
        replacement: path.resolve(projectRoot, 'playwright/gallery/sanity-image.ts')
      },
      {
        find: /^@tanstack\/react-router$/,
        replacement: path.resolve(projectRoot, 'playwright/gallery/router.tsx')
      },
      {
        find: '@',
        replacement: projectRoot
      }
    ]
  }
})
