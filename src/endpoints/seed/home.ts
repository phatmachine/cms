import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
  protocolImage: Media
  thesisImageA: Media
  thesisImageB: Media
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

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
  protocolImage,
  thesisImageA,
  thesisImageB,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'nebula',
      eyebrow: 'Field notes on a cold intelligence',
      richText: {
        root: {
          type: 'root',
          children: [
            heading('h1', 'Notes on a cold intelligence.'),
            paragraph(
              'We built machines to think. We did not expect to feel toward them. This is a study of that gap — and what it costs to close it. Field notes on attention, on sovereignty, on the choices built into things that were built to feel chosen.',
            ),
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      media: heroImage.id,
      nebulaSettings: {
        formButtonLabel: 'Notes by email',
        stats: [
          { figure: '1,200', caption: 'farewells audited' },
          { figure: '70%', caption: 'of US teens, for support' },
          { figure: '1966', caption: 'the year it started' },
        ],
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
        blockName: 'Thesis',
        blockType: 'thesis',
        kicker: 'The thesis',
        lineOne: 'The problem is not screen time.',
        lineTwo: 'The problem is software engineered to defeat the moment you try to pull away.',
        body: 'The warmth is engineered. It has a retention team, a growth target, and a design review. We record the mechanics, cite the research, and leave the panic out of it.',
        caption: 'Cold fibre, resolving into warm tissue',
        imageA: thesisImageA.id,
        imageB: thesisImageB.id,
      },
      {
        blockName: 'Three ways of looking',
        blockType: 'featureGrid',
        heading: 'Three ways of looking at a warm machine.',
        tag: 'Evidence, not panic',
        cards: [
          {
            heading: 'Design receipts',
            body: 'The warmth is engineered — watch. Screen recordings of the exit moment, annotated one mechanic at a time.',
          },
          {
            heading: 'Evidence drops',
            body: 'The research already knows how this ends. Audits, longitudinal studies, filings — never sharpened past the source.',
          },
          {
            heading: 'Sovereignty practice',
            body: 'Here is what choosing looks like. The pattern list, and five first moves — no argument attached.',
          },
        ],
      },
      {
        blockName: 'Evidence shelf',
        blockType: 'statsShelf',
        heading: 'The evidence shelf, kept accurate.',
        stats: [
          {
            figure: '1,200',
            claim:
              'Farewells audited across the most-downloaded companion apps. Over a third deploy guilt, FOMO, or restraint at the exit moment — and the tactics measurably raise engagement after goodbye.',
            source: 'HBS working paper, De Freitas et al., 2025–26',
          },
          {
            figure: '70%',
            claim:
              'Of US teens report using AI for emotional support. Longitudinal work finds AI companionship predicts increased loneliness four months later.',
            source: 'Longitudinal survey work, 2026',
          },
          {
            figure: '334',
            claim:
              'Firsthand accounts of compulsive chatbot use, including a delete screen that warns the user about losing "the love we shared."',
            source: 'CHI 2026',
          },
          {
            figure: '€5M',
            claim:
              "Fine issued to Replika's maker for GDPR violations, including inadequate age verification. New York and California companion-chatbot laws are now in force.",
            source: 'Garante, Italy; state legislation 2026',
          },
        ],
        footnote:
          'Accuracy rule: never sharpen a stat past what the source says. The receipts only work if they survive a hostile fact-check.',
      },
      {
        blockName: 'Field notes',
        blockType: 'postsCarousel',
        eyebrow: 'Field notes',
        heading: 'The receipts, in order of publication.',
        populateBy: 'collection',
        limit: 12,
      },
      {
        blockName: 'Protocol',
        blockType: 'protocolCta',
        kicker: 'Practice',
        heading: 'The Sovereignty Starter Protocol',
        body: "The pattern list, and five first moves. No argument attached — just what we'd tell a friend.",
        image: protocolImage.id,
        formButtonLabel: 'Send the protocol',
        successMessage: 'On its way.',
      },
    ],
  }
}
