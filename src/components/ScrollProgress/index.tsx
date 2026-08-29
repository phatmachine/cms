'use client'

import React, { useEffect, useState } from 'react'

/**
 * 4px accent progress bar tracking scroll position, fixed to the right edge.
 * The brand shows direction/progress this way instead of arrows or chevrons.
 */
export const ScrollProgress: React.FC = () => {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const top = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setPct(height > 0 ? (top / height) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 right-0 w-[3px] bg-[var(--rtm-accent)] z-[200] [transition:height_100ms_linear]"
      style={{ height: `${pct}%` }}
    />
  )
}
