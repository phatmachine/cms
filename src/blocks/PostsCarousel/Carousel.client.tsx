'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'

type Card = {
  href: string
  image: MediaType | null
  kicker: string | null
  title: string
}

type CarouselClientProps = {
  cards: Card[]
  eyebrow?: string | null
  heading: string
}

export const CarouselClient: React.FC<CarouselClientProps> = ({ cards, eyebrow, heading }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [index, setIndex] = useState(1)

  const step = () => {
    const track = trackRef.current
    if (!track) return 344
    const card = track.firstElementChild as HTMLElement | null
    return (card?.getBoundingClientRect().width || 320) + 24
  }

  const scrollCards = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const perView = Math.max(1, Math.floor(track.clientWidth / step()))
    track.scrollBy({ left: dir * step() * perView, behavior: 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track || cards.length === 0) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = track.scrollWidth - track.clientWidth
        setProgress(max > 0 ? Math.min(1, track.scrollLeft / max) : 1)
        setIndex(Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1))
      })
    }
    onScroll()
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length])

  // Basic desktop mouse drag-to-scroll (touch/trackpad already scroll natively).
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
      track.style.scrollSnapType = 'none'
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      track.scrollLeft = startLeft - (e.clientX - startX)
    }
    const onUp = () => {
      down = false
      track.style.cursor = 'grab'
      track.style.scrollSnapType = 'x proximity'
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
    <section className="-my-16 bg-[linear-gradient(180deg,var(--gold-700)_0%,var(--star-200)_7%,var(--star-100)_18%)] text-ink py-[clamp(72px,9vw,128px)]">
      <div className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,72px)] grid gap-[clamp(28px,3.5vw,44px)]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 gap-x-8">
          <div className="grid gap-3">
            {eyebrow && (
              <span className="text-rtm-label font-rtm-body tracking-label uppercase text-ink-muted">
                {eyebrow}
              </span>
            )}
            <h2 className="m-0 font-rtm-display font-normal text-[clamp(28px,3.4vw,48px)] leading-[1.04] tracking-[-1.6px] text-ink max-w-[22ch]">
              {heading}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-rtm-caption font-rtm-body tracking-caption text-ink-muted min-w-[56px]">
              {String(index).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
            </span>
            <button
              aria-label="Previous notes"
              className="w-10 h-10 grid place-items-center rounded-[var(--radius-pill)] border border-hairline bg-transparent cursor-pointer hover:border-[var(--gold-400)] [transition:border-color_var(--duration-base)_var(--ease-standard)]"
              onClick={() => scrollCards(-1)}
              type="button"
            >
              ←
            </button>
            <button
              aria-label="More notes"
              className="w-10 h-10 grid place-items-center rounded-[var(--radius-pill)] border border-hairline bg-transparent cursor-pointer hover:border-[var(--gold-400)] [transition:border-color_var(--duration-base)_var(--ease-standard)]"
              onClick={() => scrollCards(1)}
              type="button"
            >
              →
            </button>
          </div>
        </Reveal>
      </div>

      <div
        className="flex gap-[clamp(16px,2vw,28px)] overflow-x-auto [scroll-snap-type:x_proximity] overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2 cursor-grab px-[max(24px,calc((100vw_-_1240px)/2_+_clamp(24px,5vw,72px)))]"
        ref={trackRef}
      >
        {cards.map((card, i) => (
          <Link
            aria-label={card.title}
            className="flex-none [flex-basis:clamp(280px,30vw,344px)] [scroll-snap-align:start] grid bg-surface-raised border border-hairline rounded-[var(--radius-md)] overflow-hidden"
            href={card.href}
            key={i}
          >
            <div className="relative h-[clamp(280px,32vw,400px)] bg-surface-sunken overflow-hidden">
              {card.image && (
                <Media
                  fill
                  imgClassName="object-cover opacity-[0.82]"
                  resource={card.image}
                />
              )}
              {card.kicker && (
                <span className="absolute left-3 top-3 text-rtm-caption tracking-caption uppercase text-star-50 bg-[rgba(6,14,20,0.62)] px-2.5 py-1 rounded-[var(--radius-sm)]">
                  {card.kicker}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,72px)] pt-[clamp(20px,2.5vw,32px)]">
        <div className="relative h-px bg-hairline">
          <span
            className="absolute left-0 -top-px h-[3px] bg-[var(--action-primary)]"
            style={{ width: `${Math.max(8, Math.round(progress * 100))}%` }}
          />
        </div>
      </div>
    </section>
  )
}
