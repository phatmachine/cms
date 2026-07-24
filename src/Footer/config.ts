import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    description: 'The light "Stone" footer shown at the bottom of every page.',
  },
  fields: [
    {
      name: 'statement',
      type: 'textarea',
      defaultValue: 'We built machines to think. We did not expect to feel toward them.',
      label: 'Statement',
    },
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'Rethink the machine',
      label: 'Brand wordmark',
    },
    {
      name: 'missionLine',
      type: 'textarea',
      defaultValue:
        'A study of the gap between mind and model — and what it costs us to close it.',
      label: 'Mission line',
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Link columns',
      maxRows: 4,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#ColumnRowLabel',
        },
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: '@/Footer/RowLabel#RowLabel',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: '© 2026 Rethink the Machine',
          admin: { width: '50%' },
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'A body knows what a model cannot.',
          admin: { width: '50%' },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
