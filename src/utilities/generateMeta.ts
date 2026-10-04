import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { DEFAULT_POST_IMAGE_URL } from './defaultPostImage'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { SITE_NAME } from './siteName'

// Tries each candidate in order and uses the first one that resolves to an
// actual uploaded image, falling back to the site-wide default image if none
// do. Posts pass [meta.image, heroImage] — an editor who skips the dedicated
// SEO image still gets a real thumbnail on social/3rd-party previews, as long
// as they set a hero. (The old fallback was /website-template-OG.webp, which
// doesn't exist in public/ — link previews were pointing at a 404.)
const getImageURL = (
  ...images: Array<Media | Config['db']['defaultIDType'] | null | undefined>
) => {
  const serverUrl = getServerSideURL()

  for (const image of images) {
    if (image && typeof image === 'object' && 'url' in image && image.url) {
      return serverUrl + image.url
    }
  }

  return serverUrl + DEFAULT_POST_IMAGE_URL
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  // Page has no heroImage field; the cast is safe since the property
  // access just yields undefined for a Page doc, which getImageURL skips.
  const ogImage = getImageURL(doc?.meta?.image, (doc as Partial<Post> | null)?.heroImage)

  // meta.title is already the complete, final title — whether an editor
  // typed it by hand or it was produced by the SEO tab's Auto Generate
  // button (plugins/index.ts's generateTitle, which already appends the
  // brand and enforces the length cap). Appending the brand again here
  // was double-stacking it into e.g. "Leave Gmail | Rethink The Machine |
  // Rethink The Machine" and blowing past any SEO length budget.
  const title = doc?.meta?.title?.trim() || SITE_NAME

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
