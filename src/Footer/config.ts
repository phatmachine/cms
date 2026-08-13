import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    description: 'The dark "Ember" footer shown at the bottom of every page.',
  },
  fields: [
    {
      name: 'headline',
      type: 'textarea',
      defaultValue: 'Anti-manipulation, not anti-internet.',
      label: 'Headline',
    },
    {
      name: 'subhead',
      type: 'textarea',
      defaultValue:
        'Field notes on attention, on sovereignty, on the choices built into things that were built to feel chosen.',
      label: 'Subhead',
    },
    {
      name: 'missionLine',
      type: 'textarea',
      defaultValue:
        'A study of the gap between mind and model — and what it costs us to close it.',
      label: 'Mission line',
      admin: {
        description: 'Short line under the wordmark, in the brand column.',
      },
    },
    {
      name: 'signatureLine',
      type: 'text',
      defaultValue: 'We go where the patient is.',
      label: 'Signature line',
      admin: {
        description: 'Accent line under the mission line (rendered in gold).',
      },
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
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© 2026 Rethink the Machine',
      label: 'Copyright text',
    },
    {
      name: 'disclosure',
      type: 'textarea',
      defaultValue:
        "No dark patterns on this site: disclosure always, no synthetic anything undeclared, no guilt at your exit. You can leave whenever you want. That's the point.",
      label: 'Disclosure statement',
    },
    linkGroup({
      appearances: false,
      overrides: {
        name: 'legalLinks',
        label: 'Legal links',
        maxRows: 4,
        admin: {
          initCollapsed: true,
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
