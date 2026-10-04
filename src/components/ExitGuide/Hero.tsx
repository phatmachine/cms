import type { Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import React from 'react'

import { cn } from '@/utilities/ui'

type ExitGuideHeroProps = {
  hero: NonNullable<NonNullable<Post['exitGuide']>['hero']>
  heroImage: Post['heroImage']
}

/**
 * Full-bleed hero for the "Exit Big Tech" template. Cancels the article's
 * top padding + sticky header height the same way PaperHero does, so the
 * feature image sits flush with the true viewport top and the (untouched)
 * sitewide header floats over it.
 *
 * The feature image is optional. When a post skips it, the hero area is
 * kept (not collapsed) and grounded in rtm-teal-dark instead of the
 * photo's usual rtm-ground-hero tan, so a missing image reads as an
 * intentional flat-color treatment rather than a broken/empty section.
 * (rtm-teal-dark, not the full-brightness rtm-teal, since that accent is
 * reserved for the Subject section and is too hot to ground a whole hero.)
 *
 * The darkening gradient and dark text-shadows only exist to keep the
 * title legible over a photo — with no image they're dropped so the
 * fallback reads as a clean, flat teal card rather than a photo treatment
 * with nothing to composite against.
 */
export const ExitGuideHero: React.FC<ExitGuideHeroProps> = ({ hero, heroImage }) => {
  const { kicker, standfirst, titleLine1, titleLine2 } = hero
  const image = typeof heroImage === 'object' ? (heroImage as MediaType) : null

  return (
    <section
      className={cn(
        'relative mt-[calc((var(--header-height)+4rem)*-1)] flex min-h-screen items-end overflow-hidden px-[4vw] pb-[8vh]',
        image ? 'bg-rtm-ground-hero' : 'bg-rtm-teal-dark',
      )}
    >
      {image && (
        <>
          <div className="absolute inset-0 z-[1]">
            <Media fill imgClassName="object-cover" priority resource={image} />
          </div>
          <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(20,14,10,0.25)_0%,rgba(20,14,10,0)_30%,rgba(20,14,10,0.2)_60%,rgba(20,14,10,0.72)_100%)]" />
        </>
      )}

      <div className="relative z-[3] max-w-[1100px]">
        {kicker && (
          <div
            className={cn(
              // mb scales with viewport width to keep pace with the title's
              // own 15vw sizing below — a fixed margin gets swallowed by
              // the title at wide viewports (it doesn't scale with it).
              'mb-[3vw] font-rtm-mono-label text-[11px] uppercase tracking-[0.22em] text-rtm-bg max-sm:mb-8',
              image && '[text-shadow:0_0_24px_rgba(20,14,10,0.6)]',
            )}
          >
            {kicker}
          </div>
        )}

        <h1
          className={cn(
            'm-0 font-rtm-display text-[15vw] leading-[0.82] font-black tracking-[-0.05em] text-rtm-bg uppercase max-sm:text-[20vw]',
            image && '[text-shadow:0_0_60px_rgba(20,14,10,0.55)]',
          )}
        >
          {titleLine1}
          <br />
          {titleLine2}
        </h1>

        {standfirst && (
          <RichText
            className={cn(
              'mt-[34px] max-w-[720px] font-rtm-meshed font-bold text-[clamp(20px,2.4vw,34px)] leading-[1.3] tracking-[0.01em] text-rtm-bg uppercase [&_p]:m-0 [&_p]:font-bold [&_strong]:font-black',
              image && '[text-shadow:0_0_40px_rgba(20,14,10,0.7)]',
            )}
            data={standfirst}
            enableGutter={false}
            enableProse={false}
          />
        )}
      </div>
    </section>
  )
}
