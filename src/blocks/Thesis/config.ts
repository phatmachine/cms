import type { Block } from 'payload'

export const Thesis: Block = {
  slug: 'thesis',
  interfaceName: 'ThesisBlock',
  labels: {
    singular: 'Thesis (pinned scroll section)',
    plural: 'Thesis sections',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'The thesis',
    },
    {
      name: 'lineOne',
      type: 'textarea',
      label: 'Headline, line 1',
      required: true,
    },
    {
      name: 'lineTwo',
      type: 'textarea',
      label: 'Headline, line 2 (gold)',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Small caption pinned to the bottom-left, e.g. image credit.',
      },
    },
    {
      name: 'imageA',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background image (start)',
    },
    {
      name: 'imageB',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background image (end)',
    },
  ],
}
