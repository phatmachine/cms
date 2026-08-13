import type { TestimonialBlock as TestimonialBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { Star } from 'lucide-react'
import React from 'react'

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  authorName,
  authorRole,
  avatar,
  quote,
  rating,
}) => {
  return (
    <div className="py-32">
      <div className="container">
        <Reveal className="max-w-[720px] mx-auto flex flex-col items-center gap-6 text-center">
          {rating && (
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  className={index < rating ? 'text-action' : 'text-hairline-strong'}
                  fill="currentColor"
                  key={index}
                  size={16}
                />
              ))}
            </div>
          )}

          <p className="m-0 text-rtm-display-3 tracking-display-3 font-rtm-display font-normal text-ink text-pretty">
            &ldquo;{quote}&rdquo;
          </p>

          <div className="flex items-center gap-3">
            {avatar && (
              <div className="w-10 h-10 rounded-full overflow-hidden [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
                <Media resource={avatar} />
              </div>
            )}
            <div>
              <div className="text-rtm-body-sm font-rtm-body font-semibold text-ink">
                {authorName}
              </div>
              {authorRole && (
                <div className="text-rtm-caption font-rtm-body text-ink-muted">{authorRole}</div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
