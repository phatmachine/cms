import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

import config from '../src/payload.config'
import type { Category } from '../src/payload-types'
import { VERDICT_LABEL } from '../src/utilities/audit'
import { type ParsedAudit, parseAudit, slugify } from '../src/utilities/auditParser'

/**
 * Imports sovereignty-audit files (the output of the `rtm-sovereignty-audit` skill) into
 * Payload as Post docs (postType: audit, category "Audit"), matched and upserted by slug
 * (`audit-<service>`). See .claude/skills/rtm-audit-post/SKILL.md.
 *
 *   npm run import:audits                          every content/audits/*.md
 *   AUDIT_FILES=path/to/file.md npm run import:audits   just that file, from anywhere
 *   DRY_RUN=1 npm run import:audits                parse and report, write nothing
 *   PUBLISH=1 npm run import:audits                publish files that are ready
 *   FORCE_PUBLISHED=1 npm run import:audits        allow overwriting a published post
 *
 * (Env vars, not flags or arguments: `payload run` swallows a bare --dry-run and any
 * extra argument. The flags --dry-run / --publish / --force-published also work when
 * they get through. In PowerShell set the variable first: $env:DRY_RUN=1.)
 *
 * Draft by default. A file only imports as published when you ask (PUBLISH=1), it has no
 * errors and no warnings, and its own `publication_ready` is true. Anything else lands as
 * a draft with the reasons printed, so a half-checked audit can never go live by accident.
 *
 * Like the exit-guide importer, it never deletes a post, and it never overwrites or
 * demotes a published post: the local database, not these files, is the source of truth
 * for what has been published. On an existing post only the `audit` data is replaced;
 * title, categories, SEO and authors are left as they are.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content', 'audits')
const CATEGORY = 'Audit'

const flag = (name: string, env: string) =>
  process.argv.includes(`--${name}`) || process.env[env] === '1'
const DRY_RUN = flag('dry-run', 'DRY_RUN')
const WANT_PUBLISH = flag('publish', 'PUBLISH')
const FORCE_PUBLISHED = flag('force-published', 'FORCE_PUBLISHED')

// The SEO tab warns outside this range (search results truncate beyond it).
const MIN_LENGTH = 100
const MAX_LENGTH = 150

function seoDescription(name: string, verdict: string): string {
  const candidates = [
    `Is ${name} sovereign? Our audit tests ownership, US reach, privacy, military ties, law and the right to leave. Verdict: ${verdict}.`,
    `Our sovereignty audit of ${name}: six tests on ownership, US reach, privacy, military ties, law and exit. Verdict: ${verdict}.`,
    `Sovereignty audit of ${name}: independence, US reach, privacy, military ties, law and the right to leave. Verdict: ${verdict}.`,
    `Our sovereignty audit of ${name} across six tests, with every finding sourced. Verdict: ${verdict}.`,
  ]
  return (
    candidates.find((c) => c.length >= MIN_LENGTH && c.length <= MAX_LENGTH) ??
    candidates.find((c) => c.length <= MAX_LENGTH) ??
    candidates[candidates.length - 1].slice(0, MAX_LENGTH)
  )
}

const iso = (d: null | string) => (d ? `${d}T00:00:00.000Z` : undefined)

async function findOrCreateCategory(payload: Payload, title: string): Promise<Category> {
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: { title: { equals: title } },
  })
  if (docs[0]) return docs[0]
  return payload.create({ collection: 'categories', data: { slug: slugify(title), title } })
}

function auditData(a: ParsedAudit) {
  return {
    alternativeTo: a.alternativeTo,
    blocking: a.blocking.map((item) => ({ item })),
    checkedAt: iso(a.checkedAt),
    companySays: a.companySays || undefined,
    country: a.country || undefined,
    disclaimer: a.disclaimer || undefined,
    integrityRecord: a.integrityRecord || undefined,
    notesForReaders: a.notesForReaders || undefined,
    operator: a.operator || undefined,
    publicationReady: a.publicationReady,
    recheckBy: iso(a.recheckBy),
    rightOfReply: (a.rightOfReply || undefined) as
      | 'declined'
      | 'no-reply'
      | 'not-yet-sent'
      | 'replied'
      | 'sent'
      | undefined,
    scope: a.scope || undefined,
    serviceCategory: a.serviceCategory || undefined,
    serviceDescriptor: a.serviceDescriptor || undefined,
    serviceName: a.serviceName,
    sourceStats: a.sourceStats ?? undefined,
    sources: a.sources.map((s) => ({ ...s, url: s.url || undefined })),
    strongestCaseAgainst: a.strongestCaseAgainst || undefined,
    summary: a.summary || undefined,
    takeaway: a.takeaway || undefined,
    tests: a.tests.map((t) => ({
      finding: t.finding,
      headline: t.headline || undefined,
      key: t.key,
      readerCanDo: t.readerCanDo || undefined,
      result: t.result,
    })),
    unverified: a.unverified,
    verdict: a.verdict as NonNullable<ParsedAudit['verdict']>,
    version: a.version ?? undefined,
    whatWouldChange: a.whatWouldChange || undefined,
  }
}

function listFiles(): string[] {
  // AUDIT_FILES=a.md,b.md imports just those, from anywhere. An env var, not an argument:
  // `payload run` swallows extra command-line arguments.
  const named = (process.env.AUDIT_FILES ?? '')
    .split(/[,;]/)
    .map((f) => f.trim())
    .filter(Boolean)
  if (named.length) return named.map((f) => path.resolve(f))
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter(
      (f) =>
        f.endsWith('.md') &&
        !f.startsWith('_') &&
        f !== 'README.md' &&
        f !== 'register.md' &&
        !f.endsWith('-notes.md'), // internal notes never go to the CMS
    )
    .sort()
    .map((f) => path.join(CONTENT_DIR, f))
}

async function main() {
  const files = listFiles()
  if (files.length === 0) {
    console.error(`No audit files found. Put the skill's .md output in ${CONTENT_DIR} or pass a path.`)
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const context = { disableRevalidate: true }
  let failed = 0

  for (const file of files) {
    const name = path.basename(file)
    const { audit, errors, warnings } = parseAudit(fs.readFileSync(file, 'utf8'))
    console.log(`\n== ${name}`)
    for (const e of errors) console.log(`  ERROR   ${e}`)
    for (const w of warnings) console.log(`  warning ${w}`)

    if (errors.length > 0 || !audit.verdict) {
      console.log(`  skipped: ${errors.length} error(s). Fix the audit file and re-run.`)
      failed++
      continue
    }

    const slug = `audit-${slugify(audit.serviceName)}`
    const canPublish = WANT_PUBLISH && warnings.length === 0 && audit.publicationReady
    const status = canPublish ? ('published' as const) : ('draft' as const)
    if (WANT_PUBLISH && !canPublish) {
      console.log(`  NOT published: ${warnings.length} warning(s) above must be cleared first. Importing as a draft.`)
    }

    const { docs } = await payload.find({
      collection: 'posts',
      draft: true,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { slug: { equals: slug } },
    })
    const existing = docs[0]
    const isPublished = existing?._status === 'published'

    // A published post is never overwritten, and never demoted to a draft by a file that
    // can't itself be published. The local database is the source of truth for it.
    if (isPublished && !FORCE_PUBLISHED) {
      console.log(`  skipped: ${slug} is published. Edit it in the admin, or set FORCE_PUBLISHED=1 to replace its audit data.`)
      continue
    }
    if (isPublished && status === 'draft') {
      console.log(`  skipped: ${slug} is published but this file would import as a draft, demoting the live post.`)
      failed++
      continue
    }

    const verdictLabel = VERDICT_LABEL[audit.verdict] + (audit.unverified ? ' (unverified)' : '')
    const where = existing ? `update ${isPublished ? 'PUBLISHED' : 'draft'} post` : 'create post'
    if (DRY_RUN) {
      console.log(`  DRY RUN: would ${where} ${slug} as ${status} (${verdictLabel}, ${audit.tests.length} tests, ${audit.sources.length} sources)`)
      continue
    }

    const category = await findOrCreateCategory(payload, CATEGORY)
    const data = existing
      ? {
          // Existing post: replace the audit data only; leave title, SEO and categories
          // as they are, apart from filling a missing category.
          ...(existing.categories?.length ? {} : { categories: [category.id] }),
          _status: status,
          audit: auditData(audit),
          postType: 'audit' as const,
          ...(status === 'published' && !existing.publishedAt ? { publishedAt: new Date().toISOString() } : {}),
        }
      : {
          _status: status,
          audit: auditData(audit),
          categories: [category.id],
          meta: { description: seoDescription(audit.serviceName, verdictLabel) },
          postType: 'audit' as const,
          publishedAt: status === 'published' ? new Date().toISOString() : undefined,
          slug,
          title: `Sovereignty audit: ${audit.serviceName}`,
        }

    // Payload types `draft` as a literal and `data` per draft/published overload; both
    // vary at runtime here, so the call is loosely typed (as in import-exit-guides.ts).
    const draft = status === 'draft'
    const saved = existing
      ? await payload.update({ id: existing.id, collection: 'posts', context, data: data as any, draft: draft as true })
      : await payload.create({ collection: 'posts', context, data: data as any, draft: draft as true })

    console.log(`  ${existing ? 'updated' : 'created'}: ${slug} (${status})  ${verdictLabel}`)
    console.log(`    page:  /posts/${slug}${draft ? '   (draft: view it with Preview in the admin)' : ''}`)
    console.log(`    admin: /admin/collections/posts/${saved.id}`)
  }

  console.log(failed > 0 ? `\n${failed} file(s) not imported.` : '\nDone.')
  process.exit(failed > 0 ? 1 : 0)
}

// Top-level await, not a floating promise: `payload run` exits as soon as the module has
// finished evaluating, which would cut the import off before it began.
try {
  await main()
} catch (err) {
  console.error(err)
  process.exit(1)
}
