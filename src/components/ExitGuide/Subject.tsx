import type { Post } from '@/payload-types'

import RichText from '@/components/RichText'
import React from 'react'

import { Reveal } from '@/components/Reveal'

import { JurisdictionValue } from './JurisdictionValue'

type SubjectProps = {
  subject: NonNullable<NonNullable<Post['exitGuide']>['subject']>
}

/**
 * "The Subject [01]" — the magenta indictment statement + spec strip. Base
 * text is set 900 Black; the bolded emphasis phrase is intentionally
 * lighter (700) than its surroundings, matching the reference design's
 * inverted-emphasis treatment.
 */
export const Subject: React.FC<SubjectProps> = ({ subject }) => {
  const { label, specs, statement } = subject

  return (
    <section
      className="grid grid-cols-12 gap-6 bg-rtm-bg px-[8vw] pt-40 pb-[120px]"
      id="subject"
    >
      <Reveal className="col-span-12 border-t border-rtm-accent pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase md:col-span-3">
        {label}
      </Reveal>

      <div className="col-span-12 md:col-span-9 md:col-start-5">
        {statement && (
          <Reveal delay={0.1}>
            <RichText
              className="font-rtm-meshed text-[3.4vw] leading-[1.05] tracking-[0.01em] text-rtm-magenta uppercase max-sm:text-[7vw] [&_p]:m-0 [&_p]:font-black [&_strong]:font-bold"
              data={statement}
              enableGutter={false}
              enableProse={false}
            />
          </Reveal>
        )}

        {specs && specs.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {specs.map((spec, i) => (
              <Reveal
                as="div"
                className="border-t border-rtm-accent pt-3.5"
                delay={0.2 + i * 0.06}
                key={spec.id || i}
              >
                <div className="mb-2.5 font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase">
                  {spec.key}
                </div>
                <div className="font-rtm-mono-label text-[13px] text-rtm-fg uppercase">
                  {/^jurisdiction$/i.test(spec.key) ? <JurisdictionValue value={spec.value} /> : spec.value}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
