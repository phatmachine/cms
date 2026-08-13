'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

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

  return (
    <header
      className="relative z-30 flex items-center justify-between px-12 py-6 max-sm:px-5 max-sm:py-4 min-h-[var(--header-height)] bg-transparent text-ink"
      {...(theme === 'dark' ? { 'data-theme': 'signal' } : {})}
    >
      <Link className="flex items-center" href="/">
        <img
          alt="Rethink the Machine"
          className={cn(
            'w-[72px] h-[72px] max-sm:w-12 max-sm:h-12 object-contain block',
            theme !== 'dark' && 'invert',
          )}
          src="/rethink-logo.png"
        />
      </Link>
      <button
        aria-label="Menu"
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
      <MenuPanel isOpen={menuOpen} navItems={data?.navItems} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
