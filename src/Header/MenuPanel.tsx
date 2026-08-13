'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

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
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-transparent border-0 cursor-pointer p-0"
          onClick={onClose}
          type="button"
        />
      )}
      <nav
        aria-hidden={!isOpen}
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 bg-signal-panel border-l border-hairline-strong flex flex-col justify-center px-12 max-sm:px-7 gap-1 w-[360px] max-w-[80vw] translate-x-full [transition:transform_700ms_cubic-bezier(0.22,1,0.36,1)]',
          isOpen && 'translate-x-0',
        )}
        data-theme="signal"
      >
        <span
          className={cn(
            'text-rtm-caption font-rtm-body tracking-caption text-ink-muted mb-6',
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18px]',
            '[transition:opacity_800ms_ease,transform_800ms_cubic-bezier(0.22,1,0.36,1)]',
          )}
          style={{ transitionDelay: '200ms' }}
        >
          Site index
        </span>
        {items.map(({ link }, i) => (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            className={cn(
              'text-[16px] leading-[1.3] font-rtm-display font-normal tracking-[-0.2px] text-cold-white py-2.5 border-b border-hairline last:border-none hover:opacity-[0.85] hover:[transition:opacity_160ms_ease]',
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18px]',
              '[transition:opacity_800ms_ease,transform_800ms_cubic-bezier(0.22,1,0.36,1)]',
            )}
            style={{ transitionDelay: `${300 + i * 100}ms` }}
            onClick={onClose}
          />
        ))}
      </nav>
    </>
  )
}
