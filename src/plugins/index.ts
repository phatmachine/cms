import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { SITE_NAME } from '@/utilities/siteName'

// Google truncates SERP titles at ~60 characters (mid-word, with an
// ellipsis) — that's the damaging failure mode, so it's a hard cap here.
// 50 is only a soft floor: a title a bit short of it still displays fine,
// it just doesn't fill the available SERP width, so it's not worth
// fabricating filler copy to reach it.
const META_TITLE_MAX = 60

// Cuts at the last whole word that still fits, so a too-long title is
// truncated cleanly with an ellipsis instead of getting cut mid-word (or
// left to overflow and have Google truncate it less gracefully).
const truncateAtWord = (str: string, max: number): string => {
  if (str.length <= max) return str
  const cut = str.slice(0, max - 1) // leave room for the ellipsis char
  const lastSpace = cut.lastIndexOf(' ')
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`
}

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  const base = doc?.title?.trim()
  if (!base) return SITE_NAME

  const withBrand = `${base} | ${SITE_NAME}`
  if (withBrand.length <= META_TITLE_MAX) return withBrand

  // Adding the brand suffix would push this over the cap. Prefer dropping
  // the suffix over truncating a title the editor wrote on purpose...
  if (base.length <= META_TITLE_MAX) return base

  // ...unless the title alone is already too long, in which case it has
  // to be shortened regardless of the brand suffix.
  return truncateAtWord(base, META_TITLE_MAX)
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
