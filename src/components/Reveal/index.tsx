'use client'

import type { ElementType } from 'react'

import { useScrollReveal } from '@/utilities/useScrollReveal'
import React from 'react'

type RevealProps = {
  as?: ElementType
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}

/**
 * Shared reveal-on-scroll wrapper for the new landing-page blocks.
 * Pass an index-based `delay` (e.g. `i * 0.08`) to stagger a grid of cards.
 */
export const Reveal: React.FC<RevealProps> = ({
  as: Tag = 'div',
  children,
  className,
  delay,
  y,
}) => {
  const ref = useScrollReveal<HTMLElement>({ delay, y })

  return (
    <Tag className={className} ref={ref}>
      {children}
    </Tag>
  )
}
