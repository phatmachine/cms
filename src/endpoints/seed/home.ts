import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  metaImage: Media
  slideIds: string[]
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
  slideIds,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'signalCarousel',
      carousel: {
        slides: slideIds,
        autoAdvanceSeconds: 7,
        showThumbnails: true,
        overlayStrength: 0.5,
        backdropPattern: 'points',
      },
    },
    meta: {
      description:
        'A study of the gap between mind and model — and what it costs us to close it.',
      image: metaImage.id,
      title: 'Rethink the Machine',
    },
    title: 'Home',
    layout: [
      {
        blockName: 'Statement',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Six familiar machines, six essays on what it costs to be understood by one.',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
      },
    ],
  }
}
