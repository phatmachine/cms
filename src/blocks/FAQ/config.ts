import type { Block } from 'payload'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    plural: 'FAQ Sections',
    singular: 'FAQ',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the heading, e.g. "Questions"' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Questions',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
}
