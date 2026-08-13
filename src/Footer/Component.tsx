import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { CMSLink } from '@/components/Link'

const linkClasses =
  'no-underline hover:text-gold-400 [transition:color_var(--duration-base)_var(--ease-standard)]'

const wordmarkSpans = [
  { text: 'RET', className: 'tracking-[0.02em] text-star-100' },
  { text: 'HIN', className: 'tracking-[0.10em] text-star-200' },
  { text: 'K TH', className: 'tracking-[0.18em] text-gold-400' },
  { text: 'E MA', className: 'tracking-[0.26em] text-gold-600' },
  { text: 'CHI', className: 'tracking-[0.36em] text-gold-700' },
  { text: 'N', className: 'tracking-[0.44em] text-drift-brass' },
  { text: 'E', className: 'text-drift-bronze' },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const {
    headline,
    subhead,
    missionLine,
    signatureLine,
    columns = [],
    copyrightText,
    disclosure,
    legalLinks,
  } = footerData || {}

  return (
    <footer
      data-theme="ember"
      className="relative overflow-hidden bg-[var(--surface-page)] text-ink text-rtm-body font-rtm-body"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0)_55%)]" />

      <div className="relative max-w-[1240px] mx-auto grid gap-[clamp(48px,6vw,80px)] px-[clamp(24px,5vw,72px)] pt-[clamp(64px,8vw,120px)] pb-8">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-[clamp(24px,3vw,40px)]">
          {headline && (
            <p className="m-0 max-w-[22ch] text-pretty text-[clamp(34px,5.4vw,68px)] leading-[1.02] tracking-[-2px] font-rtm-display font-normal text-gold-300">
              {headline}
            </p>
          )}
          {subhead && (
            <p className="m-0 max-w-[46ch] text-pretty text-rtm-body-lg font-rtm-body text-ink-secondary">
              {subhead}
            </p>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[clamp(32px,4vw,56px)] border-t border-hairline pt-[clamp(32px,4vw,48px)]">
          <div className="grid gap-3.5 content-start">
            <span
              role="img"
              aria-label="Rethink the Machine"
              className="inline-block whitespace-nowrap font-rtm-display text-[17px] leading-none"
            >
              {wordmarkSpans.map(({ text, className }, i) => (
                <span aria-hidden="true" className={className} key={i}>
                  {text}
                </span>
              ))}
            </span>
            {missionLine && (
              <p className="m-0 max-w-[32ch] text-pretty text-rtm-body-sm font-rtm-body text-ink-muted">
                {missionLine}
              </p>
            )}
            {signatureLine && (
              <p className="m-0 max-w-[32ch] text-rtm-body-sm font-rtm-body text-gold-400">
                {signatureLine}
              </p>
            )}
          </div>

          {columns?.map((column, i) => (
            <nav className="grid gap-3 content-start" key={i}>
              <span className="text-rtm-label font-rtm-body tracking-label uppercase text-ink-muted">
                {column.heading}
              </span>
              {column.links?.map(({ link }, j) => (
                <CMSLink
                  appearance="inline"
                  className={`text-rtm-body font-rtm-body text-ink ${linkClasses}`}
                  key={j}
                  {...link}
                />
              ))}
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-hairline pt-6">
          {copyrightText && (
            <span className="text-rtm-caption font-rtm-body tracking-caption text-ink-muted">
              {copyrightText}
            </span>
          )}
          {disclosure && (
            <span className="max-w-[64ch] text-pretty text-rtm-caption font-rtm-body tracking-caption text-ink-muted">
              {disclosure}
            </span>
          )}
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex gap-5">
              {legalLinks.map(({ link }, i) => (
                <CMSLink
                  appearance="inline"
                  className={`text-rtm-caption font-rtm-body tracking-caption text-ink-muted ${linkClasses}`}
                  key={i}
                  {...link}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
