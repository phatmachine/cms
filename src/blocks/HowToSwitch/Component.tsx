'use client'

import type { HowToSwitchBlock as HowToSwitchBlockProps } from '@/payload-types'

import { ExitSectionHeader } from '@/components/ExitSectionHeader'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { useStepScrollSync } from '@/utilities/useScrollReveal'
import React from 'react'

export const HowToSwitchBlock: React.FC<HowToSwitchBlockProps> = ({
  eyebrow,
  heading,
  intro,
  steps,
}) => {
  const count = steps?.length || 0
  const { activeIndex, setStepRef } = useStepScrollSync(count)
  const activeStep = steps?.[activeIndex]

  return (
    <section className="bg-rtm-bg px-[8vw] py-[clamp(80px,12vh,140px)]">
      <ExitSectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

      {steps && steps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-[clamp(40px,6vw,96px)] items-start">
          <ol className="m-0 p-0 flex flex-col list-none">
            {steps.map((step, index) => (
              <li
                className={cn(
                  'flex gap-6 py-7 border-t border-rtm-hairline last:border-b transition-opacity duration-200 ease-in-out',
                  index === activeIndex ? 'opacity-100' : 'opacity-50',
                  'max-md:opacity-100',
                )}
                key={index}
                ref={setStepRef(index)}
              >
                <span
                  className={cn(
                    'min-w-[56px] font-rtm-mono-label text-[11px] tracking-[0.15em]',
                    index === activeIndex ? 'text-rtm-fg' : 'text-rtm-accent',
                  )}
                >
                  [ {String(index + 1).padStart(2, '0')} ]
                </span>
                <div className="flex flex-col gap-2.5">
                  <h3 className="m-0 font-rtm-display font-bold text-[20px] leading-[1.2] tracking-[-0.02em] uppercase text-rtm-fg">
                    {step.title}
                  </h3>
                  <p className="m-0 font-rtm-serif text-[18px] leading-[1.4] text-rtm-umber max-w-[46ch]">
                    {step.description}
                  </p>
                  {step.media && (
                    <div className="hidden max-md:flex mt-3 bg-rtm-ground-slab aspect-[4/3] overflow-hidden items-center justify-center [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:[filter:sepia(0.2)] [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
                      <Media resource={step.media} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="relative max-md:hidden">
            <div className="sticky top-[calc(var(--header-height)+32px)]">
              <div className="bg-rtm-ground-slab aspect-[4/3] overflow-hidden flex items-center justify-center [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:[filter:sepia(0.2)] [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
                {activeStep?.media ? <Media key={activeIndex} resource={activeStep.media} /> : null}
              </div>
              <p className="mt-4 m-0 font-rtm-mono-label text-[10px] tracking-[0.15em] uppercase text-rtm-accent">
                Fig. 01 — {activeStep?.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
