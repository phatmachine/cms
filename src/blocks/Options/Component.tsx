import type { OptionsBlock as OptionsBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import React from 'react'

const badgeLabel: Record<string, string> = {
  'editor-pick': "Editor's pick",
  'free': 'Free',
  'open-source': 'Open source',
}

export const OptionsBlock: React.FC<OptionsBlockProps> = ({ eyebrow, heading, intro, options }) => {
  return (
    <div className="py-32">
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

        {options && options.length > 0 && (
          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
            {options.map((option, index) => (
              <Reveal
                className="relative flex flex-col gap-3 border border-hairline rounded-none bg-surface-raised p-8"
                delay={index * 0.08}
                key={index}
              >
                {option.badge && option.badge !== 'none' && (
                  <span className="self-start text-rtm-caption font-rtm-body tracking-caption text-action-on bg-action uppercase px-2 py-0.5">
                    {badgeLabel[option.badge]}
                  </span>
                )}

                {option.logo && (
                  <div className="w-10 h-10 [&_img]:w-full [&_img]:h-full [&_img]:object-contain">
                    <Media htmlElement={null} resource={option.logo} />
                  </div>
                )}

                <h3 className="m-0 text-rtm-heading-2 font-rtm-body font-semibold text-ink">
                  {option.name}
                </h3>
                {option.tagline && (
                  <p className="m-0 text-rtm-body-sm font-rtm-body font-semibold text-ink-secondary">
                    {option.tagline}
                  </p>
                )}
                {option.description && (
                  <p className="m-0 text-rtm-body font-rtm-body text-ink-secondary">
                    {option.description}
                  </p>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-hairline">
                  {option.price && (
                    <span className="text-rtm-label font-rtm-body tracking-label text-ink-muted uppercase">
                      {option.price}
                    </span>
                  )}
                  {option.link && (option.link.url || option.link.reference) && (
                    <CMSLink
                      {...option.link}
                      appearance="inline"
                      className="text-rtm-label font-rtm-body tracking-label text-action uppercase border-b border-action pb-0.5"
                    />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
