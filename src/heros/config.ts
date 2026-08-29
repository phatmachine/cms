import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Signal Carousel (campaign homepage)',
          value: 'signalCarousel',
        },
        {
          label: 'Nebula (narrative homepage)',
          value: 'nebula',
        },
        {
          label: 'Paper (human interface homepage)',
          value: 'paper',
        },
      ],
      required: true,
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'nebula' || type === 'paper',
        description: 'Small label above the headline, e.g. "Field notes on a cold intelligence".',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      admin: {
        condition: (_, { type } = {}) => type !== 'signalCarousel',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) =>
            type !== 'signalCarousel' && type !== 'nebula' && type !== 'paper',
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'nebula', 'paper'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'carousel',
      type: 'group',
      label: 'Carousel settings',
      admin: {
        condition: (_, { type } = {}) => type === 'signalCarousel',
      },
      fields: [
        {
          name: 'slides',
          type: 'relationship',
          relationTo: 'slides',
          hasMany: true,
          label: 'Slides',
          admin: {
            description: 'Choose and order the slides shown in the carousel.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'autoAdvanceSeconds',
              type: 'number',
              label: 'Auto-advance (seconds)',
              defaultValue: 7,
              min: 3,
              max: 15,
              admin: { width: '50%' },
            },
            {
              name: 'showThumbnails',
              type: 'checkbox',
              label: 'Show thumbnail strip',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'overlayStrength',
              type: 'number',
              label: 'Scrim overlay strength',
              defaultValue: 0.5,
              min: 0,
              max: 1,
              admin: { step: 0.05, width: '50%' },
            },
            {
              name: 'backdropPattern',
              type: 'select',
              label: 'Backdrop pattern',
              defaultValue: 'points',
              options: [
                { label: 'Points', value: 'points' },
                { label: 'Grid', value: 'grid' },
                { label: 'Lines', value: 'lines' },
                { label: 'None', value: 'none' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'nebulaSettings',
      type: 'group',
      label: 'Nebula settings',
      admin: {
        condition: (_, { type } = {}) => type === 'nebula',
      },
      fields: [
        {
          name: 'stats',
          type: 'array',
          label: 'Stat tiles',
          maxRows: 4,
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'figure',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "1,200"' },
            },
            {
              name: 'caption',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "farewells audited"' },
            },
          ],
        },
        {
          name: 'formButtonLabel',
          type: 'text',
          label: 'Email capture button label',
          defaultValue: 'Notes by email',
        },
      ],
    },
    {
      name: 'paperSettings',
      type: 'group',
      label: 'Paper settings',
      admin: {
        condition: (_, { type } = {}) => type === 'paper',
      },
      fields: [
        {
          name: 'metaLine',
          type: 'text',
          label: 'Meta line (bottom-right, on the image)',
          admin: {
            description: 'e.g. "Est. 2026 / Attention & Sovereignty"',
          },
        },
        {
          name: 'sidebarLabel',
          type: 'text',
          label: 'Vertical sidebar label (bottom-left, reads bottom-to-top)',
          admin: {
            description: 'e.g. "Rethink the Machine // Attention, not capture // Est. 2026"',
          },
        },
      ],
    },
  ],
  label: false,
}
