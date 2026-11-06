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
  // Pre-bundle everything up front: a dependency found later, while a test is
  // mounting its story, makes Vite reload the page and destroys the test's context.
  optimizeDeps: {
    entries: ['playwright/gallery/main.tsx', 'app/**/*.story.tsx', 'components/**/*.story.tsx']
  },
  // CI runs the production build alongside this server, and `root` is the repo:
  // its output would otherwise reload every open page.
  server: {
    watch: { ignored: ['**/.cloudflare/**', '**/dist/**'] }
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
