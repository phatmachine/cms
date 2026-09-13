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

async function importFile(payload: Payload, filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)
  const slug = data.slug || path.basename(filePath, '.md')

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

  const postData = {
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
  }

  const { docs: existingDocs } = await payload.find({
    collection: 'posts',
    limit: 1,
    where: { slug: { equals: slug } },
  })
  const existing = existingDocs[0]

  const context = { disableRevalidate: true }

  if (existing) {
    await payload.update({ id: existing.id, collection: 'posts', context, data: postData })
    console.log(`updated: ${slug}`)
  } else {
    await payload.create({ collection: 'posts', context, data: postData })
    console.log(`created: ${slug}`)
  }
}

async function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`No such directory: ${CONTENT_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
  console.log(`Found ${files.length} exit-guide file(s) in ${CONTENT_DIR}`)

  const payload = await getPayload({ config })

  let failed = 0
  for (const file of files) {
    try {
      await importFile(payload, path.join(CONTENT_DIR, file))
    } catch (err) {
      failed += 1
      console.error(`FAILED: ${file} — ${err instanceof Error ? err.message : err}`)
    }
  }

  console.log(`Done: ${files.length - failed} succeeded, ${failed} failed.`)
  process.exit(failed > 0 ? 1 : 0)
}

await main()
