import type { Block } from 'payload'

export const WhySwitch: Block = {
  slug: 'whySwitch',
  interfaceName: 'WhySwitchBlock',
  labels: {
    plural: 'Why Switch Sections',
    singular: 'Why Switch',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the heading, e.g. "Why switch"' },
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
      name: 'benefits',
      type: 'array',
      label: 'Benefits',
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
      ],
    },
  ],
}
