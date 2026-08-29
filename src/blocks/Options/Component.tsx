import type { OptionsBlock as OptionsBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ExitSectionHeader } from '@/components/ExitSectionHeader'
import { Reveal } from '@/components/Reveal'
import React from 'react'

const badgeLabel: Record<string, string> = {
  'editor-pick': "Editor's pick",
  'free': 'Free',
  'open-source': 'Open source',
}

export const OptionsBlock: React.FC<OptionsBlockProps> = ({ eyebrow, heading, intro, options }) => {
  return (
    <section className="bg-rtm-ground-slab px-[8vw] py-[clamp(80px,12vh,140px)]" id="options">
      <ExitSectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

      {options && options.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,96px)]">
          {options.map((option, index) => (
            <Reveal
              className="flex flex-col gap-[18px] border-t border-rtm-accent pt-7"
              delay={index * 0.08}
              key={index}
            >
              {option.badge && option.badge !== 'none' && (
                <span className="font-rtm-mono-label text-[10px] tracking-[0.15em] uppercase text-rtm-umber">
                  {badgeLabel[option.badge]}
                </span>
              )}

              <h3 className="m-0 font-rtm-display font-bold text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-[-0.02em] uppercase text-rtm-fg">
                {option.name}
              </h3>
              {option.tagline && (
                <p className="m-0 font-rtm-serif italic text-[20px] leading-[1.4] text-rtm-umber">
                  {option.tagline}
                </p>
              )}
              {option.description && (
                <p className="m-0 font-rtm-serif text-[18px] leading-[1.4] text-rtm-umber max-w-[44ch]">
                  {option.description}
                </p>
              )}

              <div className="mt-2 flex items-center justify-between gap-6 border-t-[0.5px] border-rtm-accent pt-4">
                {option.price && (
                  <span className="font-rtm-mono-label text-[11px] tracking-[0.1em] uppercase text-rtm-accent">
                    {option.price}
                  </span>
                )}
                {option.link && (option.link.url || option.link.reference) && (
                  <CMSLink
                    {...option.link}
                    appearance="inline"
                    className="font-rtm-mono-label text-[11px] tracking-[0.1em] uppercase text-rtm-fg border-b border-rtm-fg pb-0.5 hover:text-rtm-accent hover:border-rtm-accent"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
