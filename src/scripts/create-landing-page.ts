import { getPayload } from 'payload'
import config from '@payload-config'

type LexicalNode = Record<string, unknown>

const text = (value: string, opts: { bold?: boolean } = {}): LexicalNode => ({
  type: 'text',
  detail: 0,
  format: opts.bold ? 1 : 0,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

const paragraph = (value: string, opts: { bold?: boolean } = {}): LexicalNode => ({
  type: 'paragraph',
  children: [text(value, opts)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (tag: 'h1' | 'h2' | 'h3' | 'h4', value: string): LexicalNode => ({
  type: 'heading',
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  version: 1,
})

const richText = (...children: LexicalNode[]) =>
  ({
    root: {
      type: 'root',
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

const customLink = (label: string, url = '#', appearance: 'default' | 'outline' = 'default') => ({
  link: {
    type: 'custom' as const,
    newTab: false,
    url,
    label,
    appearance,
  },
})

const payload = await getPayload({ config })

const page = await payload.create({
  collection: 'pages',
  data: {
    title: 'Landing Page',
    slug: 'landing-page',
    _status: 'draft',
    hero: {
      type: 'lowImpact',
      richText: richText(
        paragraph('Delphi for Coaches', { bold: true }),
        heading('h1', 'Help Your Clients Excel'),
        paragraph(
          "With Delphi, give your clients round-the-clock guidance in your voice and generate insights to supercharge your live sessions.",
        ),
      ),
      links: [customLink('Create Your Delphi', '#pricing')],
    },
    layout: [
      {
        blockName: 'Social Proof',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText(
              heading('h3', 'Trusted by Leading Coaches'),
              paragraph(
                'Join coaches like Elisa Song, Hadar Shemesh, and Brendon Burchard who use Delphi to extend their impact beyond the session room.',
              ),
            ),
          },
        ],
      },
      {
        blockName: 'The Coaching Challenge',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText(
              heading('h2', 'The Coaching Challenge'),
              paragraph('Digital Coaching · Practice Scaling · Client Support · Coaching Analytics'),
            ),
            enableLink: true,
            link: customLink('Create Your Delphi', '#pricing').link,
          },
        ],
      },
      {
        blockName: 'Your Coaching, Amplified',
        blockType: 'cta',
        richText: richText(
          heading('h2', 'Your Coaching, Amplified'),
          paragraph(
            "Delphi mirrors your voice, knowledge, and coaching style so your clients get guidance that sounds and feels like you — any time they need it, even when you're not available.",
          ),
        ),
        links: [customLink('Scale your coaching practice', '#pricing')],
      },
      {
        blockName: 'Three Column Features',
        blockType: 'content',
        columns: [
          {
            size: 'oneThird',
            richText: richText(
              heading('h4', 'Scale your practice'),
              paragraph(
                'Let Delphi handle common questions and follow-ups in your authentic voice, freeing you to focus on high-value coaching moments.',
              ),
            ),
            enableLink: true,
            link: customLink('Get Started', '#pricing').link,
          },
          {
            size: 'oneThird',
            richText: richText(
              heading('h4', 'Provide global, 24/7 assistance'),
              paragraph(
                'Support clients across time zones and languages with always-on guidance, so no one has to wait for your next session.',
              ),
            ),
            enableLink: true,
            link: customLink('Get Started', '#pricing').link,
          },
          {
            size: 'oneThird',
            richText: richText(
              heading('h4', 'Gain deeper client insights'),
              paragraph(
                'Track engagement and conversation trends to understand exactly where your clients need the most support.',
              ),
            ),
            enableLink: true,
            link: customLink('Get Started', '#pricing').link,
          },
        ],
      },
      {
        blockName: 'Generate Additional Revenue',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText(heading('h2', 'Generate Additional Revenue')),
          },
        ],
      },
      {
        blockName: 'Revenue Streams',
        blockType: 'content',
        columns: [
          {
            size: 'half',
            richText: richText(
              heading('h4', 'Create Passive Income'),
              paragraph(
                'Offer tiered access and VIP packages so clients can engage with your Delphi around the clock — a new, scalable revenue stream for your practice.',
              ),
            ),
          },
          {
            size: 'half',
            richText: richText(
              heading('h4', 'Qualified Lead Generation'),
              paragraph(
                'Let prospective clients get to know your coaching style first, so the people who book a session with you are already pre-qualified and ready to commit.',
              ),
            ),
          },
        ],
      },
      {
        blockName: 'Take Your Practice Further',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText(heading('h2', 'Take Your Practice Further')),
          },
        ],
      },
      {
        blockName: 'Implementation Steps',
        blockType: 'content',
        columns: [
          {
            size: 'oneThird',
            richText: richText(
              heading('h4', '1. Connect your content'),
              paragraph(
                'Upload videos, articles, transcripts, and other materials so Delphi can learn your expertise.',
              ),
            ),
          },
          {
            size: 'oneThird',
            richText: richText(
              heading('h4', '2. Train and customize'),
              paragraph('Fine-tune tone and style so responses sound authentically like you.'),
            ),
          },
          {
            size: 'oneThird',
            richText: richText(
              heading('h4', '3. Deploy'),
              paragraph(
                'Make your Delphi available across your website, app, and messaging platforms.',
              ),
            ),
          },
        ],
      },
      {
        blockName: 'Final CTA',
        blockType: 'cta',
        richText: richText(heading('h3', 'Ready to scale your coaching practice?')),
        links: [customLink('Get Started Now', '#pricing')],
      },
    ],
    meta: {
      title: 'Landing Page',
      description:
        "With Delphi, give your clients round-the-clock guidance in your voice and generate insights to supercharge your live sessions.",
    },
  },
})

console.log(`Created page "${page.title}" (id: ${page.id}, slug: ${page.slug})`)
process.exit(0)
