import type { Media } from '@/payload-types'

/**
 * The image used wherever a post needs one and doesn't have its own.
 *
 * Lives in public/media/ (NOT the Payload upload folder): that folder is
 * gitignored and, on production, a Docker volume, so a default the code
 * depends on wouldn't deploy with the app. A file in public/ ships with it and
 * has the same URL in every environment. To change the default image, replace
 * public/media/hdr-generic.jpg (and update the size below if the shape changes).
 *
 * next.config.ts must allow this path in `images.localPatterns`.
 */
export const DEFAULT_POST_IMAGE_URL = '/media/hdr-generic.jpg'

/**
 * The default as a Media-shaped object, so every place that already renders a
 * Payload Media (the <Media> component, carousel cards, Card) can take it
 * unchanged. Only the fields those consumers read are meaningful.
 */
export const DEFAULT_POST_IMAGE = {
  id: 'default-post-image',
  // Decorative: it's a generic header, not a picture of anything specific.
  alt: '',
  createdAt: '',
  filename: 'hdr-generic.jpg',
  height: 1536,
  mimeType: 'image/jpeg',
  // Empty on purpose. ImageMedia appends updatedAt to the URL as a cache-tag
  // query string, and the /media/** local pattern permits none.
  updatedAt: '',
  url: DEFAULT_POST_IMAGE_URL,
  width: 2754,
} as Media

type ImageCandidate = Media | null | number | string | undefined

/**
 * First candidate that is an actual, populated image; otherwise the default.
 * A bare string/number is an unpopulated relationship id — there's nothing to
 * render from it, so it doesn't count. Order the candidates by preference,
 * e.g. resolvePostImage(post.heroImage, post.meta?.image).
 */
export const resolvePostImage = (...candidates: ImageCandidate[]): Media => {
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object' && candidate.url) return candidate
  }
  return DEFAULT_POST_IMAGE
}
