import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { leavingSlack } from '../src/endpoints/seed/pages-leaving-slack'

/**
 * Creates the "Leaving Slack" example page (see
 * `src/endpoints/seed/pages-leaving-slack.ts`) against a running instance
 * without touching anything else — unlike `payload.seed`/`/api/seed`, this
 * does not clear collections or globals first. Safe to run against
 * production. Run with:
 *
 *   npx payload run scripts/seed-leaving-slack.ts
 */

const readLocalFile = (filePath: string, mimetype: string) => {
  const data = fs.readFileSync(filePath)
  return { name: path.basename(filePath), data, mimetype, size: data.byteLength }
}

const findOrCreateMedia = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
  alt: string,
  filePath: string,
) => {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  if (existing.docs.length > 0) return existing.docs[0]

  return payload.create({
    collection: 'media',
    data: { alt },
    file: readLocalFile(filePath, 'image/jpeg'),
  })
}

// `payload run` awaits this module's own top-level completion (via dynamic
// `import()`) before exiting — a fire-and-forget async call here would let
// it exit while `getPayload()` is still connecting, killing the process
// before anything runs. Top-level `await` is required, not optional.
const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'leaving-slack' } },
  limit: 1,
})

if (existing.docs.length > 0) {
  payload.logger.info(`leaving-slack already exists (id ${existing.docs[0].id}), skipping.`)
} else {
  const photoDir = path.join(process.cwd(), 'public', 'media', 'seed-photography')

  const [heroDoc, stepDoc] = await Promise.all([
    findOrCreateMedia(
      payload,
      'exit-protocol-hero.jpg',
      'A woman with dark hair in a bun and gold jewelry, backlit against a soft pink backdrop',
      path.join(photoDir, 'exit-protocol-hero.jpg'),
    ),
    findOrCreateMedia(
      payload,
      'exit-protocol-step.jpg',
      'A woman works on a laptop amid cabling and hardware on a factory assembly bench',
      path.join(photoDir, 'exit-protocol-step.jpg'),
    ),
  ])

  const page = await payload.create({
    collection: 'pages',
    context: { disableRevalidate: true },
    data: leavingSlack({ heroImages: [heroDoc], stepImage: stepDoc }),
  })

  payload.logger.info(`Created page "${page.title}" (id ${page.id}, slug /${page.slug}).`)
}
