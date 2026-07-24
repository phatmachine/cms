'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

import styles from './Header.module.css'

type MenuPanelProps = {
  isOpen: boolean
  navItems: HeaderType['navItems']
  onClose: () => void
}

export const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, navItems, onClose }) => {
  const items = navItems || []

  return (
    <>
      {isOpen && (
        <button aria-label="Close menu" className={styles.scrim} onClick={onClose} type="button" />
      )}
      <nav
        aria-hidden={!isOpen}
        className={cn(styles.panel, isOpen && styles.panelOpen)}
        data-theme="signal"
      >
        <span className={styles.panelCaption} style={{ transitionDelay: '200ms' }}>
          Site index
        </span>
        {items.map(({ link }, i) => (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            className={styles.panelLink}
            style={{ transitionDelay: `${300 + i * 100}ms` }}
            onClick={onClose}
          />
        ))}
      </nav>
    </>
  )
}
