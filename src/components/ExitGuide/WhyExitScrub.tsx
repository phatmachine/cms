'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef, useState } from 'react'

import type { Media as MediaType, Post } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { ensureScrollTrigger } from '@/utilities/useScrollReveal'

type Reason = NonNullable<NonNullable<NonNullable<Post['exitGuide']>['whyExit']>['reasons']>[number]

type WhyExitScrubProps = {
  label?: null | string
  reasons: Reason[]
  video: MediaType
}

/**
 * "Why Exit [02]" — a 340vh pinned section whose video's currentTime is
 * driven directly by scroll progress (no .play(), no audio needed), while
 * reason panels cross-fade based on the same progress. Adapts the pinned
 * ScrollTrigger scaffold already used by the Thesis block, swapping its
 * image crossfade for a video scrub.
 *
 * `prefers-reduced-motion` skips the pin/scrub entirely and renders every
 * reason as a plain stacked list instead of just the first one — the
 * previous fallback ("show reason one against a paused frame") never wired
 * up ScrollTrigger at all, so reasons two onward were permanently
 * unreachable for anyone with that OS/browser setting on, not just
 * unanimated.
 */
export const WhyExitScrub: React.FC<WhyExitScrubProps> = ({ label, reasons, video }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
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
    const videoEl = videoRef.current
    if (!section || !videoEl) return

    const panels = reasonRefs.current.filter((el): el is HTMLDivElement => Boolean(el))

    try {
      videoEl.pause()
    } catch {
      // no-op: some browsers reject pause() before metadata loads
    }

    ensureScrollTrigger()

    const tick = (p: number) => {
      if (videoEl.readyState >= 1 && videoEl.duration) {
        const t = p * (videoEl.duration - 0.05)
        if (Math.abs((videoEl.currentTime || 0) - t) > 0.02) {
          try {
            videoEl.currentTime = t
          } catch {
            // no-op: seeking can throw if the video isn't seekable yet
          }
        }
      }

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

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        end: 'bottom bottom',
        onUpdate: (self) => tick(self.progress),
        start: 'top top',
        trigger: section,
      })
    }, section)

    tick(0)

    return () => ctx.revert()
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
          className="mx-[8vw] mb-12 aspect-video max-w-[900px] object-cover"
          muted
          playsInline
          preload="metadata"
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
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          ref={videoRef}
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
