import type { Block } from 'payload'

export const Testimonial: Block = {
  slug: 'testimonial',
  interfaceName: 'TestimonialBlock',
  labels: {
    plural: 'Testimonials',
    singular: 'Testimonial',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'authorName',
          type: 'text',
          admin: { width: '50%' },
          required: true,
        },
        {
          name: 'authorRole',
          type: 'text',
          admin: { description: 'e.g. "Verified switcher"', width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          admin: { width: '50%' },
          relationTo: 'media',
        },
        {
          name: 'rating',
          type: 'number',
          admin: { width: '50%' },
          max: 5,
          min: 1,
        },
      ],
    },
  ],
}
