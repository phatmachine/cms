'use client'

import type React from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

let scrollTriggerRegistered = false
let refreshOnSettleAttached = false

export function ensureScrollTrigger() {
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    scrollTriggerRegistered = true
  }

  // On a long page (the exit-guide template easily runs several thousand
  // px), a Reveal instance far down the page measures its trigger position
  // as soon as it mounts — before everything above it has necessarily
  // finished loading and settled into its final size. If that measurement
  // is short (e.g. an image above it hasn't taken its final layout height
  // yet), the trigger can read as "already scrolled past" and fire
  // immediately instead of on scroll. Re-measuring once via refresh() after
  // the window and fonts have both settled corrects every trigger's
  // position in one pass, once per page load — this is GSAP's own
  // documented fix for this class of bug, not a per-instance workaround.
  if (!refreshOnSettleAttached) {
    refreshOnSettleAttached = true
    const refresh = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') refresh()
    else window.addEventListener('load', refresh, { once: true })
    document.fonts?.ready?.then(refresh).catch(() => {})
  }
}

type ScrollRevealOptions = {
  delay?: number
  duration?: number
  start?: string
  y?: number
}

/**
 * Fade + rise reveal, once, on scroll into view. Restrained easing (no bounce),
 * matching the brand's "stillness" rule. Skips the animation for
 * prefers-reduced-motion and just leaves the element in its final state.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T | null>(null)
  const { delay = 0, duration = 0.6, start = 'top 85%', y = 24 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { clearProps: 'all' })
      return
    }

    ensureScrollTrigger()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          delay,
          duration,
          ease: 'power2.out',
          opacity: 1,
          scrollTrigger: {
            once: true,
            start,
            trigger: el,
          },
          y: 0,
        },
      )
    })

    return () => ctx.revert()
  }, [delay, duration, start, y])

  return ref
}

/**
 * Tracks which step in a vertical list is currently most in view, for the
 * HowToSwitch block's sticky media panel. Intentionally IntersectionObserver-based
 * rather than a GSAP pin/scrub timeline — lighter weight and more resilient across
 * variable-height CMS content than a pinned scrub.
 */
export function useStepScrollSync(count: number) {
  const [activeIndex, setActiveIndex] = useState(0)
  const stepRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = stepRefs.current.findIndex((el) => el === entry.target)
          if (index !== -1) setActiveIndex(index)
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )

    stepRefs.current.slice(0, count).forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [count])

  const setStepRef = (index: number): React.RefCallback<HTMLElement> => {
    return (el) => {
      stepRefs.current[index] = el
    }
  }

  return { activeIndex, setStepRef }
}
