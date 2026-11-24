import type { GlobalConfig } from 'payload'

export const PostsPage: GlobalConfig = {
  slug: 'postsPage',
  label: 'Posts Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Settings for the /posts index page.',
  },
  fields: [
    {
      name: 'backgroundMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Background image or video',
      admin: {
        description:
          'An image, or an MP4 video (plays muted on a loop). Empty = the site default (/api/media/file/hdr-generic.jpg).',
      },
      filterOptions: {
        or: [{ mimeType: { contains: 'image/' } }, { mimeType: { contains: 'video/mp4' } }],
      },
    },
    {
      name: 'backgroundOpacity',
      type: 'number',
      label: 'Background opacity (%)',
      defaultValue: 50,
      min: 0,
      max: 100,
    },
  ],
}
