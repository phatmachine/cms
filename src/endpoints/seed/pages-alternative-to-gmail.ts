import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type Args = {
  heroImage: Media
  imageA: Media
  imageB: Media
  imageC: Media
}

const paragraph = (text: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text,
            version: 1,
          },
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

const heroRichText = () => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: 'Leaving Gmail',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h1' as const,
        version: 1,
      },
      {
        type: 'paragraph' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: 'Google reads every message that passes through your inbox to build the model of you it sells against. Here is what changes when you stop letting it.',
            version: 1,
          },
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

const ctaRichText = () => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: 'Ready to leave?',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h2' as const,
        version: 1,
      },
      {
        type: 'paragraph' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: 'Pick one option above and start today. Your future inbox will thank you.',
            version: 1,
          },
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

// Worked example of the "alternative to X" landing template, using every new block.
// Linked from the homepage carousel's Gmail slide via `link.reference`.
export const alternativeToGmail: (args: Args) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  imageA,
  imageB,
  imageC,
}) => {
  return {
    slug: 'leaving-gmail',
    _status: 'published',
    carouselFeature: {
      image: imageA.id,
      eyebrow: 'Email',
      line: 'The inbox that reads you back. Two billion correspondents, one model of attention.',
    },
    hero: {
      type: 'highImpact',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'See the options',
            url: '#options',
          },
        },
      ],
      media: heroImage.id,
      richText: heroRichText(),
    },
    meta: {
      description:
        'Why Gmail costs more than it looks like, and three encrypted, ad-free alternatives — with a step-by-step migration guide.',
      image: heroImage.id,
      title: 'Leaving Gmail — Rethink the Machine',
    },
    title: 'Leaving Gmail',
    layout: [
      {
        blockType: 'whySwitch',
        eyebrow: 'Why switch',
        heading: 'What Gmail actually costs',
        intro: 'Free email was never free. Here is the ledger.',
        benefits: [
          {
            title: 'Your inbox is a training set',
            description:
              'Every email you send or receive helps refine the advertising profile Google builds of you — including messages from people who never agreed to that.',
          },
          {
            title: 'Attachments live forever',
            description:
              'Deleted mail lingers in backups and audit logs long after it leaves your view, subject to retention rules you never voted on.',
          },
          {
            title: 'One account, one point of failure',
            description:
              'Gmail is usually the recovery address for everything else you own. Losing it — or being locked out of it — cascades.',
          },
        ],
      },
      {
        blockType: 'options',
        eyebrow: 'The options',
        heading: 'Three ways out',
        intro: "Ranked roughly by how much friction you're willing to accept.",
        options: [
          {
            name: 'Proton Mail',
            badge: 'editor-pick',
            tagline: 'Encrypted email that respects you.',
            description:
              'End-to-end encrypted by default, built by a team that has fought Swiss courts to protect user data. Free tier is generous; paid tiers add storage and custom domains.',
            price: 'Free, from $4/mo',
            logo: imageA.id,
            link: { type: 'custom', label: 'Visit Proton Mail', url: 'https://proton.me/mail' },
          },
          {
            name: 'Tuta',
            badge: 'open-source',
            tagline: 'Fully open-source, quantum-resistant encryption.',
            description:
              'German-hosted, encrypts subject lines and calendars too, not just message bodies.',
            price: 'Free, from €3/mo',
            logo: imageB.id,
            link: { type: 'custom', label: 'Visit Tuta', url: 'https://tuta.com' },
          },
          {
            name: 'Fastmail',
            badge: 'none',
            tagline: 'The email service built by email people.',
            description:
              'Not encrypted by default, but independent, ad-free, and has run reliably since 1999.',
            price: 'From $5/mo',
            logo: imageC.id,
            link: { type: 'custom', label: 'Visit Fastmail', url: 'https://fastmail.com' },
          },
        ],
      },
      {
        blockType: 'comparisonTable',
        eyebrow: 'How they compare',
        heading: 'Gmail vs. the alternatives',
        columns: [
          { label: 'Gmail', isFeatured: false },
          { label: 'Proton Mail', isFeatured: true },
          { label: 'Tuta', isFeatured: false },
          { label: 'Fastmail', isFeatured: false },
        ],
        rows: [
          {
            feature: 'End-to-end encryption',
            cells: [{ status: 'no' }, { status: 'yes' }, { status: 'yes' }, { status: 'no' }],
          },
          {
            feature: 'Ad-supported',
            cells: [
              { status: 'yes', note: 'Free tier' },
              { status: 'no' },
              { status: 'no' },
              { status: 'no' },
            ],
          },
          {
            feature: 'Custom domain support',
            cells: [
              { status: 'partial', note: 'Workspace only' },
              { status: 'yes' },
              { status: 'yes' },
              { status: 'yes' },
            ],
          },
          {
            feature: 'Open source',
            cells: [
              { status: 'no' },
              { status: 'partial', note: 'Clients only' },
              { status: 'yes' },
              { status: 'no' },
            ],
          },
        ],
      },
      {
        blockType: 'howToSwitch',
        eyebrow: 'How to switch',
        heading: 'Moving your inbox without losing anything',
        intro: 'Budget an afternoon. Nothing here needs to happen all at once.',
        steps: [
          {
            title: 'Export your Gmail archive',
            description:
              'Google Takeout will package your entire mail history as an .mbox file you can import almost anywhere else.',
            media: imageB.id,
          },
          {
            title: 'Set up forwarding, not silence',
            description:
              'Keep Gmail receiving and auto-forwarding to your new address for a few months so nothing important gets lost in the gap.',
          },
          {
            title: 'Move your logins first',
            description:
              'Update the accounts that matter most — banking, your domain registrar, your phone carrier — before you touch anything else.',
          },
          {
            title: 'Retire the old address last',
            description:
              'Once forwarding has been quiet for a few weeks, turn Gmail into an archive, not a mailbox.',
          },
        ],
      },
      {
        blockType: 'testimonial',
        quote:
          'I expected the migration to take a weekend. It took an evening, and the relief was immediate — my inbox stopped feeling like it was reporting on me.',
        authorName: 'A reader who switched',
        authorRole: 'Verified switcher',
        rating: 5,
        avatar: imageC.id,
      },
      {
        blockType: 'faq',
        eyebrow: 'Questions',
        heading: 'Before you switch',
        items: [
          {
            question: 'Will I lose my old emails?',
            answer: paragraph(
              'No — Google Takeout exports everything, and every alternative above can import a standard .mbox archive.',
            ),
          },
          {
            question: 'What happens to my Google account?',
            answer: paragraph(
              'Nothing, unless you close it. Many people keep a dormant Google account for services like Maps or Photos while moving mail elsewhere.',
            ),
          },
          {
            question: 'Is this worth doing for a free email account?',
            answer: paragraph(
              'That depends on what the free tier is costing you. If your inbox is a full record of your relationships, purchases, and health, the ledger tends to tip quickly.',
            ),
          },
        ],
      },
      {
        blockType: 'cta',
        richText: ctaRichText(),
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'See the options',
              url: '#options',
            },
          },
        ],
      },
    ],
  }
}
