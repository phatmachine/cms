'use client'

import type { HowToSwitchBlock as HowToSwitchBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
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
    <div className="py-32">
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

        {steps && steps.length > 0 && (
          <div className="grid grid-cols-2 gap-24 items-start max-[900px]:grid-cols-1">
            <ol className="m-0 p-0 flex flex-col list-none">
              {steps.map((step, index) => (
                <li
                  className={cn(
                    'flex gap-4 py-8 border-t border-hairline transition-opacity duration-200 ease-in-out last:border-b',
                    index === activeIndex ? 'opacity-100' : 'opacity-50',
                    'max-[900px]:opacity-100',
                  )}
                  key={index}
                  ref={setStepRef(index)}
                >
                  <span
                    className={cn(
                      'min-w-[40px] text-rtm-heading-3 font-rtm-body text-ink-muted',
                      index === activeIndex && 'text-action',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 text-rtm-heading-2 font-rtm-body font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="m-0 text-rtm-body font-rtm-body text-ink-secondary">
                      {step.description}
                    </p>
                    {step.media && (
                      <div className="hidden max-[900px]:block mt-3 border border-hairline">
                        <Media resource={step.media} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="relative max-[900px]:hidden">
              <div className="sticky top-[calc(var(--header-height)+var(--space-6))] border border-hairline bg-surface-raised aspect-[4/3] overflow-hidden flex items-center justify-center [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
                {activeStep?.media ? (
                  <Media key={activeIndex} resource={activeStep.media} />
                ) : (
                  <div className="text-rtm-body font-rtm-body text-ink-muted p-8 text-center">
                    {activeStep?.title}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
