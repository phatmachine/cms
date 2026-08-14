import type { Block } from 'payload'

export const PostsCarousel: Block = {
  slug: 'postsCarousel',
  interfaceName: 'PostsCarouselBlock',
  labels: {
    singular: 'Posts Carousel',
    plural: 'Posts Carousels',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Field notes',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Collection', value: 'collection' },
        { label: 'Individual Selection', value: 'selection' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 12,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: ['posts'],
    },
  ],
}
