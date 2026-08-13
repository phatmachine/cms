import { cn } from '@/utilities/ui'
import React from 'react'

type SectionHeaderProps = {
  align?: 'center' | 'left'
  className?: string
  eyebrow?: null | string
  heading?: null | string
  intro?: null | string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  align = 'left',
  className,
  eyebrow,
  heading,
  intro,
}) => {
  if (!eyebrow && !heading && !intro) return null

  return (
    <div
      className={cn(
        'flex max-w-[680px] flex-col gap-3 mb-16',
        align === 'center' && 'mx-auto max-w-[620px] text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="text-rtm-label font-rtm-body font-semibold tracking-label text-action uppercase">
          {eyebrow}
        </span>
      )}
      {heading && (
        <h2 className="m-0 text-rtm-display-3 tracking-display-3 sm:text-rtm-display-2 sm:tracking-display-2 font-rtm-display font-normal text-ink text-pretty">
          {heading}
        </h2>
      )}
      {intro && (
        <p className="m-0 text-rtm-body-lg font-rtm-body font-normal text-ink-secondary text-pretty">
          {intro}
        </p>
      )}
    </div>
  )
}
