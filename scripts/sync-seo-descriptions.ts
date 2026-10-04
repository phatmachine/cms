import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Copies each exit guide's SEO description from content/exit-guides/*.md onto
 * the matching Post's `meta.description` (the SEO tab) — and touches nothing
 * else. Edit the `## meta.description` entry (YAML files: `meta:` →
 * `description:`), then run `npm run import:seo-descriptions`.
 *
 * Why this exists separately from import-exit-guides.ts: that importer
 * rebuilds whole posts, so it skips published posts whose file can't itself be
 * published, needs every hero image to already be in the Media collection, and
 * replaces arrays wholesale. None of that is relevant to one text field, and
 * none of it should stand between an editor and a corrected description. This
 * script only ever writes `meta.description`, on posts that already exist.
 *
 * Safe to re-run: posts whose description already matches are left alone, and
 * it never creates or deletes a post or changes one's published/draft status.
 * Where it writes depends on the post:
 *  - published, nothing pending  -> written live.
 *  - published, with a newer unpublished draft -> saved to that draft only;
 *    the live page is untouched until you publish the draft in the admin.
 *  - draft (never published)     -> saved to its draft, where the SEO tab
 *    shows it.
 * Preview first with DRY_RUN=1 (the env var, not a flag — `payload run`
 * swallows a bare --dry-run). SKIP_SLUGS=a,b leaves those posts alone.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content', 'exit-guides')

// The SEO tab warns outside this range (search results truncate beyond it).
const MIN_LENGTH = 100
const MAX_LENGTH = 150

const dryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1'

// SKIP_SLUGS=leave-a,leave-b leaves those posts' descriptions alone — for when
// the description in the database is one you want to keep over the file's.
const skipSlugs = new Set(
  (process.env.SKIP_SLUGS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)

type Entry = { description: string | undefined; slug: string }

// Same two source formats as the importer, auto-detected per file: YAML
// frontmatter, or "structured markdown" (a flat `## field.path` heading per
// value). Only meta.description is read.
function readEntry(filePath: string): Entry {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)
  const fallbackSlug = path.basename(filePath, '.md')

  if (Object.keys(data).length > 0) {
    const description = typeof data.meta?.description === 'string' ? data.meta.description : undefined
    return { description: description?.trim() || undefined, slug: data.slug || fallbackSlug }
  }

  let inEntry = false
  const buffer: string[] = []
  for (const line of raw.split(/\r?\n/)) {
    const heading = line.match(/^##\s+([\w.]+)\s*$/)
    if (heading) {
      if (inEntry) break
      inEntry = heading[1] === 'meta.description'
    } else if (inEntry) {
      buffer.push(line)
    }
  }
  return { description: buffer.join('\n').trim() || undefined, slug: fallbackSlug }
}

async function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`No such directory: ${CONTENT_DIR}`)
    process.exit(1)
  }

  const files = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.md') && f.name !== 'README.md')
    .map((f) => f.name)
  console.log(`Found ${files.length} exit-guide file(s)${dryRun ? ' (dry run — nothing will be written)' : ''}`)

  const payload = await getPayload({ config })

  let updated = 0
  let unchanged = 0
  let skipped = 0
  let failed = 0

  for (const file of files) {
    try {
      const { description, slug } = readEntry(path.join(CONTENT_DIR, file))

      if (skipSlugs.has(slug)) {
        console.log(`skipped:   ${slug} — listed in SKIP_SLUGS`)
        skipped += 1
        continue
      }
      if (!description) {
        console.log(`skipped:   ${file} — no meta.description entry`)
        skipped += 1
        continue
      }
      if (description.length < MIN_LENGTH || description.length > MAX_LENGTH) {
        throw new Error(
          `meta.description is ${description.length} chars; it must be ${MIN_LENGTH}–${MAX_LENGTH}`,
        )
      }

      const { docs } = await payload.find({
        collection: 'posts',
        depth: 0,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      const post = docs[0] // the live (main) record
      if (!post) {
        console.log(`skipped:   ${slug} — no post with this slug in the database (create it first)`)
        skipped += 1
        continue
      }

      // What the admin panel shows: the latest version, which can be a newer
      // unpublished draft than the live record.
      const latest = await payload.findByID({ collection: 'posts', depth: 0, draft: true, id: post.id })

      // Payload builds every update on the LATEST version, not the live
      // record. A normal (non-draft) update on a published post that has
      // pending draft changes would therefore publish those changes and take
      // the draft's status — silently unpublishing the post. (Learned the hard
      // way.) So a post is only written live when it's published AND has no
      // pending draft; otherwise the description is saved as a draft version
      // and the live record is left exactly as it is.
      const isLive = post._status === 'published'
      const hasPendingDraft = isLive && latest._status === 'draft'
      const asDraft = !isLive || hasPendingDraft

      const current = latest.meta?.description ?? ''
      if (current === description) {
        console.log(`unchanged: ${slug}`)
        unchanged += 1
        continue
      }

      const change = current ? `replacing: "${current}"` : 'was empty'
      const where = asDraft
        ? isLive
          ? 'saved to its pending draft — live page untouched; publish it in the admin to take it live'
          : 'saved to its draft'
        : 'live'
      if (dryRun) {
        console.log(
          `would set: ${slug} (${description.length} chars, ${change}) — ${where}\n           "${description}"`,
        )
        updated += 1
        continue
      }

      await payload.update({
        id: post.id,
        collection: 'posts',
        // The rest of the SEO group (title, image) is re-sent as-is rather
        // than relying on Payload merging a partial group, so it can't be lost.
        // _status is stated outright for a live write so it can't drift.
        data: { meta: { ...latest.meta, description }, ...(asDraft ? {} : { _status: 'published' as const }) },
        depth: 0,
        // Drafts skip required-field validation (the importer relies on the
        // same thing).
        draft: asDraft,
        // revalidatePath/Tag need a Next request context, which a script
        // doesn't have.
        context: { disableRevalidate: true },
      })

      // Belt and braces: whatever happened above, the live record's status
      // must not have moved. If it did, say so loudly rather than report success.
      const after = await payload.findByID({ collection: 'posts', depth: 0, id: post.id })
      if (after._status !== post._status) {
        throw new Error(
          `${slug} changed status from "${post._status}" to "${after._status}" — restore it in the admin`,
        )
      }

      console.log(`updated:   ${slug} (${description.length} chars, ${change}) — ${where}`)
      updated += 1
    } catch (err) {
      failed += 1
      console.error(`FAILED:    ${file} — ${err instanceof Error ? err.message : err}`)
    }
  }

  console.log(
    `Done: ${updated} ${dryRun ? 'would be updated' : 'updated'}, ${unchanged} unchanged, ${skipped} skipped, ${failed} failed.`,
  )
  process.exit(failed > 0 ? 1 : 0)
}

await main()
