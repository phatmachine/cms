import type { Block } from 'payload'

export const HowToSwitch: Block = {
  slug: 'howToSwitch',
  interfaceName: 'HowToSwitchBlock',
  labels: {
    plural: 'How to Switch Sections',
    singular: 'How to Switch',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the heading, e.g. "How to switch"' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'media',
          type: 'upload',
          admin: { description: 'Optional screenshot shown in the sticky panel on desktop.' },
          relationTo: 'media',
        },
      ],
    },
  ],
}
