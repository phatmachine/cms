'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type MenuPanelProps = {
  footerLinks?: HeaderType['footerLinks']
  footerNote?: HeaderType['footerNote']
  isOpen: boolean
  navItems: HeaderType['navItems']
  onClose: () => void
}

export const MenuPanel: React.FC<MenuPanelProps> = ({
  footerLinks,
  footerNote,
  isOpen,
  navItems,
  onClose,
}) => {
  const items = navItems || []

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      {...(isOpen ? {} : { 'aria-hidden': true })}
    >
      <button
        aria-label="Close navigation"
        className={cn(
          'absolute inset-0 bg-[rgba(61,61,51,0.4)] border-0 p-0 opacity-0 [transition:opacity_520ms_cubic-bezier(0.22,1,0.28,1)]',
          isOpen ? 'opacity-100 pointer-events-auto' : 'pointer-events-none',
        )}
        onClick={onClose}
        type="button"
      />
      <aside
        className={cn(
          'absolute top-0 right-0 bottom-0 z-50 w-[min(460px,92vw)] bg-rtm-bg backdrop-blur-xl border-l border-rtm-hairline translate-x-full [transition:transform_620ms_cubic-bezier(0.22,1,0.36,1)] grid grid-rows-[auto_1fr_auto] overflow-hidden',
          isOpen && 'translate-x-0 pointer-events-auto',
        )}
      >
        <div className="flex items-center justify-between h-[72px] px-9 max-sm:px-6 border-b border-rtm-hairline">
          <span className="text-rtm-label font-rtm-mono-label tracking-label uppercase text-rtm-accent">
            Index
          </span>
          <button
            aria-label="Close navigation"
            className="w-9 h-9 grid place-items-center bg-transparent border-0 text-rtm-fg text-[22px] leading-none hover:text-rtm-umber [transition:color_var(--duration-base)_var(--ease-standard)]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <nav className="px-9 max-sm:px-6 py-9 grid content-start overflow-y-auto">
          {items.map(({ link, meta }, i) => (
            <CMSLink
              key={i}
              {...link}
              appearance="inline"
              className={cn(
                'flex items-baseline justify-between gap-4 py-3.5 border-b border-rtm-hairline text-rtm-fg no-underline hover:text-rtm-umber hover:[transition:color_160ms_ease]',
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
                '[transition:opacity_520ms_cubic-bezier(0.22,1,0.28,1),transform_520ms_cubic-bezier(0.22,1,0.28,1)]',
              )}
              style={{ transitionDelay: `${120 + i * 60}ms` }}
              onClick={onClose}
            >
              <span className="font-rtm-body font-medium text-[clamp(16px,1.4vw,19px)] leading-[1.35]">
                {link?.label}
              </span>
              {meta && (
                <span className="text-rtm-caption font-rtm-mono-label tracking-caption uppercase text-rtm-accent">
                  {meta}
                </span>
              )}
            </CMSLink>
          ))}
        </nav>

        {(footerLinks?.length || footerNote) && (
          <div className="px-9 max-sm:px-6 py-7 border-t border-rtm-hairline grid gap-4">
            {footerLinks && footerLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {footerLinks.map(({ link }, i) => (
                  <CMSLink
                    appearance="inline"
                    className="text-rtm-body-sm font-rtm-body text-rtm-umber no-underline hover:text-rtm-fg [transition:color_var(--duration-base)_var(--ease-standard)]"
                    key={i}
                    {...link}
                    onClick={onClose}
                  />
                ))}
              </div>
            )}
            {footerNote && (
              <p className="m-0 text-rtm-caption font-rtm-mono-label tracking-caption uppercase text-rtm-accent text-pretty">
                {footerNote}
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
