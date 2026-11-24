import type { Metadata } from 'next/types'

import { Media } from '@/components/Media'
import { DEFAULT_POST_IMAGE } from '@/utilities/defaultPostImage'
import { CategoryFilters } from '@/components/CategoryFilters'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

// Dynamic: the category filter lives in the query string.
export const dynamic = 'force-dynamic'

type Args = {
  searchParams: Promise<{ category?: string }>
}

export default async function Page({ searchParams }: Args) {
  const { category: categorySlug } = await searchParams
  const payload = await getPayload({ config: configPromise })

  // Background is managed in Payload: Globals > Posts Page.
  const settings = await payload.findGlobal({ slug: 'postsPage', depth: 1 })
  const bg =
    settings.backgroundMedia && typeof settings.backgroundMedia === 'object'
      ? settings.backgroundMedia
      : DEFAULT_POST_IMAGE
  const bgOpacity = (settings.backgroundOpacity ?? 50) / 100

  // Filter options: only categories that at least one visible post uses.
  const tagged = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 0,
    pagination: false,
    overrideAccess: false,
    select: { categories: true },
  })
  const seen = new Map<string, { id: string; slug: string; title: string }>()
  for (const post of tagged.docs) {
    for (const cat of post.categories ?? []) {
      if (typeof cat === 'object' && cat?.slug && cat.title) {
        seen.set(cat.id, { id: cat.id, slug: cat.slug, title: cat.title })
      }
    }
  }
  const categories = [...seen.values()].sort((a, b) => a.title.localeCompare(b.title))
  const active = categories.find((c) => c.slug === categorySlug)

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    ...(active ? { where: { categories: { equals: active.id } }, limit: 100 } : {}),
    select: {
      title: true,
      slug: true,
      categories: true,
      // Only the Jurisdiction spec, for the flag on each card.
      exitGuide: { subject: { specs: true } },
      heroImage: true,
      meta: true,
    },
  })

  return (
    <div className="relative isolate pt-24 pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ opacity: bgOpacity }}
      >
        <Media fill imgClassName="object-cover" resource={bg} />
      </div>
      <PageClient />
      <div className="container mb-10">
        <h1 className="m-0 font-rtm-display text-[12vw] leading-[0.85] font-black tracking-[-0.05em] text-white uppercase max-sm:text-[16vw]">
          The Pushback
        </h1>
      </div>

      <div className="container mb-10">
        <CategoryFilters active={active?.slug} categories={categories} />
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={active ? 100 : 12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {!active && posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Rethink The Machine Posts`,
  }
}
