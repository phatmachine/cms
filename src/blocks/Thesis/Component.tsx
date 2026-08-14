'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'

import type { ThesisBlock as ThesisBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { ensureScrollTrigger } from '@/utilities/useScrollReveal'

export const ThesisBlock: React.FC<ThesisBlockProps> = ({
  body,
  caption,
  imageA,
  imageB,
  kicker,
  lineOne,
  lineTwo,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const imageARef = useRef<HTMLDivElement>(null)
  const imageBRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const lines = lineRefs.current.filter((el): el is HTMLElement => Boolean(el))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([mediaRef.current, ...lines], { clearProps: 'all' })
      if (imageBRef.current) gsap.set(imageBRef.current, { opacity: 1 })
      return
    }

    ensureScrollTrigger()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      tl.fromTo(
        mediaRef.current,
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', ease: 'none', duration: 0.2 },
        0,
      )
        .to(imageARef.current, { opacity: 0, ease: 'none', duration: 0.34 }, 0.4)
        .to(imageBRef.current, { opacity: 1, ease: 'none', duration: 0.34 }, 0.4)
        .to(veilRef.current, { opacity: 0.72, ease: 'none', duration: 0.2 }, 0)

      lines.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0.06, y: 26 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.14 },
          0.06 + i * 0.2,
        )
      })
    }, wrapper)

    return () => ctx.revert()
  }, [])

  const setLineRef = (i: number) => (el: HTMLElement | null) => {
    lineRefs.current[i] = el
  }

  return (
    <section className="relative -my-16 bg-cosmos-900 h-[220vh]" data-theme="signal" ref={wrapperRef}>
      <div className="sticky top-0 h-screen overflow-hidden grid items-center">
        <div
          className="absolute inset-0 opacity-0 [filter:blur(10px)] will-change-[opacity,filter]"
          ref={mediaRef}
        >
          {imageA && typeof imageA === 'object' && (
            <div className="absolute inset-0" ref={imageARef}>
              <Media fill imgClassName="object-cover" resource={imageA} />
            </div>
          )}
          {imageB && typeof imageB === 'object' && (
            <div className="absolute inset-0 opacity-0" ref={imageBRef}>
              <Media fill imgClassName="object-cover" resource={imageB} />
            </div>
          )}
          <div
            className="absolute inset-0 opacity-[0.42] bg-[linear-gradient(180deg,rgba(14,27,35,0.62)_0%,rgba(14,27,35,0.22)_42%,rgba(14,27,35,0.86)_100%)]"
            ref={veilRef}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,14,20,0.88)_0%,rgba(6,14,20,0.66)_38%,rgba(6,14,20,0.12)_72%,rgba(6,14,20,0)_100%)]" />
        </div>

        <div className="relative w-full max-w-[1240px] mx-auto px-[clamp(24px,5vw,72px)] grid gap-[clamp(20px,2.6vw,34px)]">
          {kicker && (
            <span
              className="text-rtm-label font-rtm-body tracking-label uppercase text-gold-400 opacity-[0.06] translate-y-[26px]"
              ref={setLineRef(0)}
            >
              {kicker}
            </span>
          )}
          {lineOne && (
            <p
              className="m-0 font-rtm-display font-normal text-[clamp(30px,4.4vw,64px)] leading-[1.04] tracking-[-2px] text-star-100 max-w-[22ch] text-pretty opacity-[0.06] translate-y-[26px]"
              ref={setLineRef(1)}
            >
              {lineOne}
            </p>
          )}
          {lineTwo && (
            <p
              className="m-0 font-rtm-display font-normal text-[clamp(30px,4.4vw,64px)] leading-[1.04] tracking-[-2px] text-gold-400 max-w-[26ch] text-pretty opacity-[0.06] translate-y-[26px]"
              ref={setLineRef(2)}
            >
              {lineTwo}
            </p>
          )}
          {body && (
            <p
              className="m-0 text-rtm-body-lg font-rtm-body text-star-100 max-w-[46ch] text-pretty opacity-[0.06] translate-y-[26px]"
              ref={setLineRef(3)}
            >
              {body}
            </p>
          )}
        </div>

        {caption && (
          <span className="absolute left-[clamp(24px,5vw,72px)] bottom-[clamp(24px,4vw,48px)] text-rtm-caption font-rtm-body tracking-caption text-star-200 opacity-60">
            {caption}
          </span>
        )}
      </div>
    </section>
  )
}
