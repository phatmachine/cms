import type { Block } from 'payload'

import { link } from '@/fields/link'

export const Options: Block = {
  slug: 'options',
  interfaceName: 'OptionsBlock',
  labels: {
    plural: 'Options Sections',
    singular: 'The Options',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the heading, e.g. "The options"' },
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
      name: 'options',
      type: 'array',
      label: 'Recommended alternatives',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              admin: { width: '70%' },
              required: true,
            },
            {
              name: 'badge',
              type: 'select',
              admin: { width: '30%' },
              defaultValue: 'none',
              options: [
                { label: 'None', value: 'none' },
                { label: "Editor's pick", value: 'editor-pick' },
                { label: 'Free', value: 'free' },
                { label: 'Open source', value: 'open-source' },
              ],
            },
          ],
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'tagline',
          type: 'text',
          admin: { description: 'Short line, e.g. "Encrypted email that respects you."' },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'price',
          type: 'text',
          admin: { description: 'e.g. "Free" or "From $4/mo"' },
        },
        link({ appearances: false }),
      ],
    },
  ],
}
