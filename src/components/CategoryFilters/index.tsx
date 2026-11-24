import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

type FilterCategory = { id: string; slug: string; title: string }

type Props = {
  categories: FilterCategory[]
  active?: string
  className?: string
}

const pill =
  'inline-flex items-center gap-3 rounded-[10px] border px-4 py-2 font-rtm-meshed text-[17px] font-bold leading-none transition-colors duration-200'

/**
 * Category filter row for the posts index. Plain links (`/posts?category=slug`),
 * so it works without client JS and each filter is shareable. The active pill
 * is filled with a × that clears the filter.
 */
export const CategoryFilters: React.FC<Props> = ({ active, categories, className }) => {
  if (categories.length === 0) return null

  return (
    <nav aria-label="Filter posts by category" className={cn('flex flex-wrap gap-3', className)}>
      <Link
        aria-current={!active ? 'true' : undefined}
        className={cn(
          pill,
          !active
            ? 'border-rtm-teal-dark bg-rtm-teal-dark text-[#d5f3f4]'
            : 'border-rtm-teal-dark bg-rtm-teal text-[#d5f3f4] hover:bg-rtm-teal/80',
        )}
        href="/posts"
        scroll={false}
      >
        All
      </Link>

      {categories.map((category) => {
        const isActive = category.slug === active
        return (
          <Link
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              pill,
              isActive
                ? 'border-rtm-teal-dark bg-rtm-teal-dark text-[#d5f3f4]'
                : 'border-rtm-teal-dark bg-rtm-teal text-[#d5f3f4] hover:bg-rtm-teal/80',
            )}
            href={isActive ? '/posts' : `/posts?category=${encodeURIComponent(category.slug)}`}
            key={category.id}
            scroll={false}
          >
            {category.title}
            {isActive && (
              <span aria-label="Clear filter" className="text-[20px] leading-none">
                ×
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
