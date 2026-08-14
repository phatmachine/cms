import React from 'react'

import type { StatsShelfBlock as StatsShelfBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'

export const StatsShelfBlock: React.FC<StatsShelfBlockProps> = ({ footnote, heading, stats }) => {
  return (
    <section
      className="relative -my-16 bg-[linear-gradient(180deg,var(--drift-olive)_0%,var(--drift-bronze)_55%,var(--drift-brass)_84%,var(--gold-700)_100%)] py-[clamp(80px,10vw,144px)] overflow-hidden"
      data-theme="signal"
    >
      <div className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,72px)] grid gap-[clamp(40px,5vw,72px)]">
        <Reveal as="h2" className="m-0 font-rtm-display font-normal text-[clamp(28px,3.2vw,44px)] leading-[1.06] tracking-[-1.2px] text-star-50 max-w-[24ch]">
          {heading}
        </Reveal>

        <div className="grid">
          {stats?.map((stat, i) => (
            <div
              className="grid gap-[clamp(20px,4vw,56px)] items-start py-[clamp(24px,3vw,36px)] border-t border-[rgba(251,244,222,0.22)] [grid-template-columns:minmax(120px,0.42fr)_minmax(0,1fr)]"
              key={i}
            >
              <span className="font-rtm-display font-normal text-[clamp(34px,5vw,68px)] leading-[0.95] tracking-[-2px] text-star-50">
                {stat.figure}
              </span>
              <div className="grid gap-2">
                <p className="m-0 text-[clamp(17px,1.5vw,21px)] leading-[1.5] font-rtm-body text-star-100 max-w-[52ch] text-pretty">
                  {stat.claim}
                </p>
                {stat.source && (
                  <span className="text-rtm-caption font-rtm-body tracking-caption text-star-200 opacity-[0.72]">
                    {stat.source}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {footnote && (
          <p className="m-0 text-rtm-body-sm font-rtm-body text-star-200 max-w-[60ch]">{footnote}</p>
        )}
      </div>
    </section>
  )
}
