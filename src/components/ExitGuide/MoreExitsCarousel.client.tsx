'use client'

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/utilities/ui'

import type { ExitCard } from './MoreExits'

type MoreExitsCarouselProps = {
  cards: ExitCard[]
  heading?: null | string
}

/**
 * Drag-to-scroll + Prev/Next carousel for the live "More Exits" query.
 * Interaction model matches the site's existing PostsCarousel block
 * (Carousel.client.tsx) — horizontal snap track, manual pointer drag,
 * step-by-one-card buttons — with a card face specific to this template
 * (visible "Escape {appName}" heading, not just an image + overlay pill).
 *
 * Mouse/pen dragging is hand-rolled via Pointer Events below. Touch is
 * deliberately NOT handled there (see the pointerType guard in onDown) —
 * the track is a plain overflow-x-auto scroller, so touch devices already
 * get native swipe-scrolling with real momentum/inertia for free; adding
 * JS touch handling would fight that, not improve it. The track's own
 * classes (scroll-snap, overscroll-behavior) are what makes that native
 * touch scroll feel right — see their comments below before changing them.
 */
export const MoreExitsCarousel: React.FC<MoreExitsCarouselProps> = ({ cards, heading }) => {
  const trackRef = useRef<HTMLDivElement>(null)

  const step = () => {
    const track = trackRef.current
    if (!track) return 444
    const card = track.firstElementChild as HTMLElement | null
    return (card?.getBoundingClientRect().width || 420) + 24
  }

  const scrollCards = (dir: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ behavior: 'smooth', left: dir * step() })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Distinguishes an actual drag from a plain click on a card. Below
    // this, cursor movement is just click jitter, not a scroll gesture.
    const DRAG_THRESHOLD = 6

    let down = false
    let dragging = false
    let startX = 0
    let startLeft = 0
    let pointerId: null | number = null

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      down = true
      dragging = false
      startX = e.clientX
      startLeft = track.scrollLeft
      pointerId = e.pointerId
      track.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX

      if (!dragging && Math.abs(dx) > DRAG_THRESHOLD) {
        dragging = true
        // Capture only once a real drag starts, not on every pointerdown.
        // Capturing eagerly retargets the eventual click event to `track`
        // per the Pointer Events spec, so the cards' <Link>s never see
        // their own click and silently stop navigating — this is why.
        if (pointerId !== null) track.setPointerCapture(pointerId)
      }
      if (dragging) track.scrollLeft = startLeft - dx
    }
    const onUp = () => {
      down = false
      track.style.cursor = 'grab'
      // Cleared next tick, after the click handler below has had a chance
      // to see `dragging` was true and suppress the click it fires for.
      if (dragging) requestAnimationFrame(() => (dragging = false))
    }
    // A drag-release still fires a native click on whatever's under the
    // cursor. Swallow it so dragging past a card doesn't also navigate.
    const onClickCapture = (e: MouseEvent) => {
      if (dragging) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    // <img> is natively draggable by default (drag-to-save-image). In
    // Chromium/Blink (Chrome, Brave, Edge) that native drag sequence wins
    // the gesture before pointermove above ever sees meaningful movement,
    // so the custom scroll-drag silently never engages — this is why drag
    // can look completely broken in those browsers specifically. Block it
    // outright; the CSS -webkit-user-drag: none on the cards is a second
    // line of defense for the same thing.
    const onNativeDragStart = (e: DragEvent) => e.preventDefault()

    track.addEventListener('pointerdown', onDown)
    track.addEventListener('pointermove', onMove)
    track.addEventListener('pointerup', onUp)
    track.addEventListener('pointercancel', onUp)
    track.addEventListener('click', onClickCapture, true)
    track.addEventListener('dragstart', onNativeDragStart)
    return () => {
      track.removeEventListener('pointerdown', onDown)
      track.removeEventListener('pointermove', onMove)
      track.removeEventListener('pointerup', onUp)
      track.removeEventListener('pointercancel', onUp)
      track.removeEventListener('click', onClickCapture, true)
      track.removeEventListener('dragstart', onNativeDragStart)
    }
  }, [])

  if (cards.length === 0) return null

  return (
    <section className="pt-[140px] pb-[120px]" id="more">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 px-[8vw]">
        <div>
          <Reveal
            as="div"
            className="mb-5 inline-block border-t border-rtm-hairline pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase"
          >
            More Exits [05]
          </Reveal>
          <Reveal
            as="h2"
            className="font-rtm-display text-[4.5vw] leading-[0.95] font-black tracking-[-0.04em] text-rtm-fg uppercase max-sm:text-[9vw]"
            delay={0.1}
          >
            {heading}
          </Reveal>
        </div>
        <div className="flex gap-5 font-rtm-mono-label text-[11px] tracking-[0.12em] uppercase">
          <button
            aria-label="Previous exit guides"
            className="text-rtm-umber/70 hover:text-rtm-umber"
            onClick={() => scrollCards(-1)}
            type="button"
          >
            Prev
          </button>
          <button
            aria-label="More exit guides"
            className="text-rtm-umber/70 hover:text-rtm-umber"
            onClick={() => scrollCards(1)}
            type="button"
          >
            Next
          </button>
        </div>
      </div>

      <div
        className={cn(
          'flex cursor-grab gap-6 overflow-x-auto px-[8vw] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          // proximity (not mandatory) — a mandatory snap fights a slow
          // drag/swipe, making it feel like it's snapping back on you;
          // proximity still catches you near a card but doesn't fight the
          // gesture in between. Matters for both mouse-drag and touch.
          '[scroll-snap-type:x_proximity]',
          // Stops a horizontal swipe from being handed off to the browser
          // once it runs out of scroll room — without this, dragging past
          // either end can trigger Safari/Chrome's edge back/forward-
          // navigation swipe gesture on mobile instead of just stopping.
          '[overscroll-behavior-x:contain]',
          // Legacy iOS momentum-scrolling hint; harmless no-op elsewhere.
          '[-webkit-overflow-scrolling:touch]',
        )}
        ref={trackRef}
      >
        {cards.map((card, i) => (
          <Link
            className="group flex-none grayscale [-webkit-user-drag:none] transition-[filter] duration-500 [flex-basis:420px] [scroll-snap-align:start] hover:grayscale-0"
            draggable={false}
            href={card.href}
            key={i}
          >
            <div
              className={cn(
                'relative h-[520px] overflow-hidden bg-rtm-ground-slab',
                // Shine sweep: a diagonal cream highlight parked off-frame
                // to the left, sliding fully across on hover. pointer-events
                // none + z-[1] so it sits above the image without blocking
                // the click-to-navigate fix from the last pass.
                "after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:-translate-x-[150%] after:skew-x-[-20deg] after:bg-[linear-gradient(115deg,transparent_35%,rgba(253,252,247,0.55)_50%,transparent_65%)] after:transition-transform after:duration-[900ms] after:ease-out after:content-['']",
                'group-hover:after:translate-x-[150%]',
              )}
            >
              {card.image && (
                <Media
                  fill
                  imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  resource={card.image}
                />
              )}
            </div>
            <div className="pt-5">
              {card.category && (
                <div className="mb-2 font-rtm-mono-label text-[10px] tracking-[0.12em] text-rtm-accent uppercase">
                  {card.category}
                </div>
              )}
              <h4 className="font-rtm-display text-xl font-bold tracking-[-0.01em] text-rtm-fg uppercase transition-colors duration-500 group-hover:text-rtm-teal">
                Escape {card.appName}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
