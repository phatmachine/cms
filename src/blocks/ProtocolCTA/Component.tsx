import React from 'react'

import type { ProtocolCTABlock as ProtocolCTABlockProps } from '@/payload-types'

import { EmailCapture } from '@/components/EmailCapture'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'

export const ProtocolCTABlock: React.FC<ProtocolCTABlockProps> = ({
  body,
  formButtonLabel,
  heading,
  image,
  kicker,
  successMessage,
}) => {
  return (
    <section
      className="relative -mt-16 -mb-[10rem] bg-ember-800 text-ink py-[clamp(80px,10vw,148px)] overflow-hidden"
      data-theme="ember"
    >
      {image && typeof image === 'object' && (
        <Media
          fill
          imgClassName="object-cover opacity-20"
          resource={image}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(95,38,11,0.72)_0%,rgba(95,38,11,0.92)_100%)]" />

      <div className="relative max-w-[1240px] mx-auto px-[clamp(24px,5vw,72px)] grid items-end gap-[clamp(32px,5vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <Reveal className="grid gap-5">
          {kicker && (
            <span className="text-rtm-label font-rtm-body tracking-label uppercase text-gold-400">
              {kicker}
            </span>
          )}
          <h2 className="m-0 font-rtm-display font-normal text-[clamp(30px,3.8vw,54px)] leading-[1.04] tracking-[-1.6px] text-star-100 max-w-[20ch]">
            {heading}
          </h2>
          {body && (
            <p className="m-0 text-rtm-body-lg font-rtm-body text-ink-secondary max-w-[44ch] text-pretty">
              {body}
            </p>
          )}
        </Reveal>
        <Reveal className="grid gap-4 justify-items-start" delay={0.14}>
          <EmailCapture
            buttonLabel={formButtonLabel || 'Send the protocol'}
            successMessage={successMessage || 'On its way.'}
          />
        </Reveal>
      </div>
    </section>
  )
}
