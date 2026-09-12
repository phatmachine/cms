import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

/**
 * Reusable "platform exit" page template — the Paper-register layout used
 * for pages that walk a reader out of a commercial application (see
 * `pages-leaving-slack.ts` for a worked example, and
 * `pages-alternative-to-gmail.ts` for the pre-Paper original this design
 * replaces). Fill in a `PlatformExitPageConfig` and hand it to
 * `platformExitPage()` to seed a new one — no new blocks or fields required,
 * every slot below maps onto blocks already registered on the Pages
 * collection (`hero: paper`, `narrative`, `whySwitch`, `options`,
 * `comparisonTable`, `howToSwitch`).
 *
 * Copy formulas (see the "Copy Guidance" design doc this was synced from):
 * - title: "Leaving <Platform>" — a gerund, never a question.
 * - heroSubhead: two sentences — mechanism, then release. No alarm adjectives.
 * - thesis: one sentence, pivoting on an em dash, with exactly one emphasised phrase.
 * - concerns: exactly 3 — flat declarative title, then a concrete consequence.
 * - alternatives: exactly 2 — name, one-line claim, honest trade-off.
 * - steps: exactly 4 — three-word imperative title, states what it protects.
 */

type Concern = {
  description: string
  title: string
}

type Alternative = {
  badge?: 'editor-pick' | 'free' | 'none' | 'open-source'
  description?: string
  name: string
  price?: string
  tagline?: string
  url: string
}

type ComparisonRow = {
  cells: { note?: string; status: 'no' | 'partial' | 'yes' }[]
  feature: string
}

type Step = {
  description: string
  title: string
}

export type PlatformExitPageConfig = {
  alternatives: [Alternative, Alternative]
  alternativesEyebrow: string
  alternativesHeading: string
  alternativesIntro?: string

  category: string
  comparisonColumns: { isFeatured?: boolean; label: string }[]
  comparisonEyebrow: string
  comparisonHeading: string
  comparisonRows: ComparisonRow[]

  concerns: [Concern, Concern, Concern]
  concernsEyebrow: string
  concernsHeading: string
  concernsIntro?: string

  heroImages: Media[]
  heroSubhead: string
  metaDescription: string
  metaLine: string

  migrationEyebrow: string
  migrationHeading: string
  migrationIntro?: string

  platformName: string
  protocolNumber: string
  sidebarLabel: string
  slug: string
  stepImage?: Media

  steps: [Step, Step, Step, Step]

  thesisAfter: string
  thesisEmphasis: string
  thesisLabel: string
  thesisStatement: string
}

const paragraph = (children: ReturnType<typeof textNode>[]) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children,
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

const textNode = (text: string, format: 0 | 2 = 0) => ({
  type: 'text' as const,
  detail: 0,
  format,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const heroRichText = (title: string, subhead: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        children: [textNode(title)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h1' as const,
        version: 1,
      },
      {
        type: 'paragraph' as const,
        children: [textNode(subhead)],
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

export const platformExitPage = (
  config: PlatformExitPageConfig,
): RequiredDataFromCollectionSlug<'pages'> => {
  return {
    slug: config.slug,
    _status: 'published',
    hero: {
      type: 'paper',
      eyebrow: `Exit protocol [${config.protocolNumber}] // ${config.category}`,
      paperSettings: {
        heroImages: config.heroImages.map((image) => ({ image: image.id })),
        metaLine: config.metaLine,
        sidebarLabel: config.sidebarLabel,
      },
      richText: heroRichText(`Leaving ${config.platformName}`, config.heroSubhead),
    },
    meta: {
      description: config.metaDescription,
      image: config.heroImages[0]?.id,
      title: `Leaving ${config.platformName} — Rethink the Machine`,
    },
    title: `Leaving ${config.platformName}`,
    layout: [
      {
        blockType: 'narrative',
        label: config.thesisLabel,
        statement: paragraph([
          textNode(config.thesisStatement),
          textNode(config.thesisEmphasis, 2),
          textNode(config.thesisAfter),
        ]),
      },
      {
        blockType: 'whySwitch',
        eyebrow: config.concernsEyebrow,
        heading: config.concernsHeading,
        intro: config.concernsIntro,
        benefits: config.concerns.map((concern) => ({
          title: concern.title,
          description: concern.description,
        })),
      },
      {
        blockType: 'options',
        eyebrow: config.alternativesEyebrow,
        heading: config.alternativesHeading,
        intro: config.alternativesIntro,
        options: config.alternatives.map((alt) => ({
          name: alt.name,
          badge: alt.badge || 'none',
          tagline: alt.tagline,
          description: alt.description,
          price: alt.price,
          link: { type: 'custom' as const, label: `Visit ${alt.name}`, url: alt.url },
        })),
      },
      {
        blockType: 'comparisonTable',
        eyebrow: config.comparisonEyebrow,
        heading: config.comparisonHeading,
        columns: config.comparisonColumns,
        rows: config.comparisonRows,
      },
      {
        blockType: 'howToSwitch',
        eyebrow: config.migrationEyebrow,
        heading: config.migrationHeading,
        intro: config.migrationIntro,
        steps: config.steps.map((step) => ({
          title: step.title,
          description: step.description,
          media: config.stepImage?.id,
        })),
      },
    ],
  }
}
