import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Uploads the given video (VIDEO_PATH env var) as a Media doc and switches
 * the homepage hero to Paper/video mode using it. Idempotent: re-running
 * reuses an existing media doc with the same filename instead of
 * duplicating it, and just repoints the homepage hero.
 */

const videoPath = process.env.VIDEO_PATH
if (!videoPath) {
  console.error('VIDEO_PATH env var is required')
  process.exit(1)
}

const readLocalFile = (filePath: string, mimetype: string) => {
  const data = fs.readFileSync(filePath)
  return { name: path.basename(filePath), data, mimetype, size: data.byteLength }
}

const payload = await getPayload({ config })

const filename = path.basename(videoPath)

const existingMedia = await payload.find({
  collection: 'media',
  where: { filename: { equals: filename } },
  limit: 1,
})

const videoDoc =
  existingMedia.docs[0] ||
  (await payload.create({
    collection: 'media',
    data: { alt: 'Looping smoke/hood hero backdrop video' },
    file: readLocalFile(videoPath, 'video/mp4'),
  }))

payload.logger.info(`Video media doc: ${videoDoc.id} (${videoDoc.filename})`)

const homePages = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'home' } },
  limit: 1,
})

if (homePages.docs.length === 0) {
  payload.logger.error('No page with slug "home" found.')
  process.exit(1)
}

const home = homePages.docs[0]

const updated = await payload.update({
  collection: 'pages',
  id: home.id,
  context: { disableRevalidate: true },
  data: {
    hero: {
      ...home.hero,
      paperSettings: {
        ...home.hero?.paperSettings,
        backgroundType: 'video',
        heroVideo: videoDoc.id,
      },
    },
  },
})

payload.logger.info(`Updated homepage (id ${updated.id}) hero to video mode.`)
