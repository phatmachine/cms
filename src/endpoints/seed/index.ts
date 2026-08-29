import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'
import type { Media } from '@/payload-types'

import fs from 'fs'
import path from 'path'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { alternativeToGmail } from './pages-alternative-to-gmail'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { slides as slideSeeds } from './slides'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'slides',
  'forms',
  'form-submissions',
  'search',
]

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: { navItems: [] },
      depth: 0,
      context: { disableRevalidate: true },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: { columns: [] },
      depth: 0,
      context: { disableRevalidate: true },
    }),
  ])

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding "Paper" homepage photography...`)

  // The current homepage's real photography — sourced on Unsplash, resized
  // and re-encoded into public/media/seed-photography/. The first four back
  // the homepage hero and its three project rows; the rest are deposited in
  // the media library for later use.
  const seedPhotoDir = path.join(process.cwd(), 'public', 'media', 'seed-photography')
  const seedPhotos = [
    {
      file: 'hero-notes.jpg',
      key: 'heroNotes' as const,
      alt: 'A woman rides a sunlit train carriage, glasses on, looking down — photo by Annie Williams / Unsplash',
    },
    {
      file: 'held-attention.jpg',
      key: 'heldAttention' as const,
      alt: 'A film crew shoots between the seats of a crowded subway carriage — photo by Gene Dizon / Unsplash',
    },
    {
      file: 'glorious-friction.jpg',
      key: 'gloriousFriction' as const,
      alt: 'A woman leaps across a quiet suburban street at golden hour — photo by Tanner Ross / Unsplash',
    },
    {
      file: 'quiet-exit.jpg',
      key: 'quietExit' as const,
      alt: 'A woman asleep, head down on a train table, in warm afternoon light — photo by Abbie Bernet / Unsplash',
    },
    {
      file: 'convenience-store.jpg',
      key: 'convenienceStore' as const,
      alt: 'Two figures beside a lit drinks fridge in a late-night convenience store — photo by Frankie Cordoba / Unsplash',
    },
    {
      file: 'night-walkers.jpg',
      key: 'nightWalkers' as const,
      alt: 'A group of friends walking a path at dusk — photo by Brian Lundquist / Unsplash',
    },
    {
      file: 'rooftop.jpg',
      key: 'rooftop' as const,
      alt: 'Three friends on a rooftop at night, one holding a beer — photo by Sasha Matveeva / Unsplash',
    },
    {
      file: 'skaters.jpg',
      key: 'skaters' as const,
      alt: 'A group of skaters gathered on stone steps at night — photo by Frankie Cordoba / Unsplash',
    },
    {
      file: 'underground-car.jpg',
      key: 'undergroundCar' as const,
      alt: 'A woman with pale hair watches a car pass beneath an overpass — photo by Lesha Tuman / Unsplash',
    },
    {
      file: 'bathtub.jpg',
      key: 'bathtub' as const,
      alt: 'Two people relax with their feet up in a freestanding bathtub — photo by Tomiris Mantaeva / Unsplash',
    },
  ]

  const seedPhotoDocs = Object.fromEntries(
    await Promise.all(
      seedPhotos.map(async ({ file, key, alt }) => {
        const doc = await payload.create({
          collection: 'media',
          data: { alt },
          file: readLocalFile(path.join(seedPhotoDir, file), 'image/jpeg'),
        })
        return [key, doc] as const
      }),
    ),
  ) as Record<(typeof seedPhotos)[number]['key'], Media>

  payload.logger.info(`— Seeding example page (Leaving Gmail)...`)

  const leavingGmailPage = await payload.create({
    collection: 'pages',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: alternativeToGmail({
      heroImage: imageHomeDoc,
      imageA: image1Doc,
      imageB: image2Doc,
      imageC: image3Doc,
    }),
  })

  payload.logger.info(`— Seeding carousel slides...`)

  const slide1VideoBuffer = readLocalFile(
    path.join(process.cwd(), 'public', 'media', 'slide-1.mp4'),
    'video/mp4',
  )

  const slide1Video = await payload.create({
    collection: 'media',
    data: { alt: 'Gmail inbox — looping background video' },
    file: slide1VideoBuffer,
  })

  const slideDocs = await Promise.all(
    slideSeeds.map((slide, i) =>
      payload.create({
        collection: 'slides',
        depth: 0,
        data: {
          ...slide,
          background: i === 0 ? slide1Video.id : undefined,
          link:
            i === 0
              ? {
                  type: 'reference',
                  reference: { relationTo: 'pages', value: leavingGmailPage.id },
                }
              : undefined,
        },
      }),
    ),
  )

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: home({
        heroImage: seedPhotoDocs.heroNotes,
        metaImage: seedPhotoDocs.heroNotes,
        projectImageCommute: seedPhotoDocs.heldAttention,
        projectImageJump: seedPhotoDocs.gloriousFriction,
        projectImageRest: seedPhotoDocs.quietExit,
      }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context: {
        disableRevalidate: true,
      },
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Our thesis', url: '/#our-thesis' }, meta: 'Position' },
          { link: { type: 'custom', label: 'Field notes', url: '/posts' }, meta: 'Receipts' },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: { relationTo: 'pages', value: contactPage.id },
            },
            meta: 'Say hello',
          },
        ],
        footerLinks: [
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: { relationTo: 'pages', value: contactPage.id },
            },
          },
          { link: { type: 'custom', label: 'Press', url: '#press' } },
          { link: { type: 'custom', label: 'RSS', url: '/posts-sitemap.xml' } },
          { link: { type: 'custom', label: 'TikTok', url: '#tiktok' } },
        ],
        footerNote: 'No guilt at your exit. Close this whenever you want.',
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      context: {
        disableRevalidate: true,
      },
      data: {
        headline: 'Anti-manipulation, not anti-internet.',
        subhead:
          'Field notes on attention, on sovereignty, on the choices built into things that were built to feel chosen.',
        missionLine:
          'A study of the gap between mind and model — and what it costs us to close it.',
        signatureLine: 'We go where the patient is.',
        copyrightText: '© 2026 Rethink the Machine',
        disclosure:
          "No dark patterns on this site: disclosure always, no synthetic anything undeclared, no guilt at your exit. You can leave whenever you want. That's the point.",
        columns: [
          {
            heading: 'Navigate',
            links: [
              { link: { type: 'custom', label: 'Home', url: '/' } },
              { link: { type: 'custom', label: 'Our thesis', url: '/#our-thesis' } },
              { link: { type: 'custom', label: 'Field notes', url: '/posts' } },
            ],
          },
          {
            heading: 'Inquiry',
            links: [
              { link: { type: 'custom', label: 'About', url: '#about' } },
              { link: { type: 'custom', label: 'Method', url: '#method' } },
              {
                link: {
                  type: 'reference',
                  label: 'Contact',
                  reference: { relationTo: 'pages', value: contactPage.id },
                },
              },
              { link: { type: 'custom', label: 'Press', url: '#press' } },
            ],
          },
          {
            heading: 'Elsewhere',
            links: [
              { link: { type: 'custom', label: 'Notes by email', url: '#newsletter' } },
              { link: { type: 'custom', label: 'TikTok', url: '#tiktok' } },
              { link: { type: 'custom', label: 'RSS', url: '/posts-sitemap.xml' } },
            ],
          },
        ],
        legalLinks: [
          { link: { type: 'custom', label: 'Privacy', url: '/privacy' } },
          { link: { type: 'custom', label: 'Terms', url: '/terms' } },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

function readLocalFile(filePath: string, mimetype: string): File {
  const data = fs.readFileSync(filePath)

  return {
    name: path.basename(filePath),
    data,
    mimetype,
    size: data.byteLength,
  }
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
