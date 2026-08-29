import type { Block } from 'payload'

import { FixedToolbarFeature, ItalicFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Narrative: Block = {
  slug: 'narrative',
  interfaceName: 'NarrativeBlock',
  labels: {
    singular: 'Narrative statement',
    plural: 'Narrative statements',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Label (columns 1–4)',
      admin: {
        description: 'e.g. "Our thesis [01]". Set in mono, above a hairline rule.',
      },
    },
    {
      name: 'statement',
      type: 'richText',
      label: 'Statement (columns 5–12)',
      admin: {
        description:
          'One long sentence, or one short declarative. Select one phrase and italicise it for emphasis — the brand marks exactly one per statement.',
      },
      editor: lexicalEditor({
        features: () => [ItalicFeature(), FixedToolbarFeature()],
      }),
      required: true,
    },
  ],
}
