import type { Post } from '@/payload-types'

import React from 'react'

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
        <div className="col-span-12 border-t border-rtm-hairline pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase md:col-span-3">
          {migrationLabel}
        </div>
        <h2 className="col-span-12 font-rtm-display text-[4.5vw] leading-[0.95] font-black tracking-[-0.04em] text-rtm-fg uppercase max-sm:text-[9vw] md:col-span-9 md:col-start-5">
          {migrationHeading}
        </h2>
      </div>

      <ol className="mx-auto flex max-w-[1100px] flex-col">
        {migrationSteps.map((step, i) => (
          <li
            className="grid grid-cols-[80px_1fr] items-baseline gap-8 border-t border-rtm-hairline py-8 last:border-b"
            key={step.id || i}
          >
            <span className="font-rtm-mono-label text-[13px] text-rtm-accent">
              [{String(i + 1).padStart(2, '0')}]
            </span>
            <div>
              <h4 className="mb-2 font-rtm-display text-2xl font-bold tracking-[-0.01em] text-rtm-fg uppercase">
                {step.title}
              </h4>
              <p className="font-rtm-meshed text-lg leading-[1.4] tracking-[0.01em] text-rtm-umber uppercase">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
