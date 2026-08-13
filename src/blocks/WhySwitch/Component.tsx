import type { WhySwitchBlock as WhySwitchBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import React from 'react'

export const WhySwitchBlock: React.FC<WhySwitchBlockProps> = ({ benefits, eyebrow, heading, intro }) => {
  return (
    <div className="py-32">
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

        {benefits && benefits.length > 0 && (
          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
            {benefits.map((benefit, index) => (
              <Reveal
                className="flex flex-col gap-3 border border-hairline rounded-none p-8"
                delay={index * 0.08}
                key={index}
              >
                <span className="text-rtm-caption font-rtm-body tracking-caption text-ink-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="m-0 text-rtm-heading-2 font-rtm-body font-semibold text-ink">
                  {benefit.title}
                </h3>
                <p className="m-0 text-rtm-body font-rtm-body text-ink-secondary">
                  {benefit.description}
                </p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
