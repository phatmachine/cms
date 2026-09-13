import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import config from '../src/payload.config'
import type { Category, Media } from '../src/payload-types'

/**
 * Imports content/exit-guides/*.md into Payload as Post docs
 * (postType: exitGuide), matched and upserted by slug — safe to re-run.
 * Never deletes a post, even if its .md file disappears. Media is never
 * uploaded here: images/video are referenced by filename and must already
 * exist in the Media collection. See content/exit-guides/README.md.
 *
 * Two source formats are supported, auto-detected per file:
 *  - YAML frontmatter (gray-matter), documented in README.md.
 *  - "Structured markdown" — a flat `## field.path` heading per value, no
 *    frontmatter block. Used for batches authored without heroImage/video/
 *    referralUrl yet on hand; those posts import as drafts (Payload skips
 *    required-field validation on draft saves for this collection, since
 *    versions.drafts.validate isn't set), ready for the user to attach
 *    media and referral links before publishing.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content', 'exit-guides')
const DEFAULT_CATEGORY = "I'm Leaving You"

// "before **bold** after" -> a one-paragraph Lexical doc, matching the
// design's "exactly one emphasised phrase per statement" rule. No **bold**
// at all is fine too — the whole string just renders unemphasised.
function toRichText(text: unknown): DefaultTypedEditorState | undefined {
  if (typeof text !== 'string' || !text.trim()) return undefined

  const match = text.match(/^(.*?)\*\*(.+?)\*\*(.*)$/s)
  const [before, bold, after] = match ? [match[1], match[2], match[3]] : [text, '', '']

  const children = [
    before && { detail: 0, format: 0, mode: 'normal', style: '', text: before, type: 'text', version: 1 },
    bold && { detail: 0, format: 1, mode: 'normal', style: '', text: bold, type: 'text', version: 1 },
    after && { detail: 0, format: 0, mode: 'normal', style: '', text: after, type: 'text', version: 1 },
  ].filter(Boolean)

  return {
    root: {
      children: [
        { children, direction: 'ltr', format: '', indent: 0, textFormat: 0, type: 'paragraph', version: 1 },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  } as DefaultTypedEditorState
}

// Structured-markdown fields use <em>...</em> for emphasis (they're plain
// prose, not YAML). Plain-text/textarea fields can't render markup at all,
// so emphasis is dropped; the two richText fields (hero.standfirst,
// subject.statement) get their first <em> turned into **bold** instead, so
// it flows through the same toRichText() as the YAML-frontmatter format.
function stripEm(text: string | undefined): string | undefined {
  if (!text) return undefined
  return text.replace(/<\/?em>/g, '').trim()
}

function emToBold(text: string | undefined): string | undefined {
  if (!text) return undefined
  return text.replace(/<em>(.*?)<\/em>/s, '**$1**')
}

const DIFFICULTY_BY_LABEL: Record<string, '2' | '3' | '4' | '5'> = {
  Easy: '2',
  Hard: '5',
  Involved: '4',
  Moderate: '3',
}

// Structured-markdown difficulty values look like "1 — Easy" or "4 — Involved"
// — an author-facing ordinal that doesn't line up 1:1 with the schema's
// 2-5 scale, so only the label word is trusted.
function parseDifficulty(text: string | undefined): '2' | '3' | '4' | '5' {
  const label = text
    ?.split(/[—-]/)
    .pop()
    ?.trim()
  const value = label && DIFFICULTY_BY_LABEL[label]
  if (!value) throw new Error(`unrecognised difficulty label: "${text}"`)
  return value
}

// Parses the "structured markdown" format: a flat `## field.path` heading
// per value, with everything up to the next heading as that field's text.
function parseStructuredMarkdown(raw: string): Record<string, string> {
  const fields: Record<string, string> = {}
  let currentKey: string | null = null
  let buffer: string[] = []

  const flush = () => {
    if (currentKey) fields[currentKey] = buffer.join('\n').trim()
    buffer = []
  }

  for (const line of raw.split(/\r?\n/)) {
    const heading = line.match(/^##\s+([\w.]+)\s*$/)
    if (heading) {
      flush()
      currentKey = heading[1]
    } else if (currentKey) {
      buffer.push(line)
    }
  }
  flush()

  return fields
}

async function findMediaByFilename(payload: Payload, filename: string): Promise<Media> {
  const { docs } = await payload.find({
    collection: 'media',
    limit: 1,
    where: { filename: { equals: filename } },
  })
  if (!docs[0]) {
    throw new Error(
      `media not found: "${filename}" — upload it in the admin panel first, then re-run this import`,
    )
  }
  return docs[0]
}

async function findOrCreateCategory(payload: Payload, title: string): Promise<Category> {
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { title: { equals: title } },
  })
  if (docs[0]) return docs[0]
  const created = await payload.create({ collection: 'categories', data: { slug: title, title } })
  console.log(`  created category: ${title}`)
  return created
}

function requireField(data: Record<string, any>, dotPath: string, label: string) {
  const value = dotPath.split('.').reduce<any>((obj, key) => obj?.[key], data)
  if (value === undefined || value === null || value === '') {
    throw new Error(`missing required field "${label}"`)
  }
  return value
}

function requireTruthy<T>(value: T, label: string): NonNullable<T> {
  if (!value) throw new Error(`missing required field "${label}"`)
  return value as NonNullable<T>
}

async function buildFromFrontmatter(payload: Payload, data: Record<string, any>, slug: string) {
  requireField(data, 'title', 'title')
  requireField(data, 'appName', 'appName')
  requireField(data, 'heroImage', 'heroImage')
  requireField(data, 'hero.titleLine2', 'hero.titleLine2')
  requireField(data, 'subject.statement', 'subject.statement')
  requireField(data, 'whyExit.video', 'whyExit.video')
  const alternatives = requireField(data, 'alternatives', 'alternatives (at least 1)') as any[]
  const migrationSteps = requireField(data, 'migrationSteps', 'migrationSteps (at least 1)') as any[]

  const heroImage = await findMediaByFilename(payload, data.heroImage)
  const video = await findMediaByFilename(payload, data.whyExit.video)

  const categoryTitles: string[] = data.categories?.length ? data.categories : [DEFAULT_CATEGORY]
  const categories = await Promise.all(categoryTitles.map((title) => findOrCreateCategory(payload, title)))

  const carouselCategoryOverride = data.carouselCategoryOverride
    ? (await findOrCreateCategory(payload, data.carouselCategoryOverride)).id
    : undefined

  const resolvedAlternatives = await Promise.all(
    alternatives.map(async (alt) => ({
      ctaLabel: alt.ctaLabel,
      description: alt.description,
      difficulty: String(alt.difficulty) as '2' | '3' | '4' | '5',
      image: alt.image ? (await findMediaByFilename(payload, alt.image)).id : undefined,
      name: alt.name,
      rank: alt.rank,
      referralUrl: alt.referralUrl,
      tagline: alt.tagline,
    })),
  )

  return {
    _status: (data.status === 'draft' ? 'draft' : 'published') as 'draft' | 'published',
    categories: categories.map((c) => c.id),
    exitGuide: {
      altsIntro: data.altsIntro,
      altsLabel: data.altsLabel,
      alternatives: resolvedAlternatives,
      appName: data.appName,
      carouselCategoryOverride,
      carouselHeading: data.carouselHeading,
      carouselLimit: data.carouselLimit || 6,
      guideNumber: data.guideNumber ? String(data.guideNumber) : undefined,
      hero: {
        kicker: data.hero?.kicker,
        standfirst: toRichText(data.hero?.standfirst),
        titleLine1: data.hero?.titleLine1,
        titleLine2: data.hero?.titleLine2,
      },
      migrationHeading: data.migrationHeading,
      migrationLabel: data.migrationLabel,
      migrationSteps: migrationSteps.map((step) => ({ body: step.body, title: step.title })),
      subject: {
        label: data.subject?.label,
        specs: data.subject?.specs || [],
        statement: toRichText(data.subject.statement),
      },
      whyExit: {
        label: data.whyExit?.label,
        reasons: data.whyExit?.reasons || [],
        video: video.id,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description: data.meta?.description,
      image: heroImage.id,
      title: data.meta?.title || data.title,
    },
    postType: 'exitGuide' as const,
    slug,
    title: data.title,
  } as any
}

async function buildFromStructured(payload: Payload, fields: Record<string, string>, slug: string) {
  const title = requireTruthy(fields['hero.title'], 'hero.title')
  const statement = requireTruthy(fields['subject.statement'], 'subject.statement')

  const appName = title.replace(/^Leave\s+/i, '').trim()
  const [titleLine1, ...rest] = title.split(' ')
  const titleLine2 = rest.join(' ')

  const specs = (
    [
      { key: 'Jurisdiction', value: fields['subject.jurisdiction'] },
      { key: 'Owner', value: fields['subject.owner'] },
      { key: 'Users', value: fields['subject.users'] },
      { key: 'Model', value: fields['subject.model'] },
    ] as { key: string; value: string | undefined }[]
  ).filter((s): s is { key: string; value: string } => Boolean(s.value))

  const reasons: { body: string; number: string; title: string }[] = []
  for (let i = 1; i <= 5; i++) {
    const idx = String(i).padStart(2, '0')
    const reasonTitle = fields[`reason.${idx}.title`]
    if (!reasonTitle) break
    reasons.push({ body: stripEm(fields[`reason.${idx}.body`]) || '', number: idx, title: reasonTitle })
  }
  if (reasons.length === 0) throw new Error('missing required field "reasons (at least 1)"')

  const alternatives: {
    description: string
    difficulty: '2' | '3' | '4' | '5'
    name: string
    rank: string | undefined
    tagline: string | undefined
  }[] = []
  for (let i = 1; i <= 4; i++) {
    const idx = String(i).padStart(2, '0')
    const name = fields[`alternative.${idx}.name`]
    if (!name) break
    const blurb = stripEm(fields[`alternative.${idx}.blurb`]) || ''
    const caveat = stripEm(fields[`alternative.${idx}.catch`])
    alternatives.push({
      description: caveat ? `${blurb} ${caveat}` : blurb,
      difficulty: parseDifficulty(fields[`alternative.${idx}.difficulty`]),
      name,
      rank: fields[`alternative.${idx}.label`],
      tagline: fields[`alternative.${idx}.locationLine`],
    })
  }
  if (alternatives.length === 0) throw new Error('missing required field "alternatives (at least 1)"')

  const migrationSteps: { body: string; title: string }[] = []
  for (let i = 1; i <= 8; i++) {
    const idx = String(i).padStart(2, '0')
    const stepTitle = fields[`exitRoute.${idx}.title`]
    if (!stepTitle) break
    migrationSteps.push({ body: stripEm(fields[`exitRoute.${idx}.body`]) || '', title: stepTitle })
  }
  if (migrationSteps.length === 0) throw new Error('missing required field "migrationSteps (at least 1)"')

  const categories = await Promise.all([DEFAULT_CATEGORY].map((t) => findOrCreateCategory(payload, t)))

  return {
    _status: 'draft' as const,
    categories: categories.map((c) => c.id),
    exitGuide: {
      altsIntro: stripEm(fields['alternatives.intro']),
      altsLabel: 'The Alternatives [03]',
      alternatives,
      appName,
      carouselHeading: 'Next On The Way Out',
      carouselLimit: 6,
      guideNumber: fields['meta.issueNumber'],
      hero: {
        kicker: fields['hero.eyebrow'],
        standfirst: toRichText(emToBold(fields['hero.standfirst'])),
        titleLine1,
        titleLine2,
      },
      migrationHeading: fields['exitRoute.heading'],
      migrationLabel: 'The Exit Route [04]',
      migrationSteps,
      subject: {
        label: 'The Subject [01]',
        specs,
        statement: toRichText(emToBold(statement)),
      },
      whyExit: {
        label: 'Why Exit [02]',
        reasons,
      },
    },
    postType: 'exitGuide' as const,
    slug,
    title,
  } as any
}

async function importFile(payload: Payload, filePath: string, dryRun: boolean) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)
  const isStructured = Object.keys(data).length === 0
  const slug = data.slug || path.basename(filePath, '.md')

  const postData = isStructured
    ? await buildFromStructured(payload, parseStructuredMarkdown(raw), slug)
    : await buildFromFrontmatter(payload, data, slug)

  const draft = postData._status === 'draft'

  if (dryRun) {
    console.log(`--- ${slug} (${isStructured ? 'structured' : 'frontmatter'}${draft ? ', draft' : ''}) ---`)
    console.log(
      JSON.stringify(
        {
          alternatives: postData.exitGuide.alternatives.map((a: any) => `${a.name} (${a.difficulty})`),
          appName: postData.exitGuide.appName,
          guideNumber: postData.exitGuide.guideNumber,
          migrationSteps: postData.exitGuide.migrationSteps.length,
          reasons: postData.exitGuide.whyExit.reasons.length,
          specs: postData.exitGuide.subject.specs,
          title: postData.title,
        },
        null,
        2,
      ),
    )
    return
  }

  const { docs: existingDocs } = await payload.find({
    collection: 'posts',
    limit: 1,
    where: { slug: { equals: slug } },
  })
  const existing = existingDocs[0]

  const context = { disableRevalidate: true }

  if (existing) {
    await payload.update({ id: existing.id, collection: 'posts', context, data: postData, draft })
    console.log(`updated: ${slug}${draft ? ' (draft)' : ''}`)
  } else {
    await payload.create({ collection: 'posts', context, data: postData, draft })
    console.log(`created: ${slug}${draft ? ' (draft)' : ''}`)
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`No such directory: ${CONTENT_DIR}`)
    process.exit(1)
  }

  const files = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.md') && f.name !== 'README.md')
    .map((f) => f.name)
  console.log(`Found ${files.length} exit-guide file(s) in ${CONTENT_DIR}${dryRun ? ' (dry run)' : ''}`)

  const payload = await getPayload({ config })

  let failed = 0
  for (const file of files) {
    try {
      await importFile(payload, path.join(CONTENT_DIR, file), dryRun)
    } catch (err) {
      failed += 1
      console.error(`FAILED: ${file} — ${err instanceof Error ? err.message : err}`)
    }
  }

  console.log(`Done: ${files.length - failed} succeeded, ${failed} failed.`)
  process.exit(failed > 0 ? 1 : 0)
}

await main()
