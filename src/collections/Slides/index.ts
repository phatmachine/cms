import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Slides: CollectionConfig = {
  slug: 'slides',
  labels: {
    singular: 'Carousel Slide',
    plural: 'Carousel Slides',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brand', 'category', 'order'],
    description:
      'Slides for the homepage hero carousel. Add slides here, then choose and order them on the homepage (Pages → Home → Hero).',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Product / slide title',
      admin: { description: 'e.g. "Gmail"' },
      required: true,
    },
    {
      name: 'brand',
      type: 'text',
      admin: { description: 'e.g. "Google"' },
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Social', value: 'social' },
        { label: 'Data', value: 'data' },
        { label: 'Storage', value: 'storage' },
        { label: 'Voice', value: 'voice' },
        { label: 'Media', value: 'media' },
      ],
      required: true,
    },
    {
      name: 'line',
      type: 'textarea',
      label: 'Essayistic caption',
      admin: { description: 'One-line essayistic caption shown under the title' },
      required: true,
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Background (video or image)',
      admin: {
        description:
          'Full-bleed background for this slide. Upload a video (mp4) for a looping background, or an image. Falls back to a placeholder panel if left empty.',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail',
      admin: {
        description: 'Portrait thumbnail for the slide strip, ideally 340×573px.',
      },
    },
    {
      name: 'link',
      type: 'group',
      label: 'Read the study — links to',
      admin: {
        hideGutter: true,
        description:
          'Where "Read the study" points. Optional — leave every field empty until the corresponding page exists.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'radio',
              admin: { layout: 'horizontal', width: '50%' },
              defaultValue: 'reference',
              options: [
                { label: 'Internal link', value: 'reference' },
                { label: 'Custom URL', value: 'custom' },
              ],
            },
            {
              name: 'newTab',
              type: 'checkbox',
              admin: { style: { alignSelf: 'flex-end' }, width: '50%' },
              label: 'Open in new tab',
            },
          ],
        },
        {
          name: 'reference',
          type: 'relationship',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'reference',
            width: '50%',
          },
          label: 'Document to link to',
          relationTo: ['pages', 'posts'],
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'custom',
            width: '50%',
          },
          label: 'Custom URL',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in the carousel.',
      },
    },
  ],
  defaultSort: 'order',
}
