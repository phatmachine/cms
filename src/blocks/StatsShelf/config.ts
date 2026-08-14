import type { Block } from 'payload'

export const StatsShelf: Block = {
  slug: 'statsShelf',
  interfaceName: 'StatsShelfBlock',
  labels: {
    singular: 'Stats Shelf',
    plural: 'Stats Shelves',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'figure',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "1,200" or "70%"' },
        },
        {
          name: 'claim',
          type: 'textarea',
          required: true,
        },
        {
          name: 'source',
          type: 'text',
        },
      ],
    },
    {
      name: 'footnote',
      type: 'textarea',
      admin: {
        description: 'Small closing note under the stats, e.g. an accuracy/methodology rule.',
      },
    },
  ],
}
