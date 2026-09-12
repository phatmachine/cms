import type { Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import React from 'react'

type ExitGuideHeroProps = {
  hero: NonNullable<NonNullable<Post['exitGuide']>['hero']>
  heroImage: Post['heroImage']
}

/**
 * Full-bleed hero for the "Exit Big Tech" template. Cancels the article's
 * top padding + sticky header height the same way PaperHero does, so the
 * feature image sits flush with the true viewport top and the (untouched)
 * sitewide header floats over it.
 */
export const ExitGuideHero: React.FC<ExitGuideHeroProps> = ({ hero, heroImage }) => {
  const { kicker, standfirst, titleLine1, titleLine2 } = hero
  const image = typeof heroImage === 'object' ? (heroImage as MediaType) : null

  return (
    <section className="relative mt-[calc((var(--header-height)+4rem)*-1)] flex min-h-screen items-end overflow-hidden bg-rtm-ground-hero px-[4vw] pb-[8vh]">
      {image && (
        <div className="absolute inset-0 z-[1]">
          <Media fill imgClassName="object-cover" priority resource={image} />
        </div>
      )}
      <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(20,14,10,0.25)_0%,rgba(20,14,10,0)_30%,rgba(20,14,10,0.2)_60%,rgba(20,14,10,0.72)_100%)]" />

      <div className="relative z-[3] max-w-[1100px]">
        {kicker && (
          <div className="mb-7 font-rtm-mono-label text-[11px] uppercase tracking-[0.22em] text-rtm-bg [text-shadow:0_0_24px_rgba(20,14,10,0.6)]">
            {kicker}
          </div>
        )}

        <h1 className="m-0 font-rtm-display text-[15vw] leading-[0.82] font-black tracking-[-0.05em] text-rtm-bg uppercase [text-shadow:0_0_60px_rgba(20,14,10,0.55)] max-sm:text-[20vw]">
          {titleLine1}
          <br />
          {titleLine2}
        </h1>

        {standfirst && (
          <RichText
            className="mt-[34px] max-w-[720px] font-rtm-meshed text-[clamp(20px,2.4vw,34px)] leading-[1.3] tracking-[0.01em] text-rtm-bg uppercase [text-shadow:0_0_40px_rgba(20,14,10,0.7)] [&_p]:m-0 [&_p]:font-normal [&_strong]:font-bold"
            data={standfirst}
            enableGutter={false}
            enableProse={false}
          />
        )}
      </div>
    </section>
  )
}
