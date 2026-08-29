'use client'

import React, { useEffect, useRef } from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type PaperHeroProps = Page['hero']

/**
 * The "human interface" hero: full-viewport sepia photograph, a hero title
 * blended `difference` against it, and small mono metadata carried in the
 * corners — no CTA, no card, no gradient. See
 * `Rethink The Machine - v2/components/sections/Hero.jsx`.
 */
export const PaperHero: React.FC<PaperHeroProps> = ({ eyebrow, media, paperSettings, richText }) => {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-rtm-ground-hero text-rtm-fg mt-[calc((var(--header-height)+4rem)*-1)] px-[4vw]"
    >
      {media && typeof media === 'object' && (
        <div className="absolute -inset-y-[10%] inset-x-0" ref={imageRef}>
          <Media
            fill
            imgClassName="object-cover [filter:sepia(0.3)_contrast(1.05)_brightness(0.9)] opacity-[0.85]"
            priority
            resource={media}
          />
        </div>
      )}

      <div className="relative z-[2] flex flex-col items-center gap-[clamp(16px,2vw,24px)] text-center max-w-[90vw]">
        {eyebrow && (
          <span className="relative z-[2] mix-blend-difference text-rtm-label font-rtm-mono-label tracking-label uppercase text-rtm-bg">
            {eyebrow}
          </span>
        )}

        {richText && (
          <RichText
            className="[&_h1]:relative [&_h1]:z-[2] [&_h1]:m-0 [&_h1]:font-rtm-display [&_h1]:font-black [&_h1]:uppercase [&_h1]:text-[13vw] max-sm:[&_h1]:text-[18vw] [&_h1]:leading-[0.85] [&_h1]:tracking-[-0.04em] [&_h1]:text-rtm-bg [&_h1]:mix-blend-difference [&_p]:relative [&_p]:z-[2] [&_p]:mix-blend-difference [&_p]:m-0 [&_p]:mt-2 [&_p]:font-rtm-serif [&_p]:italic [&_p]:text-[clamp(17px,1.6vw,22px)] [&_p]:leading-[1.5] [&_p]:text-rtm-bg [&_p]:max-w-[52ch] [&_p]:text-pretty grid justify-items-center gap-[clamp(16px,2vw,24px)]"
            data={richText}
            enableGutter={false}
            enableProse={false}
          />
        )}
      </div>

      {paperSettings?.metaLine && (
        <div className="absolute z-[2] mix-blend-difference right-10 bottom-10 max-sm:right-5 max-sm:bottom-5 max-w-[300px] text-right text-rtm-caption font-rtm-mono-label uppercase text-rtm-bg">
          {paperSettings.metaLine}
        </div>
      )}

      {paperSettings?.sidebarLabel && (
        <div
          aria-hidden="true"
          className="hidden md:block fixed z-20 bottom-6 left-6 text-rtm-caption font-rtm-mono-label tracking-[0.2em] uppercase text-rtm-accent opacity-60 pointer-events-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {paperSettings.sidebarLabel}
        </div>
      )}
    </div>
  )
}
