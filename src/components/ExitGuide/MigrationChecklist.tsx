import type { Post } from '@/payload-types'

import React from 'react'

import { Reveal } from '@/components/Reveal'

type MigrationChecklistProps = {
  migrationHeading?: null | string
  migrationLabel?: null | string
  migrationSteps: NonNullable<NonNullable<Post['exitGuide']>['migrationSteps']>
}

export const MigrationChecklist: React.FC<MigrationChecklistProps> = ({
  migrationHeading,
  migrationLabel,
  migrationSteps,
}) => {
  if (!migrationSteps || migrationSteps.length === 0) return null

  return (
    <section className="border-t border-rtm-hairline bg-rtm-ground-footer px-[8vw] py-[140px]">
      <div className="mb-20 grid grid-cols-12 gap-6">
        <Reveal className="col-span-12 border-t border-rtm-hairline pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase md:col-span-3">
          {migrationLabel}
        </Reveal>
        <Reveal
          as="h2"
          className="col-span-12 font-rtm-display text-[4.5vw] leading-[0.95] font-black tracking-[-0.04em] text-rtm-fg uppercase max-sm:text-[9vw] md:col-span-9 md:col-start-5"
          delay={0.1}
        >
          {migrationHeading}
        </Reveal>
      </div>

      <ol className="mx-auto flex max-w-[1100px] flex-col">
        {migrationSteps.map((step, i) => (
          // `group` so hovering anywhere on the row — not just directly over a
          // word — lights up the number and title together. Each row fades/
          // rises in on its own as it's scrolled to, lightly staggered.
          <Reveal
            as="li"
            className="group grid grid-cols-[80px_1fr] items-baseline gap-8 border-t border-rtm-hairline py-8 last:border-b"
            delay={Math.min(i, 4) * 0.08}
            key={step.id || i}
          >
            <span className="font-rtm-mono-label text-[13px] text-rtm-accent transition-colors duration-300 group-hover:text-rtm-magenta">
              [{String(i + 1).padStart(2, '0')}]
            </span>
            <div>
              {/* Magenta, not teal: magenta is ~3.4:1 on this footer ground
                  where the brighter teal is ~1.9:1. That clears the 3:1 bar for
                  the large title; the 18px body text below is just under the
                  "large text" line, so on hover it sits under the 4.5:1 ideal —
                  acceptable for a transient hover state, but don't reuse this
                  colour for resting body text on this ground. */}
              <h4 className="mb-2 font-rtm-display text-2xl font-bold tracking-[-0.01em] text-rtm-fg uppercase transition-colors duration-300 group-hover:text-rtm-magenta">
                {step.title}
              </h4>
              <p className="font-rtm-meshed font-bold text-lg leading-[1.4] tracking-[0.01em] text-rtm-umber uppercase transition-colors duration-300 group-hover:text-rtm-magenta">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
