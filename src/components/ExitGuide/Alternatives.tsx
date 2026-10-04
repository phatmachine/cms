import type { Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { hasJurisdictionFlag } from '@/utilities/jurisdictionFlags'
import { cn } from '@/utilities/ui'
import React from 'react'

import { JurisdictionFlags } from './JurisdictionValue'

type Alternative = NonNullable<NonNullable<Post['exitGuide']>['alternatives']>[number]

type AlternativesProps = {
  altsIntro?: null | string
  altsLabel?: null | string
  alternatives: Alternative[]
}

const DIFFICULTY_LABEL: Record<string, string> = {
  '2': 'Easy',
  '3': 'Moderate',
  '4': 'Involved',
  '5': 'Hard',
}

// The design's one distinctive "slow silk" curve — scoped here rather than
// added as a second global easing token, since --ease-standard elsewhere
// on the site is deliberately snappier.
const EASE = 'cubic-bezier(0.16,1,0.3,1)'

export const Alternatives: React.FC<AlternativesProps> = ({ altsIntro, altsLabel, alternatives }) => {
  if (!alternatives || alternatives.length === 0) return null

  return (
    <section id="alternatives">
      <div className="grid grid-cols-12 gap-6 px-[8vw] pt-40 pb-10">
        <Reveal className="col-span-12 border-t border-rtm-hairline pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase md:col-span-3">
          {altsLabel}
        </Reveal>
        {altsIntro && (
          <Reveal
            className="col-span-12 font-rtm-meshed font-black text-[2.6vw] leading-[1.2] tracking-[0.01em] text-rtm-umber uppercase max-sm:text-[6vw] md:col-span-9 md:col-start-5"
            delay={0.1}
          >
            {altsIntro}
          </Reveal>
        )}
      </div>

      <div className="flex flex-col gap-[20vh] pt-10 pb-[120px]">
        {alternatives.map((alt, index) => {
          const reversed = index % 2 === 1
          const tilt = reversed ? 1.2 : -1.2
          const filled = Number(alt.difficulty)
          const image = typeof alt.image === 'object' ? (alt.image as MediaType) : null
          const hasFlag = hasJurisdictionFlag(alt.country)

          return (
            <div
              className={cn(
                // Phones: the banner, then the text panel tucked up over its
                // bottom edge. From md: side by side, the panel overlapping
                // one edge of the banner, bottom-aligned.
                'relative flex flex-col md:min-h-[78vh] md:items-end',
                reversed ? 'md:flex-row-reverse' : 'md:flex-row',
              )}
              key={alt.id || index}
            >
              <div
                className={cn(
                  'relative h-[45vh] min-h-[280px] w-full flex-shrink-0 overflow-hidden bg-rtm-ground-slab md:h-[78vh] md:min-h-[560px] md:w-[80vw]',
                  reversed ? 'md:-mr-[4vw]' : 'md:-ml-[4vw]',
                )}
                style={{ transform: `rotate(${tilt}deg)` }}
              >
                {image ? (
                  <div
                    className="absolute inset-0 [filter:sepia(0.35)_saturate(0.9)] hover:scale-[1.03] hover:[filter:none]"
                    style={{ transition: `filter 0.6s ${EASE}, transform 1.2s ${EASE}` }}
                  >
                    <Media fill imgClassName="object-cover" resource={image} />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-[6vw] text-center">
                    {alt.tagline && (
                      <div className="mb-6 font-rtm-mono-label text-[11px] tracking-[0.25em] text-rtm-accent uppercase">
                        {alt.tagline}
                      </div>
                    )}
                    <div className="w-full max-w-full text-pretty break-words font-rtm-display text-[9vw] leading-[0.85] font-black tracking-[-0.05em] text-rtm-fg uppercase">
                      {alt.name}
                    </div>
                  </div>
                )}
              </div>

              <Reveal
                className={cn(
                  // A SOLID paper panel, not a transparent overlay. The old one
                  // sat over the banner with only a cream text-shadow glow to
                  // keep it readable — that only worked on light images, and a
                  // dark banner swallowed the dark text. On its own surface the
                  // text is legible whatever the banner looks like, and the
                  // overlap across the banner's edge (the design's whole
                  // point) is kept. shrink-0 so it isn't squeezed narrower.
                  'relative z-[2] flex shrink-0 flex-col items-start bg-rtm-bg px-[6vw] py-[8vw] text-left shadow-[0_30px_70px_-30px_rgba(20,14,10,0.4)] max-md:-mt-[10vw] max-md:mx-[4vw] md:w-[42%] md:px-[3vw] md:py-[4vw]',
                  reversed
                    ? 'md:-mr-[16vw] md:items-end md:text-right'
                    : 'md:-ml-[16vw] md:items-start md:text-left',
                )}
              >
                {alt.rank && (
                  <div className="mb-5 font-rtm-mono-label text-rtm-caption text-rtm-accent uppercase">
                    {alt.rank}
                  </div>
                )}
                <h2 className="mb-5 font-rtm-display text-[4vw] leading-[1.2] font-bold tracking-[-0.02em] text-rtm-fg uppercase max-sm:text-[8vw]">
                  {alt.name}
                </h2>
                {/* Flag(s) of the country the service is legally based in, at
                    least 80px wide, growing with the viewport to keep pace with
                    the vw-sized heading. Absent for a federated/self-hosted
                    service with no home country. */}
                {hasFlag && (
                  <div className={cn('mb-5 flex flex-wrap items-center gap-4', reversed && 'md:justify-end')}>
                    <JurisdictionFlags
                      className="aspect-[3/2] h-auto w-[max(80px,5.5vw)] shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgba(61,61,51,0.2),0_6px_18px_rgba(20,14,10,0.2)]"
                      value={alt.country as string}
                    />
                  </div>
                )}
                <p className="max-w-[420px] font-rtm-meshed font-bold text-[18px] leading-[1.45] tracking-[0.01em] text-rtm-umber uppercase">
                  {alt.description}
                </p>

                <div className={cn('mt-7 flex flex-col gap-2', reversed && 'md:items-end')}>
                  <div className="font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase">
                    Difficulty To Switch — {DIFFICULTY_LABEL[alt.difficulty]}
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((seg) => (
                      <span
                        className={cn('h-[5px] w-[34px]', seg < filled ? 'bg-rtm-teal' : 'bg-[#d8d5c4]')}
                        key={seg}
                      />
                    ))}
                  </div>
                </div>

                {/* Two side-by-side rectangular buttons — filled primary
                    (referral) + outlined secondary (Learn More) — replacing
                    the old single circular CTA. Shape/pairing modelled on
                    menlo.ai's own buy/learn-more pair, rendered in this
                    site's own tokens rather than their orange. Learn More
                    has no rel="sponsored": it's not the paid/referral link. */}
                <div className="mt-9 flex flex-wrap gap-4">
                  <a
                    className="inline-flex h-[52px] items-center justify-center rounded-lg border border-rtm-teal-dark bg-rtm-teal-dark px-8 text-center font-rtm-mono-label text-[13px] font-bold tracking-[0.12em] text-rtm-bg uppercase transition-[background-color,border-color] duration-300 hover:border-rtm-magenta hover:bg-rtm-magenta"
                    href={alt.referralUrl}
                    rel="noopener sponsored"
                    target="_blank"
                  >
                    {alt.ctaLabel || 'Make The Switch'}
                  </a>
                  {alt.learnMoreUrl && (
                    <a
                      className="inline-flex h-[52px] items-center justify-center rounded-lg border border-rtm-accent bg-transparent px-8 text-center font-rtm-mono-label text-[13px] font-bold tracking-[0.12em] text-rtm-umber uppercase transition-colors duration-300 hover:border-rtm-fg hover:text-rtm-fg"
                      href={alt.learnMoreUrl}
                      rel="noopener"
                      target="_blank"
                    >
                      {alt.learnMoreLabel || 'Learn More'}
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          )
        })}
      </div>
    </section>
  )
}
