import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
  projectImageCommute: Media
  projectImageJump: Media
  projectImageRest: Media
}

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [
    { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
  ],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (tag: 'h1', text: string) => ({
  type: 'heading',
  tag,
  children: [
    { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
  ],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})

/**
 * A statement paragraph with exactly one emphasised phrase — the brand
 * marks one `<em>` per statement. See `blocks/Narrative/Component.tsx`.
 */
const statement = (before: string, emphasis: string, after: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: before, version: 1 },
          { type: 'text', detail: 0, format: 2, mode: 'normal', style: '', text: emphasis, version: 1 },
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: after, version: 1 },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
  projectImageCommute,
  projectImageJump,
  projectImageRest,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'paper',
      eyebrow: 'Field notes on a cold intelligence',
      richText: {
        root: {
          type: 'root',
          children: [
            heading('h1', 'NOTES ON A COLD INTELLIGENCE'),
            paragraph(
              'We built machines to think. We did not expect to feel toward them. This is a study of that gap — and what it costs to close it.',
            ),
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      media: heroImage.id,
      paperSettings: {
        metaLine: 'Est. 2026 / Attention & Sovereignty',
        sidebarLabel: 'Rethink the Machine // Attention, not capture // Est. 2026',
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
        blockName: 'Our thesis',
        blockType: 'narrative',
        label: 'Our thesis [01]',
        statement: statement(
          "We didn't build machines that manipulate us by accident — the warmth is engineered, tested, and priced by the minute, but the cost is measured in something no dashboard tracks: ",
          'the attention we don’t get back',
          '.',
        ),
      },
      {
        blockName: 'Held attention',
        blockType: 'projectRow',
        number: '001',
        side: 'left',
        title: 'Held Attention',
        description:
          'A commuter carriage as a laboratory: every rider a captive audience, every screen a small machine for holding what it can.',
        image: projectImageCommute.id,
        link: { type: 'custom', label: 'Read', url: '/posts' },
      },
      {
        blockName: 'Glorious friction',
        blockType: 'projectRow',
        number: '002',
        side: 'right',
        title: 'Glorious Friction',
        description:
          'No feed calculated this jump. No metric wanted it. It happened once, off-platform, and no one will ever see it again.',
        image: projectImageJump.id,
        link: { type: 'custom', label: 'Read', url: '/posts' },
      },
      {
        blockName: 'Quiet exit',
        blockType: 'projectRow',
        number: '003',
        side: 'left',
        title: 'Quiet Exit',
        description:
          'Rest looks like withdrawal now — proof, almost, that the pull failed for an afternoon. What used to be simply human now has to be earned back.',
        image: projectImageRest.id,
        link: { type: 'custom', label: 'Read', url: '/posts' },
      },
    ],
  }
}
