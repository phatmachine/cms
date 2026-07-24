import type { TestimonialBlock as TestimonialBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { Star } from 'lucide-react'
import React from 'react'

import styles from './Testimonial.module.css'

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  authorName,
  authorRole,
  avatar,
  quote,
  rating,
}) => {
  return (
    <div className={styles.section}>
      <div className="container">
        <Reveal className={styles.card}>
          {rating && (
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  className={index < rating ? styles.starFilled : styles.starEmpty}
                  fill="currentColor"
                  key={index}
                  size={16}
                />
              ))}
            </div>
          )}

          <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>

          <div className={styles.author}>
            {avatar && (
              <div className={styles.avatar}>
                <Media resource={avatar} />
              </div>
            )}
            <div>
              <div className={styles.authorName}>{authorName}</div>
              {authorRole && <div className={styles.authorRole}>{authorRole}</div>}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
