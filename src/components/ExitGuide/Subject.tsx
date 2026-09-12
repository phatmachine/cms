import type { Post } from '@/payload-types'

import RichText from '@/components/RichText'
import React from 'react'

type SubjectProps = {
  subject: NonNullable<NonNullable<Post['exitGuide']>['subject']>
}

/**
 * "The Subject [01]" — the teal indictment statement + spec strip. Base
 * text is set 900 Black; the bolded emphasis phrase is intentionally
 * lighter (700) than its surroundings, matching the reference design's
 * inverted-emphasis treatment.
 */
export const Subject: React.FC<SubjectProps> = ({ subject }) => {
  const { label, specs, statement } = subject

  return (
    <section className="grid grid-cols-12 gap-6 px-[8vw] pt-40 pb-[120px]" id="subject">
      <div className="col-span-12 border-t border-rtm-accent pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase md:col-span-3">
        {label}
      </div>

      <div className="col-span-12 md:col-span-9 md:col-start-5">
        {statement && (
          <RichText
            className="font-rtm-meshed text-[3.4vw] leading-[1.05] tracking-[0.01em] text-rtm-teal uppercase max-sm:text-[7vw] [&_p]:m-0 [&_p]:font-black [&_strong]:font-bold"
            data={statement}
            enableGutter={false}
            enableProse={false}
          />
        )}

        {specs && specs.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {specs.map((spec, i) => (
              <div className="border-t border-rtm-accent pt-3.5" key={spec.id || i}>
                <div className="mb-2.5 font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase">
                  {spec.key}
                </div>
                <div className="font-rtm-mono-label text-[13px] text-rtm-fg uppercase">{spec.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
