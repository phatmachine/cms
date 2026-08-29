import type { WhySwitchBlock as WhySwitchBlockProps } from '@/payload-types'

import { ExitSectionHeader } from '@/components/ExitSectionHeader'
import { Reveal } from '@/components/Reveal'
import React from 'react'

export const WhySwitchBlock: React.FC<WhySwitchBlockProps> = ({
  benefits,
  eyebrow,
  heading,
  intro,
}) => {
  return (
    <section className="bg-rtm-bg px-[8vw] py-[clamp(80px,12vh,140px)]">
      <ExitSectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

      {benefits && benefits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[clamp(32px,4vw,56px)]">
          {benefits.map((benefit, index) => (
            <Reveal
              className="flex flex-col gap-3.5 border-t-[0.5px] border-rtm-accent pt-4"
              delay={index * 0.08}
              key={index}
            >
              <span className="font-rtm-mono-label text-[10px] tracking-[0.15em] text-rtm-accent">
                [{String(index + 1).padStart(3, '0')}]
              </span>
              <h3 className="m-0 font-rtm-display font-bold text-[20px] leading-[1.2] tracking-[-0.02em] uppercase text-rtm-fg">
                {benefit.title}
              </h3>
              <p className="m-0 font-rtm-serif text-[18px] leading-[1.4] text-rtm-umber">
                {benefit.description}
              </p>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
