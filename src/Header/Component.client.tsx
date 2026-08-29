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

/**
 * Fixed nav, no background, no border, no scroll state — the brand's nav
 * never changes register as you scroll. See readme.md "Layout".
 */
export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-12 py-6 max-sm:px-5 max-sm:py-4 min-h-[var(--header-height)] text-rtm-fg">
      <Wordmark className="text-[16px]" href="/" variant="nav" />
      <button
        aria-expanded={menuOpen}
        aria-label="Open navigation"
        className="bg-transparent border-0 p-3 -m-3 text-current flex"
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
