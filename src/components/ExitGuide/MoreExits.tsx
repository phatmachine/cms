import type { Media as MediaType, Post } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import { MoreExitsCarousel } from './MoreExitsCarousel.client'

export type ExitCard = {
  appName: string
  category: null | string
  href: string
  image: MediaType | null
}

const toCards = (posts: Post[]): ExitCard[] =>
  posts.map((post) => {
    const category = post.categories?.find((c) => typeof c === 'object') as
      | { title?: null | string }
      | undefined

    return {
      appName: post.exitGuide?.appName || post.title,
      category: category?.title || null,
      href: `/posts/${post.slug}`,
      image: typeof post.heroImage === 'object' ? post.heroImage : null,
    }
  })

/**
 * "More Exits [05]" — a live query, never authored content (requirement 2
 * of the handoff). Uses this post's own categories unless
 * `carouselCategoryOverride` is set, excludes the current post, and widens
 * in two steps (drop the category filter, then drop the exit-guide-only
 * filter) so the rail never renders near-empty.
 */
export const MoreExits: React.FC<{ post: Post }> = async ({ post }) => {
  const { exitGuide } = post
  if (!exitGuide) return null

  const payload = await getPayload({ config: configPromise })

  const overrideId =
    typeof exitGuide.carouselCategoryOverride === 'object'
      ? exitGuide.carouselCategoryOverride?.id
      : exitGuide.carouselCategoryOverride

  const ownCategoryIds = (post.categories || [])
    .map((category) => (typeof category === 'object' ? category.id : category))
    .filter(Boolean)

  const categoryIds = overrideId ? [overrideId] : ownCategoryIds
  const limit = exitGuide.carouselLimit || 6

  const excludeSelfAndType: Where = {
    and: [{ id: { not_equals: post.id } }, { postType: { equals: 'exitGuide' } }],
  }

  let docs: Post[] = []

  if (categoryIds.length > 0) {
    const byCategory = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      sort: '-publishedAt',
      where: { and: [...(excludeSelfAndType.and as Where[]), { categories: { in: categoryIds } }] },
    })
    docs = byCategory.docs
  }

  if (docs.length < 3) {
    const widened = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      sort: '-publishedAt',
      where: excludeSelfAndType,
    })
    docs = widened.docs
  }

  if (docs.length < 3) {
    const anyPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      sort: '-publishedAt',
      where: { id: { not_equals: post.id } },
    })
    docs = anyPosts.docs
  }

  if (docs.length === 0) return null

  return <MoreExitsCarousel cards={toCards(docs)} heading={exitGuide.carouselHeading} />
}
