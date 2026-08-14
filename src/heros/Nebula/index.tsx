'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { EmailCapture } from '@/components/EmailCapture'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type NebulaHeroProps = Page['hero']

export const NebulaHero: React.FC<NebulaHeroProps> = ({ eyebrow, media, nebulaSettings, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  const stats = nebulaSettings?.stats || []

  return (
    <div
      className="relative min-h-screen overflow-hidden grid items-end bg-cosmos-void text-star-100 mt-[calc(var(--header-height)*-1)]"
      data-theme="signal"
    >
      {media && typeof media === 'object' && (
        <div className="absolute -inset-y-[12%] inset-x-0">
          <Media
            fill
            imgClassName="object-cover opacity-[0.42] [animation:rtm-drift_64s_var(--ease-standard)_infinite]"
            priority
            resource={media}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,14,20,0.86)_0%,rgba(6,14,20,0.34)_38%,rgba(14,27,35,0.72)_76%,#0E1B23_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_78%_18%,rgba(242,212,140,0.16)_0%,rgba(242,212,140,0)_60%)] [animation:rtm-breathe_18s_var(--ease-standard)_infinite]" />

      <div className="relative max-w-[1240px] w-full mx-auto px-[clamp(24px,5vw,72px)] pt-[calc(var(--header-height)+40px)] pb-[clamp(40px,6vw,72px)] grid gap-[clamp(28px,3.5vw,44px)]">
        {eyebrow && (
          <span className="text-rtm-label font-rtm-body tracking-label uppercase text-gold-400">
            {eyebrow}
          </span>
        )}

        {richText && (
          <RichText
            className="[&_h1]:m-0 [&_h1]:font-rtm-display [&_h1]:font-normal [&_h1]:text-[clamp(46px,8.4vw,104px)] [&_h1]:leading-[0.97] [&_h1]:tracking-[-3px] [&_h1]:text-star-100 [&_h1]:max-w-[15ch] [&_h1]:text-balance [&_p]:m-0 [&_p]:text-[clamp(17px,1.5vw,21px)] [&_p]:leading-[1.6] [&_p]:text-ink-secondary [&_p]:max-w-[56ch] [&_p]:text-pretty grid gap-[clamp(16px,2vw,24px)]"
            data={richText}
            enableGutter={false}
            enableProse={false}
          />
        )}

        <EmailCapture buttonLabel={nebulaSettings?.formButtonLabel || 'Notes by email'} className="mt-2" />

        {stats.length > 0 && (
          <div className="flex flex-wrap border-t border-hairline pt-[clamp(20px,2.5vw,28px)] mt-[clamp(8px,2vw,20px)]">
            {stats.map((stat, i) => (
              <div
                className="grid gap-1.5 px-[clamp(24px,4vw,56px)] first:pl-0 border-l border-hairline first:border-l-0"
                key={i}
              >
                <span className="font-rtm-display font-normal text-[clamp(24px,2.4vw,32px)] leading-none tracking-[-1px] text-gold-300">
                  {stat.figure}
                </span>
                <span className="text-rtm-caption font-rtm-body tracking-caption text-ink-muted">
                  {stat.caption}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
