'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { resolvePostImage } from '@/utilities/defaultPostImage'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'heroImage' | 'meta' | 'title'> & {
  // Only the Jurisdiction spec is read (for the flag); typed narrowly so a
  // query can `select` just exitGuide.subject.specs instead of the whole guide.
  exitGuide?: {
    subject?: { specs?: { key: string; value: string }[] | null } | null
  } | null
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  /**
   * Flag(s) for the post's originating country, shown at the right of the
   * category row. A prop rather than rendered here because Card is a client
   * component and the full flag set must stay in the server bundle — the
   * (server) parent renders it and passes the result in.
   */
  flag?: React.ReactNode
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, flag, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, heroImage, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {/* heroImage, then the SEO tab's image, then the site-wide default.
            (Search results carry no heroImage — they only have meta.image.) */}
        <Media resource={resolvePostImage(heroImage, metaImage)} size="33vw" />
      </div>
      <div className="p-4">
        {((showCategories && hasCategories) || flag) && (
          // Category label on the left, the originating country's flag(s) on
          // the right of the same row. ml-auto keeps the flag right-aligned
          // even when the categories are hidden and it's the only thing here.
          <div className="mb-4 flex items-center justify-between gap-3">
            {showCategories && hasCategories && (
              <div className="uppercase text-sm">
                {categories?.map((category, index) => {
                  if (typeof category === 'object') {
                    const { title: titleFromCategory } = category

                    const categoryTitle = titleFromCategory || 'Untitled category'

                    const isLast = index === categories.length - 1

                    return (
                      <Fragment key={index}>
                        {categoryTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    )
                  }

                  return null
                })}
              </div>
            )}
            {flag && (
              <div className="ml-auto flex shrink-0 items-center gap-1.5 text-sm">{flag}</div>
            )}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
