'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Wordmark } from '@/components/Wordmark'
import { cn } from '@/utilities/ui'
import { MenuPanel } from './MenuPanel'

interface HeaderClientProps {
  data: Header
}

const barClass = 'absolute left-0 w-[26px] h-[1.5px] bg-current origin-center [transition:transform_220ms_ease]'

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const lit = scrolled || menuOpen

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between px-12 py-6 max-sm:px-5 max-sm:py-4 min-h-[var(--header-height)] text-ink [transition:background-color_var(--duration-base)_var(--ease-standard),border-color_var(--duration-base)_var(--ease-standard),backdrop-filter_var(--duration-base)_var(--ease-standard)] border-b border-transparent',
        lit && 'bg-[rgba(6,14,20,0.82)] border-b-[rgba(242,212,140,0.14)] backdrop-blur-md',
      )}
      {...(theme === 'dark' ? { 'data-theme': 'signal' } : {})}
    >
      <Wordmark className={cn('text-[18px]', theme !== 'dark' && !lit && 'invert')} href="/" />
      <button
        aria-expanded={menuOpen}
        aria-label="Open navigation"
        className="bg-transparent border-0 cursor-pointer p-3 -m-3 text-current flex"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <span className="relative w-[26px] h-5 block">
          <span
            className={cn(
              barClass,
              'top-[5px]',
              menuOpen && '[transform:translateY(4.5px)_rotate(20deg)]',
            )}
          />
          <span
            className={cn(
              barClass,
              'top-[14px]',
              menuOpen && '[transform:translateY(-4.5px)_rotate(-20deg)]',
            )}
          />
        </span>
      </button>
      <MenuPanel
        footerLinks={data?.footerLinks}
        footerNote={data?.footerNote}
        isOpen={menuOpen}
        navItems={data?.navItems}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  )
}
