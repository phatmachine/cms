import type { Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/utilities/ui'
import React from 'react'

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
        <div className="col-span-12 border-t border-rtm-hairline pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase md:col-span-3">
          {altsLabel}
        </div>
        {altsIntro && (
          <div className="col-span-12 font-rtm-meshed text-[2.6vw] leading-[1.2] tracking-[0.01em] text-rtm-umber uppercase max-sm:text-[6vw] md:col-span-9 md:col-start-5">
            {altsIntro}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[20vh] pt-10 pb-[120px]">
        {alternatives.map((alt, index) => {
          const reversed = index % 2 === 1
          const tilt = reversed ? 1.2 : -1.2
          const filled = Number(alt.difficulty)
          const image = typeof alt.image === 'object' ? (alt.image as MediaType) : null

          return (
            <div
              className={cn(
                'relative flex min-h-[78vh] items-stretch',
                reversed ? 'flex-row-reverse' : 'flex-row',
              )}
              key={alt.id || index}
            >
              <div
                className={cn(
                  'relative h-[78vh] min-h-[560px] w-[80vw] flex-shrink-0 overflow-hidden bg-rtm-ground-slab',
                  reversed ? '-mr-[4vw]' : '-ml-[4vw]',
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
                    <div className="font-rtm-display text-[9vw] leading-[0.85] font-black tracking-[-0.05em] text-rtm-fg uppercase">
                      {alt.name}
                    </div>
                  </div>
                )}
              </div>

              <Reveal
                className={cn(
                  'absolute bottom-0 z-[2] flex w-[42%] flex-col px-[3vw] py-[5vw]',
                  reversed ? 'left-[-2vw] items-end text-right' : 'right-[-2vw] items-start text-left',
                )}
              >
                {alt.rank && (
                  <div className="mb-5 font-rtm-mono-label text-rtm-caption text-rtm-accent uppercase [text-shadow:0_0_40px_var(--rtm-bg)]">
                    {alt.rank}
                  </div>
                )}
                <h2 className="mb-5 font-rtm-display text-[4vw] font-bold tracking-[-0.02em] text-rtm-fg uppercase [text-shadow:0_0_40px_var(--rtm-bg)] max-sm:text-[8vw]">
                  {alt.name}
                </h2>
                <p className="max-w-[420px] font-rtm-meshed text-[18px] leading-[1.45] tracking-[0.01em] text-rtm-umber uppercase [text-shadow:0_0_40px_var(--rtm-bg)]">
                  {alt.description}
                </p>

                <div className={cn('mt-7 flex flex-col gap-2', reversed && 'items-end')}>
                  <div className="font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase">
                    Difficulty To Switch — {DIFFICULTY_LABEL[alt.difficulty]}
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((seg) => (
                      <span
                        className={cn('h-[5px] w-[34px]', seg < filled ? 'bg-rtm-umber' : 'bg-[#d8d5c4]')}
                        key={seg}
                      />
                    ))}
                  </div>
                </div>

                <a
                  className="mt-9 flex h-[150px] w-[150px] items-center justify-center rounded-full border border-rtm-accent bg-rtm-bg/55 p-3 text-center font-rtm-mono-label text-[10px] tracking-[0.12em] text-rtm-umber uppercase backdrop-blur-[5px] hover:border-rtm-umber hover:bg-rtm-umber hover:text-rtm-bg"
                  href={alt.referralUrl}
                  rel="noopener sponsored"
                  style={{
                    transition: `background 0.4s ${EASE}, color 0.4s ${EASE}, border-color 0.4s ${EASE}`,
                  }}
                  target="_blank"
                >
                  {alt.ctaLabel || 'Make The Switch'}
                </a>
              </Reveal>
            </div>
          )
        })}
      </div>
    </section>
  )
}
