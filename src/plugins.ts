import { payloadAiPlugin } from '@ai-stack/payloadcms'
import type { Plugin } from 'payload'

export const plugins: Plugin[] = [
  payloadAiPlugin({
    collections: {
      media: true,
    },
  }),
]
