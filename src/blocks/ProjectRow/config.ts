import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ProjectRow: Block = {
  slug: 'projectRow',
  interfaceName: 'ProjectRowBlock',
  labels: {
    singular: 'Project row (gallery)',
    plural: 'Project rows (gallery)',
  },
  fields: [
    {
      name: 'backgroundType',
      type: 'select',
      label: 'Background type',
      defaultValue: 'image',
      options: [
        { label: 'Static image', value: 'image' },
        { label: 'Video (loops, muted)', value: 'video' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { backgroundType } = {}) => (backgroundType || 'image') === 'image',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { backgroundType?: string } }) => {
        if ((siblingData?.backgroundType || 'image') === 'image' && !value) {
          return 'An image is required when the background type is set to Static image.'
        }
        return true
      },
    },
    {
      name: 'video',
      type: 'upload',
      label: 'Background video',
      relationTo: 'media',
      admin: {
        condition: (_, { backgroundType } = {}) => backgroundType === 'video',
        description: 'MP4 or WebM. Plays muted, looped, and autoplaying — no sound, no controls.',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { backgroundType?: string } }) => {
        if (siblingData?.backgroundType === 'video' && !value) {
          return 'A video is required when the background type is set to Video.'
        }
        return true
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Number',
          admin: {
            description: 'Zero-padded, e.g. "001".',
            width: '30%',
          },
        },
        {
          name: 'side',
          type: 'select',
          defaultValue: 'left',
          label: 'Image side',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Alternate this with neighbouring rows.',
            width: '70%',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      admin: {
        description: 'Two words, evocative, no verbs — e.g. "Held Attention". Rendered uppercase.',
      },
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'One or two sentences, ending on a concrete noun pair.',
      },
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          description: 'Optional. The round button — keep the label to one word, e.g. "Read".',
        },
      },
    }),
  ],
}
