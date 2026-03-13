/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineCliConfig } from 'sanity/cli'
import { mergeConfig } from 'vite'
import { sanityDataset, sanityProjectId } from './sanity/env'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineCliConfig({
  api: {
    projectId: sanityProjectId,
    dataset: sanityDataset
  },
  vite: (config) =>
    mergeConfig(config, {
      envPrefix: ['SANITY_STUDIO_', 'NEXT_PUBLIC_'],
      resolve: {
        alias: {
          '@': rootDir
        }
      }
    }),
  typegen: {
    path: [
      './**/*.{ts,tsx,js,jsx}',
      '!node_modules',
      '!.next',
      '!dist',
      '!**/__tests__/**',
      '!**/*.test.{ts,tsx,js,jsx}',
      '!**/*.spec.{ts,tsx,js,jsx}'
    ], // glob pattern to your typescript files. Can also be an array of paths
    schema: './schema.json', // path to your schema file, generated with 'sanity schema extract' command
    generates: './sanity.types.ts', // path to the output file for generated type definitions
    overloadClientMethods: true // set to false to disable automatic overloading the sanity client
  }
})
