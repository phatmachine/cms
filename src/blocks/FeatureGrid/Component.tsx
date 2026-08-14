import React from 'react'

import type { FeatureGridBlock as FeatureGridBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'

export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = ({ cards, heading, tag }) => {
  return (
    <section
      className="relative -my-16 bg-[linear-gradient(180deg,var(--cosmos-900)_0%,var(--cosmos-700)_46%,var(--drift-olive)_100%)] py-[clamp(80px,10vw,144px)]"
      data-theme="signal"
    >
      <div className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,72px)] grid gap-[clamp(40px,5vw,64px)]">
        <Reveal className="flex flex-wrap items-baseline justify-between gap-4 gap-x-8">
          <h2 className="m-0 font-rtm-display font-normal text-[clamp(28px,3.2vw,44px)] leading-[1.06] tracking-[-1.2px] text-star-100 max-w-[20ch]">
            {heading}
          </h2>
          {tag && (
            <span className="text-rtm-caption font-rtm-body tracking-caption text-ink-muted">
              {tag}
            </span>
          )}
        </Reveal>

        <div className="grid gap-px bg-hairline border border-hairline rounded-[var(--radius-md)] overflow-hidden [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {cards?.map((card, i) => (
            <Reveal
              className="bg-[rgba(6,14,20,0.42)] p-[clamp(28px,3vw,40px)] grid gap-3.5 content-start"
              delay={i * 0.09}
              key={i}
            >
              <span className="text-rtm-caption tracking-[0.14em] text-gold-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="m-0 text-rtm-heading-2 font-rtm-body text-star-100">{card.heading}</h3>
              <p className="m-0 text-rtm-body font-rtm-body text-ink-secondary text-pretty">
                {card.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
