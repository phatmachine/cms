'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef, useState } from 'react'

import type { Page, Slide } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

import styles from './SignalCarousel.module.css'

type SignalCarouselHeroProps = Page['hero']

const patternClass = {
  points: styles.patternPoints,
  grid: styles.patternGrid,
  lines: styles.patternLines,
  none: null,
} as const

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
      <div className={styles.hero} data-theme="signal">
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No slides yet. Add slides in the admin panel (Collections → Carousel Slides), then
            select and order them on this page&apos;s Hero tab.
          </p>
        </div>
      </div>
    )
  }

  const overlayMid = 0.15 + 0.5 * overlayStrength
  const pattern = patternClass[backdropPattern] || patternClass.points
  const current = slides[active]!

  return (
    <div className={styles.hero} data-theme="signal">
      {slides.map((slide, i) => (
        <div
          className={styles.bgLayer}
          key={slide.id}
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? 'auto' : 'none' }}
        >
          <div className={styles.mediaFill}>
            {slide.background ? (
              <Media fill htmlElement={null} priority={i === active} resource={slide.background} />
            ) : (
              <div className={styles.bgPlaceholder}>
                <span className={styles.bgPlaceholderText}>
                  Background — {slide.title} ({slide.category})
                </span>
              </div>
            )}
          </div>
          <div
            className={styles.scrim}
            style={{
              background: `linear-gradient(180deg, rgba(10,11,11,0.55) 0%, rgba(22,36,38,${overlayMid}) 45%, rgba(10,11,11,0.85) 100%)`,
            }}
          />
        </div>
      ))}

      {pattern && <div className={pattern} />}

      <div className={styles.content}>
        <div className={styles.textBlock} key={current.id}>
          <div className={styles.eyebrowRow}>
            <span className={styles.category}>{current.category}</span>
            <span className={styles.hairline} />
            <span className={styles.brand}>{current.brand}</span>
          </div>
          <h1 className={styles.title}>{current.title}</h1>
          <p className={styles.line}>{current.line}</p>
          <div className={styles.ctaRow}>
            {hasResolvableLink(current.link) ? (
              <CMSLink {...current.link} appearance="inline" className={styles.ctaLink}>
                Read the study
              </CMSLink>
            ) : (
              <span aria-disabled="true" className={styles.ctaLinkDisabled}>
                Read the study
              </span>
            )}
            <span className={styles.counter}>
              {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {showThumbnails && (
          <div
            className={styles.stripWrap}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.strip} ref={stripRef}>
              {slides.map((slide, i) => (
                <button
                  className={styles.card}
                  key={slide.id}
                  onClick={() => select(i)}
                  style={{ opacity: i === active ? 1 : 0.55 }}
                  type="button"
                >
                  <div
                    className={cn(styles.cardThumb, i === active && styles.cardThumbActive)}
                  >
                    {slide.thumbnail ? (
                      <div className={styles.mediaFill}>
                        <Media fill htmlElement={null} resource={slide.thumbnail} />
                      </div>
                    ) : (
                      <div className={styles.cardThumbPlaceholder}>{slide.title}</div>
                    )}
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={cn(styles.cardTitle, i === active && styles.cardTitleActive)}
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
