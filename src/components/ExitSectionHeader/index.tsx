import React from 'react'

type ExitSectionHeaderProps = {
  eyebrow?: null | string
  heading?: null | string
  intro?: null | string
}

/**
 * Section header for the "platform exit" block family (WhySwitch, Options,
 * ComparisonTable, HowToSwitch) — the 12-col label/heading split from the
 * Paper register, matching Narrative's own header. Kept separate from the
 * shared `SectionHeader` so restyling exit pages never touches the blocks
 * other pages use it for.
 */
export const ExitSectionHeader: React.FC<ExitSectionHeaderProps> = ({
  eyebrow,
  heading,
  intro,
}) => {
  if (!eyebrow && !heading && !intro) return null

  return (
    <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
      {eyebrow && (
        <div className="col-span-12 md:col-span-3">
          <span className="block border-t-[0.5px] border-rtm-accent pt-3 font-rtm-mono-label text-[12px] tracking-[0.1em] uppercase text-rtm-accent">
            {eyebrow}
          </span>
        </div>
      )}

      {(heading || intro) && (
        <div className="col-span-12 md:col-span-8 md:col-start-5 flex flex-col gap-3">
          {heading && (
            <h2 className="m-0 font-rtm-display font-bold text-[clamp(28px,3.2vw,48px)] leading-[1.1] tracking-[-0.02em] uppercase text-rtm-fg text-pretty">
              {heading}
            </h2>
          )}
          {intro && (
            <p className="m-0 font-rtm-serif italic text-[clamp(18px,1.8vw,24px)] leading-[1.4] text-rtm-umber max-w-[46ch] text-pretty">
              {intro}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
