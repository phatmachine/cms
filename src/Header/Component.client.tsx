'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { MenuPanel } from './MenuPanel'
import styles from './Header.module.css'

interface HeaderClientProps {
  data: Header
}

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
      className={styles.header}
      {...(theme === 'dark' ? { 'data-theme': 'signal' } : {})}
    >
      <Link className={styles.logoLink} href="/">
        <img alt="Rethink the Machine" className={styles.logo} src="/rethink-logo.png" />
      </Link>
      <button
        aria-label="Menu"
        className={styles.menuButton}
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <span className={styles.iconWrap}>
          <span
            className={cn(styles.bar, styles.barTop, menuOpen && styles.barTopOpen)}
          />
          <span
            className={cn(styles.bar, styles.barBottom, menuOpen && styles.barBottomOpen)}
          />
        </span>
      </button>
      <MenuPanel isOpen={menuOpen} navItems={data?.navItems} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
