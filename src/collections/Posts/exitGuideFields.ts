import type { Field, Tab } from 'payload'

import { BoldFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

/**
 * "Exit Big Tech" editorial template — every visible element on the page
 * maps to a field here so nothing is hard-coded in the front-end. Only
 * rendered (in the admin UI) when `postType` is set to `exitGuide`; see
 * `admin.condition` on the tab below.
 *
 * `admin.condition` only hides fields in the admin UI — Payload still runs
 * `required`/`minRows` validation against submitted data regardless of
 * condition. So singular fields that are only meaningful for exit guides
 * use a `validate` gated on sibling `postType` instead of `required: true`,
 * which would otherwise block saving ordinary posts. Array-row fields are
 * safe to mark `required: true` as-is, since that only validates rows an
 * editor actually adds.
 */
const requiredForExitGuide =
  (label: string) =>
  (value: unknown, { data }: { data?: unknown }) => {
    const postType = (data as { postType?: string } | undefined)?.postType
    if (postType === 'exitGuide' && !value) return `${label} is required for Exit Guide posts`
    return true
  }

const boldOnlyEditor = () => lexicalEditor({ features: () => [BoldFeature(), FixedToolbarFeature()] })

export const exitGuideTab: Tab = {
  name: 'exitGuide',
  label: 'Exit Guide',
  admin: {
    condition: (data) => (data as { postType?: string } | undefined)?.postType === 'exitGuide',
    description:
      'Only used when Post Type (sidebar) is "Exit Guide". Every element on the template reads from these fields.',
  },
  fields: [
    {
      name: 'appName',
      type: 'text',
      label: 'App being exited (e.g. Gmail)',
      validate: requiredForExitGuide('App name'),
    },
    {
      name: 'guideNumber',
      type: 'text',
      label: 'Guide No. (e.g. 007)',
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          admin: { placeholder: 'Exit Big Tech // Guide No. 007 // Email' },
        },
        {
          name: 'titleLine1',
          type: 'text',
          label: 'Title, line 1',
          admin: { placeholder: 'Leave' },
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'Title, line 2',
          admin: { placeholder: 'Gmail' },
          validate: requiredForExitGuide('Title, line 2'),
        },
        {
          name: 'standfirst',
          type: 'richText',
          editor: boldOnlyEditor(),
          admin: {
            description:
              'Select one phrase and bold it for emphasis — the brand marks exactly one per standfirst.',
          },
        },
      ],
    },
    {
      name: 'subject',
      type: 'group',
      label: 'The Subject',
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: { placeholder: 'The Subject [01]' },
        },
        {
          name: 'statement',
          type: 'richText',
          label: 'Indictment statement',
          editor: boldOnlyEditor(),
          admin: { description: 'Select one phrase and bold it for emphasis.' },
          validate: requiredForExitGuide('Statement'),
        },
        {
          name: 'specs',
          type: 'array',
          maxRows: 4,
          labels: { singular: 'Spec', plural: 'Specs' },
          fields: [
            {
              name: 'key',
              type: 'text',
              required: true,
              admin: { description: 'e.g. Released, Owner, Users, Model' },
            },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'whyExit',
      type: 'group',
      label: 'Why Exit',
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: { placeholder: 'Why Exit [02]' },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Short MP4/H.264, 1280×720, ~10s. Scrubbed by scroll — no audio needed.',
          },
          validate: requiredForExitGuide('Video'),
        },
        {
          name: 'reasons',
          type: 'array',
          maxRows: 5,
          admin: { description: 'One panel per reason; they cross-fade as the video scrubs.' },
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
              admin: { description: 'e.g. 01', width: '20%' },
            },
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'altsLabel',
      type: 'text',
      label: 'Alternatives — label',
      admin: { placeholder: 'The Alternatives [03]' },
    },
    { name: 'altsIntro', type: 'textarea', label: 'Alternatives — intro' },
    {
      name: 'alternatives',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Alternative', plural: 'Alternatives' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'tagline',
          type: 'text',
          admin: { description: 'e.g. "Encrypted Mail · Geneva"' },
        },
        {
          name: 'rank',
          type: 'text',
          admin: { description: 'e.g. "[001] Recommended First Move"' },
        },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional. Empty = typographic slab (name set large on warm ground).',
          },
        },
        {
          name: 'difficulty',
          type: 'select',
          required: true,
          label: 'Difficulty to switch',
          options: [
            { label: 'Easy (2/5)', value: '2' },
            { label: 'Moderate (3/5)', value: '3' },
            { label: 'Involved (4/5)', value: '4' },
            { label: 'Hard (5/5)', value: '5' },
          ],
        },
        {
          name: 'ctaLabel',
          type: 'text',
          defaultValue: 'Make The Switch',
        },
        {
          name: 'referralUrl',
          type: 'text',
          required: true,
          label: 'Referral URL',
          admin: { description: 'Opens in a new tab with rel="noopener sponsored".' },
        },
      ],
    },
    {
      name: 'migrationLabel',
      type: 'text',
      label: 'Migration — label',
      admin: { placeholder: 'The Exit Route [04]' },
    },
    {
      name: 'migrationHeading',
      type: 'text',
      label: 'Migration — heading',
      admin: { placeholder: 'Five Steps Out The Door' },
    },
    {
      name: 'migrationSteps',
      type: 'array',
      label: 'Migration checklist',
      maxRows: 8,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'carouselHeading',
      type: 'text',
      admin: { placeholder: 'Next On The Way Out' },
    },
    {
      name: 'carouselCategoryOverride',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: "Optional. Leave empty to reuse this post's own categories.",
      },
    },
    {
      name: 'carouselLimit',
      type: 'number',
      defaultValue: 6,
      min: 3,
      max: 12,
    },
  ] satisfies Field[],
}

export const postTypeField: Field = {
  name: 'postType',
  type: 'select',
  admin: {
    description: 'Switches this post to the "Exit Big Tech" long-form editorial template.',
    position: 'sidebar',
  },
  defaultValue: 'standard',
  options: [
    { label: 'Standard', value: 'standard' },
    { label: 'Exit Guide', value: 'exitGuide' },
  ],
  required: true,
}
