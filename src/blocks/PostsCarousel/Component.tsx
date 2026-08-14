import type { Post, PostsCarouselBlock as PostsCarouselBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { CarouselClient } from './Carousel.client'

export const PostsCarouselBlock: React.FC<
  PostsCarouselBlockProps & {
    id?: string
  }
> = async (props) => {
  const { categories, eyebrow, heading, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 12

  let posts: Post[] = []

  if (populateBy === 'selection') {
    if (selectedDocs?.length) {
      posts = selectedDocs
        .map((post) => (typeof post.value === 'object' ? post.value : null))
        .filter((post): post is Post => Boolean(post))
    }
  } else {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) =>
      typeof category === 'object' ? category.id : category,
    )

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      sort: '-publishedAt',
      ...(flattenedCategories && flattenedCategories.length > 0
        ? { where: { categories: { in: flattenedCategories } } }
        : {}),
    })

    posts = fetchedPosts.docs
  }

  const cards = posts.map((post) => {
    const category = post.categories?.find((c) => typeof c === 'object') as
      | { title?: string | null }
      | undefined

    return {
      href: `/posts/${post.slug}`,
      image: typeof post.heroImage === 'object' ? post.heroImage : null,
      kicker: category?.title || null,
      title: post.title,
    }
  })

  return <CarouselClient cards={cards} eyebrow={eyebrow} heading={heading} />
}
