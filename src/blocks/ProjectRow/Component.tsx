import React from 'react'

import type { ProjectRowBlock as ProjectRowBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const glow = { textShadow: '0 0 40px var(--rtm-bg)' }

/**
 * One gallery row: an oversized, rotated photo slab bleeding past the trim,
 * with the caption block overlapping its far corner. Alternates rotation
 * and layout by `side`. See
 * `Rethink The Machine - v2/components/sections/ProjectRow.jsx`.
 */
export const ProjectRowBlock: React.FC<ProjectRowBlockProps> = ({
  description,
  image,
  link: cta,
  number,
  side = 'left',
  title,
}) => {
  const isLeft = side !== 'right'

  return (
    <div
      className={cn(
        'relative flex items-stretch min-h-[80vh] mb-[12vh] md:mb-[24vh] max-md:flex-col',
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse',
      )}
    >
      <div
        className={cn(
          'group relative flex-shrink-0 w-full md:w-[88vw] h-[50vh] md:h-[85vh] min-h-[320px] md:min-h-[600px] overflow-hidden bg-rtm-ground-slab',
          isLeft ? 'md:-ml-[4vw] rotate-0 md:-rotate-[1.2deg]' : 'md:-mr-[4vw] rotate-0 md:rotate-[1.2deg]',
        )}
      >
        {image && typeof image === 'object' && (
          <div className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%]">
            <Media
              fill
              imgClassName="object-cover [filter:sepia(0.2)_contrast(1)] [transition:transform_1.2s_cubic-bezier(0.16,1,0.3,1),filter_0.6s_ease] group-hover:[filter:sepia(0)_contrast(1.05)] group-hover:scale-[1.03] group-hover:-translate-y-[1%]"
              resource={image}
            />
          </div>
        )}
      </div>

      <div
        className={cn(
          'relative z-[2] w-full md:w-[40%] flex flex-col justify-end px-[6vw] py-8 md:py-[6vw] md:px-[3vw] -mt-16 md:mt-0',
          isLeft
            ? 'md:absolute md:bottom-0 md:-right-[2vw] items-start text-left'
            : 'md:absolute md:bottom-0 md:-left-[2vw] items-end text-right',
        )}
      >
        {number && (
          <span
            className="mb-6 text-[10px] font-rtm-mono-label text-rtm-fg"
            style={glow}
          >
            {number}
          </span>
        )}
        {title && (
          <h3
            className="m-0 mb-5 font-rtm-display font-bold uppercase text-[clamp(28px,5vw,64px)] leading-[1.2] tracking-[-0.02em] text-rtm-fg text-pretty"
            style={glow}
          >
            {title}
          </h3>
        )}
        {description && (
          <p
            className={cn(
              'm-0 max-w-[42ch] font-rtm-serif text-[18px] leading-[1.4] text-rtm-fg text-pretty',
              isLeft ? 'text-left' : 'text-right',
            )}
            style={glow}
          >
            {description}
          </p>
        )}
        {cta?.label && (cta?.url || cta?.reference) && (
          <CMSLink
            {...cta}
            appearance="inline"
            className="mt-10 flex items-center justify-center w-[120px] h-[120px] rounded-full border border-rtm-accent bg-[rgba(253,252,247,0.5)] backdrop-blur-[5px] text-rtm-fg text-[9px] font-rtm-mono-label uppercase no-underline text-center [transition:all_0.4s_ease] hover:bg-rtm-umber hover:text-rtm-bg hover:border-rtm-umber"
          />
        )}
      </div>
    </div>
  )
}
