import React from 'react'

import type { NarrativeBlock as NarrativeBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'

/**
 * A true 12-column grid: the label sits in columns 1–4, the statement in
 * 5–12. Column 4 is deliberately empty. See
 * `Rethink The Machine - v2/components/sections/NarrativeBlock.jsx`.
 */
export const NarrativeBlock: React.FC<NarrativeBlockProps> = ({ label, statement }) => {
  return (
    <section
      className="bg-rtm-bg text-rtm-fg py-[clamp(80px,16vh,160px)] px-[8vw] max-sm:px-[6vw] grid grid-cols-12 gap-6 scroll-mt-[var(--header-height)]"
      id="our-thesis"
    >
      {label && (
        <div className="col-span-12 md:col-span-3 md:col-start-1">
          <span className="block border-t-[0.5px] border-rtm-accent pt-3 text-rtm-label font-rtm-mono-label tracking-[0.1em] uppercase text-rtm-accent">
            {label}
          </span>
        </div>
      )}

      {statement && (
        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <RichText
            className="[&_p]:m-0 [&_p]:font-rtm-serif [&_p]:italic [&_p]:text-[8vw] md:[&_p]:text-[4vw] [&_p]:leading-[1.1] [&_p]:text-rtm-umber [&_p]:text-pretty [&_em]:not-italic [&_em]:text-rtm-fg"
            data={statement}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      )}
    </section>
  )
}
