import type { Block } from 'payload'

export const ComparisonTable: Block = {
  slug: 'comparisonTable',
  interfaceName: 'ComparisonTableBlock',
  labels: {
    plural: 'Comparison Tables',
    singular: 'Comparison Table',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the heading, e.g. "How they compare"' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      minRows: 2,
      maxRows: 4,
      admin: {
        description:
          'The products being compared, left to right — usually the mainstream app first, then the alternative(s).',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: { width: '70%' },
              required: true,
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              admin: { width: '30%' },
              label: 'Highlight this column',
            },
          ],
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Rows',
      minRows: 1,
      admin: {
        description: 'Add one cell per row, in the same order as the columns above.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'cells',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  admin: { width: '40%' },
                  defaultValue: 'yes',
                  options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'Partial', value: 'partial' },
                    { label: 'No', value: 'no' },
                  ],
                },
                {
                  name: 'note',
                  type: 'text',
                  admin: { description: 'Optional short note shown under the icon', width: '60%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
