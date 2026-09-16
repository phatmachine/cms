'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Media as MediaType, Post } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

type Reason = NonNullable<NonNullable<NonNullable<Post['exitGuide']>['whyExit']>['reasons']>[number]

type WhyExitScrubProps = {
  label?: null | string
  reasons: Reason[]
  video: MediaType
}

/**
 * "Why Exit [02]" — a 340vh pinned section with a looping background
 * video behind reason panels that cross-fade based on scroll progress.
 * The pin itself is plain CSS `position: sticky`; progress is computed
 * directly from the section's live `getBoundingClientRect()` on
 * scroll/resize.
 *
 * The video plays on a plain `autoPlay loop` — it is NOT scroll-scrubbed.
 * An earlier version drove `currentTime` directly from scroll position,
 * but that seeking fought with the browser's own video buffering
 * (`preload="auto"` downloads sequentially from byte 0; every seek
 * aborted and restarted that download at a new byte range) badly enough
 * to intermittently freeze in real Chrome/Brave, in a way that never
 * reproduced in headless automated testing. A plain looping background
 * video has no scroll-dependent seeking to go wrong.
 *
 * `prefers-reduced-motion` skips the pin entirely and renders every
 * reason as a plain stacked list instead of just the first one.
 */
export const WhyExitScrub: React.FC<WhyExitScrubProps> = ({ label, reasons, video }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const reasonRefs = useRef<Array<HTMLDivElement | null>>([])
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    const onChange = () => setReducedMotion(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return

    const panels = reasonRefs.current.filter((el): el is HTMLDivElement => Boolean(el))

    const tick = (p: number) => {
      if (fillRef.current) fillRef.current.style.width = `${(p * 100).toFixed(1)}%`

      const n = panels.length
      if (n === 0) return
      const active = Math.min(n - 1, Math.floor(p * n * 0.999))
      panels.forEach((el, i) => {
        const on = i === active
        el.style.opacity = on ? '1' : '0'
        el.style.transform = `translateY(${on ? '-50%' : i < active ? '-58%' : '-42%'})`
        el.style.pointerEvents = on ? 'auto' : 'none'
      })
    }

    const computeProgress = () => {
      const rect = section.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      tick(p)
    }

    let rafId: null | number = null
    const onScroll = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        computeProgress()
      })
    }

    computeProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [reducedMotion])

  const src = typeof video === 'object' ? getMediaUrl(video.url, video.updatedAt) : ''

  if (reducedMotion) {
    return (
      <section className="relative bg-rtm-fg py-20">
        {label && (
          <div className="mx-[8vw] mb-10 border-t border-rtm-bg/50 pt-3 font-rtm-mono-label text-[12px] tracking-[0.12em] text-rtm-bg/85 uppercase">
            {label}
          </div>
        )}

        <video
          autoPlay
          className="mx-[8vw] mb-12 aspect-video max-w-[900px] object-cover"
          loop
          muted
          playsInline
          preload="auto"
          src={src}
        />

        <div className="mx-[8vw] flex flex-col gap-12">
          {reasons.map((reason, i) => (
            <div className="max-w-[640px]" key={reason.id || i}>
              <div className="font-rtm-display text-[9vw] leading-[0.9] font-black tracking-[-0.04em] text-rtm-bg opacity-90 sm:text-[56px]">
                {reason.number}
              </div>
              <h3 className="mt-[18px] mb-5 font-rtm-display text-[3vw] font-bold tracking-[-0.02em] text-rtm-bg uppercase max-sm:text-[7vw] sm:text-[32px]">
                {reason.title}
              </h3>
              <p className="font-rtm-meshed text-[22px] leading-[1.4] tracking-[0.01em] text-rtm-ground-slab uppercase">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[340vh] bg-rtm-fg" ref={sectionRef}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <video
          autoPlay
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          src={src}
        />
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(30,22,16,0.72)_0%,rgba(30,22,16,0.35)_45%,rgba(30,22,16,0)_75%)]" />

        {label && (
          <div className="absolute top-8 left-[8vw] z-[3] border-t border-rtm-bg/50 pt-3 font-rtm-mono-label text-[12px] tracking-[0.12em] text-rtm-bg/85 uppercase">
            {label}
          </div>
        )}

        <div className="relative z-[3] w-full max-w-[1500px] px-[8vw]">
          {reasons.map((reason, i) => (
            <div
              className="absolute top-1/2 right-[8vw] left-[8vw] max-w-[640px] opacity-0 [transition:opacity_0.5s_ease,transform_0.5s_cubic-bezier(0.16,1,0.3,1)]"
              key={reason.id || i}
              ref={(el) => {
                reasonRefs.current[i] = el
              }}
              style={{ opacity: i === 0 ? 1 : 0, transform: 'translateY(-42%)' }}
            >
              <div className="font-rtm-display text-[9vw] leading-[0.9] font-black tracking-[-0.04em] text-rtm-bg opacity-90">
                {reason.number}
              </div>
              <h3 className="mt-[18px] mb-5 font-rtm-display text-[3vw] font-bold tracking-[-0.02em] text-rtm-bg uppercase max-sm:text-[7vw]">
                {reason.title}
              </h3>
              <p className="font-rtm-meshed text-[22px] leading-[1.4] tracking-[0.01em] text-rtm-ground-slab uppercase">
                {reason.body}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute right-[8vw] bottom-9 left-[8vw] z-[3] h-px bg-rtm-bg/25">
          <div className="h-full w-0 bg-rtm-bg" ref={fillRef} />
        </div>
      </div>
    </section>
  )
}
