'use client'

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import { Media } from '@/components/Media'

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

    let down = false
    let startX = 0
    let startLeft = 0

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      down = true
      startX = e.clientX
      startLeft = track.scrollLeft
      track.setPointerCapture(e.pointerId)
      track.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      track.scrollLeft = startLeft - (e.clientX - startX)
    }
    const onUp = () => {
      down = false
      track.style.cursor = 'grab'
    }

    track.addEventListener('pointerdown', onDown)
    track.addEventListener('pointermove', onMove)
    track.addEventListener('pointerup', onUp)
    track.addEventListener('pointercancel', onUp)
    return () => {
      track.removeEventListener('pointerdown', onDown)
      track.removeEventListener('pointermove', onMove)
      track.removeEventListener('pointerup', onUp)
      track.removeEventListener('pointercancel', onUp)
    }
  }, [])

  if (cards.length === 0) return null

  return (
    <section className="pt-[140px] pb-[120px]" id="more">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 px-[8vw]">
        <div>
          <div className="mb-5 inline-block border-t border-rtm-hairline pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase">
            More Exits [05]
          </div>
          <h2 className="font-rtm-display text-[4.5vw] leading-[0.95] font-black tracking-[-0.04em] text-rtm-fg uppercase max-sm:text-[9vw]">
            {heading}
          </h2>
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
        className="flex cursor-grab gap-6 overflow-x-auto px-[8vw] pb-6 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
      >
        {cards.map((card, i) => (
          <Link
            className="flex-none grayscale transition-[filter] duration-500 [flex-basis:420px] [scroll-snap-align:start] hover:grayscale-0"
            href={card.href}
            key={i}
          >
            <div className="relative h-[520px] overflow-hidden bg-rtm-ground-slab">
              {card.image && <Media fill imgClassName="object-cover" resource={card.image} />}
            </div>
            <div className="pt-5">
              {card.category && (
                <div className="mb-2 font-rtm-mono-label text-[10px] tracking-[0.12em] text-rtm-accent uppercase">
                  {card.category}
                </div>
              )}
              <h4 className="font-rtm-display text-xl font-bold tracking-[-0.01em] text-rtm-fg uppercase">
                Escape {card.appName}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
