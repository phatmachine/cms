import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Category, Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostExitGmailArgs = {
  category: Category
  heroImage: Media
  video: Media
}

const boldParagraph = (before: string, bold: string, after: string): DefaultTypedEditorState => ({
  root: {
    children: [
      {
        children: [
          { detail: 0, format: 0, mode: 'normal', style: '', text: before, type: 'text', version: 1 },
          { detail: 0, format: 1, mode: 'normal', style: '', text: bold, type: 'text', version: 1 },
          { detail: 0, format: 0, mode: 'normal', style: '', text: after, type: 'text', version: 1 },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

/**
 * The flagship "Exit Big Tech" post — the worked example for the template
 * (see src/components/ExitGuide/), superseding the earlier Pages-based
 * "alternative to X" pattern (platform-exit-template.ts, now removed).
 */
export const postExitGmail: (args: PostExitGmailArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  category,
  heroImage,
  video,
}) => {
  return {
    _status: 'published',
    categories: [category.id],
    exitGuide: {
      altsIntro:
        'Two providers that treat your mail as correspondence, not raw material. Both import from Gmail; both work the day you arrive.',
      altsLabel: 'The Alternatives [03]',
      alternatives: [
        {
          ctaLabel: 'Make The Switch',
          description:
            'Swiss-based and end-to-end encrypted by default. Your inbox is a locked room even Proton cannot enter — and Easy Switch pulls your Gmail archive across in one pass.',
          difficulty: '2',
          name: 'Proton Mail',
          rank: '[001] Recommended First Move',
          referralUrl: 'https://proton.me/mail',
          tagline: 'Encrypted Mail · Geneva',
        },
        {
          ctaLabel: 'Make The Switch',
          description:
            'German encrypted mail with a fully open-source client and a green-power promise. Calendar and contacts are encrypted alongside the inbox, so nothing leaks out the side.',
          difficulty: '3',
          name: 'Tuta',
          rank: '[002] The Open-Source Route',
          referralUrl: 'https://tuta.com',
          tagline: 'Encrypted Mail · Hanover',
        },
      ],
      appName: 'Gmail',
      carouselHeading: 'Next On The Way Out',
      carouselLimit: 6,
      guideNumber: '007',
      hero: {
        kicker: 'Exit Big Tech // Guide No. 007 // Email',
        standfirst: boldParagraph(
          'Fifteen years of your correspondence, read by an advertising machine. Here is the door — and here is what waits on the ',
          'other side',
          '.',
        ),
        titleLine1: 'Leave',
        titleLine2: 'Gmail',
      },
      migrationHeading: 'Five Steps Out The Door',
      migrationLabel: 'The Exit Route [04]',
      migrationSteps: [
        {
          body: 'Pick a provider and reserve the handle you actually want before someone else does.',
          title: 'Claim Your New Address',
        },
        {
          body: "Use the provider's Gmail import tool to pull your existing mail, contacts, and calendar across.",
          title: 'Import The Archive',
        },
        {
          body: 'Update banks, subscriptions, and logins to the new address — start with anything tied to money.',
          title: 'Reroute The World',
        },
        {
          body: 'Auto-forward Gmail for ninety days to catch the stragglers you inevitably forgot.',
          title: 'Set A Forwarder',
        },
        {
          body: "Export everything one last time, then delete. Don't just abandon it — an open door is still a door.",
          title: 'Close The Account',
        },
      ],
      subject: {
        label: 'The Subject [01]',
        specs: [
          { key: 'Jurisdiction', value: 'United States' },
          { key: 'Owner', value: 'Alphabet Inc.' },
          { key: 'Users', value: '1.8 Billion' },
          { key: 'Model', value: 'Ad Targeting' },
        ],
        statement: boldParagraph(
          'Gmail is not a mail client. It is a surveillance surface with an inbox attached — ',
          'free',
          ' because you, and every sentence you write, are the product.',
        ),
      },
      whyExit: {
        label: 'Why Exit [02]',
        reasons: [
          {
            body: "Message contents, metadata, and your contact graph feed ad targeting and model training across Google's entire estate. The inbox is the sensor.",
            number: '01',
            title: 'They Read The Room',
          },
          {
            body: 'A single account gates Search, Docs, Photos, Android, and Pay. One suspension, one lockout, and your whole digital life closes at once.',
            number: '02',
            title: 'One Login, Every Door',
          },
          {
            body: 'Export is deliberately partial. Labels, filters, and threading rarely survive the trip. The friction of leaving is a feature, not a bug.',
            number: '03',
            title: 'Leaving Is By Design Hard',
          },
        ],
        video: video.id,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description:
        'Fifteen years of your correspondence, read by an advertising machine. Here is the door — and here is what waits on the other side.',
      image: heroImage.id,
      title: 'Leave Gmail',
    },
    postType: 'exitGuide',
    slug: 'leaving-gmail',
    title: 'Leave Gmail',
  }
}
