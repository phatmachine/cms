'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef, useState } from 'react'

import type { Page, Slide } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type SignalCarouselHeroProps = Page['hero']

const patternStyle: Record<'points' | 'grid' | 'lines', React.CSSProperties> = {
  points: {
    backgroundImage: 'radial-gradient(rgba(242, 244, 243, 0.13) 1px, transparent 1.5px)',
    backgroundSize: '26px 26px',
  },
  grid: {
    backgroundImage:
      'linear-gradient(rgba(242, 244, 243, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 244, 243, 0.07) 1px, transparent 1px)',
    backgroundSize: '80px 80px',
  },
  lines: {
    backgroundImage: 'linear-gradient(90deg, rgba(242, 244, 243, 0.08) 1px, transparent 1px)',
    backgroundSize: '12.5% 100%',
  },
}

const mediaFillClass =
  'absolute inset-0 [&_picture]:block [&_picture]:w-full [&_picture]:h-full [&_video]:block [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_img]:block [&_img]:w-full [&_img]:h-full [&_img]:object-cover'

const hasResolvableLink = (link: Slide['link']): boolean => {
  if (!link) return false
  if (link.type === 'custom') return Boolean(link.url)
  return Boolean(link.reference?.value)
}

export const SignalCarouselHero: React.FC<SignalCarouselHeroProps> = ({ carousel }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  const slides = (carousel?.slides || []).filter(
    (slide): slide is Slide => typeof slide === 'object' && slide !== null,
  )
  const autoAdvanceSeconds = carousel?.autoAdvanceSeconds ?? 7
  const showThumbnails = carousel?.showThumbnails ?? true
  const overlayStrength = carousel?.overlayStrength ?? 0.5
  const backdropPattern = carousel?.backdropPattern ?? 'points'

  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (slides.length < 2) return

    const timer = setInterval(() => {
      if (paused) return
      const step = 100 / (autoAdvanceSeconds * 10)
      setProgress((p) => {
        const next = p + step
        if (next >= 100) {
          setActive((a) => (a + 1) % slides.length)
          return 0
        }
        return next
      })
    }, 100)

    return () => clearInterval(timer)
  }, [paused, autoAdvanceSeconds, slides.length])

  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const child = el.children[active] as HTMLElement | undefined
    if (child) {
      el.scrollLeft = Math.max(0, child.offsetLeft - el.clientWidth / 2 + 170)
    }
  }, [active])

  const select = (i: number) => {
    setActive(i)
    setProgress(0)
  }

  if (slides.length === 0) {
    return (
      <div
        className="relative min-h-screen overflow-hidden flex flex-col bg-signal-bg text-cold-white mt-[calc(var(--header-height)*-1)]"
        data-theme="signal"
      >
        <div className="relative z-20 flex-1 flex items-center justify-center px-12 py-16 text-center">
          <p className="text-rtm-body font-rtm-body text-signal-fog max-w-[420px]">
            No slides yet. Add slides in the admin panel (Collections → Carousel Slides), then
            select and order them on this page&apos;s Hero tab.
          </p>
        </div>
      </div>
    )
  }

  const overlayMid = 0.15 + 0.5 * overlayStrength
  const pattern = backdropPattern === 'none' ? null : patternStyle[backdropPattern] || patternStyle.points
  const current = slides[active]!

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col bg-signal-bg text-cold-white mt-[calc(var(--header-height)*-1)]"
      data-theme="signal"
    >
      {slides.map((slide, i) => (
        <div
          className="absolute inset-0 [transition:opacity_900ms_ease]"
          key={slide.id}
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? 'auto' : 'none' }}
        >
          <div className={mediaFillClass}>
            {slide.background ? (
              <Media fill htmlElement={null} priority={i === active} resource={slide.background} />
            ) : (
              <div className="absolute inset-0 bg-signal-panel flex items-center justify-center text-center p-12">
                <span className="text-rtm-label font-rtm-body tracking-label text-signal-line uppercase">
                  Background — {slide.title} ({slide.category})
                </span>
              </div>
            )}
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, rgba(10,11,11,0.55) 0%, rgba(22,36,38,${overlayMid}) 45%, rgba(10,11,11,0.85) 100%)`,
            }}
          />
        </div>
      ))}

      {pattern && <div className="absolute inset-0 z-10 pointer-events-none" style={pattern} />}

      <div className="relative z-20 flex-1 flex flex-col justify-end pt-[var(--header-height)]">
        <div
          className="pt-14 px-12 pb-16 max-sm:pt-8 max-sm:px-5 max-sm:pb-10 flex flex-col gap-[18px] pointer-events-none [animation:fadeIn_500ms_ease]"
          key={current.id}
        >
          <div className="flex items-center gap-4">
            <span className="text-rtm-label font-rtm-body tracking-label text-dune-amber uppercase">
              {current.category}
            </span>
            <span className="w-8 h-px bg-hairline-strong" />
            <span className="text-rtm-label font-rtm-body tracking-label text-signal-fog uppercase">
              {current.brand}
            </span>
          </div>
          <h1 className="m-0 text-rtm-display-3 tracking-display-3 min-[481px]:text-rtm-display-2 min-[481px]:tracking-display-2 min-[901px]:text-rtm-display-1 min-[901px]:tracking-display-1 font-rtm-display font-normal text-cold-white max-w-[900px] text-pretty">
            {current.title}
          </h1>
          <p className="m-0 text-rtm-body-lg font-rtm-body text-signal-fog max-w-[520px] text-pretty">
            {current.line}
          </p>
          <div className="pointer-events-auto flex items-center gap-6 mt-1 flex-wrap">
            {hasResolvableLink(current.link) ? (
              <CMSLink
                {...current.link}
                appearance="inline"
                className="text-rtm-label font-rtm-body tracking-label text-cold-white uppercase border-b border-hairline-strong pb-1.5"
              >
                Read the study
              </CMSLink>
            ) : (
              <span
                aria-disabled="true"
                className="text-rtm-label font-rtm-body tracking-label text-signal-fog uppercase border-b border-hairline pb-1.5 opacity-60"
              >
                Read the study
              </span>
            )}
            <span className="text-rtm-caption font-rtm-body tracking-caption text-ink-muted">
              {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {showThumbnails && (
          <div
            className="relative z-[25] px-12 pb-7 max-sm:px-5 max-sm:pb-5"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative h-px bg-hairline mb-4">
              <div
                className="absolute left-0 top-0 h-px bg-dune-amber"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="flex gap-3 overflow-x-auto overflow-y-hidden pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              ref={stripRef}
            >
              {slides.map((slide, i) => (
                <button
                  className="flex-none w-[340px] max-sm:w-[220px] cursor-pointer bg-transparent border-0 p-0 text-left [transition:opacity_160ms_ease]"
                  key={slide.id}
                  onClick={() => select(i)}
                  style={{ opacity: i === active ? 1 : 0.55 }}
                  type="button"
                >
                  <div
                    className={cn(
                      'relative w-[340px] h-[573px] max-sm:w-[220px] max-sm:h-[371px] border bg-signal-panel overflow-hidden',
                      i === active ? 'border-dune-amber' : 'border-hairline',
                    )}
                  >
                    {slide.thumbnail ? (
                      <div className={mediaFillClass}>
                        <Media fill htmlElement={null} resource={slide.thumbnail} />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-rtm-body-sm font-rtm-body text-signal-line">
                        {slide.title}
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-rtm-caption font-rtm-body text-ink-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'text-rtm-body-sm font-rtm-body font-semibold truncate',
                        i === active ? 'text-cold-white' : 'text-signal-fog',
                      )}
                    >
                      {slide.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
