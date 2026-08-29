import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Wordmark } from '@/components/Wordmark'

const linkClasses =
  'no-underline hover:text-rtm-fg [transition:color_var(--duration-base)_var(--ease-standard)]'

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
    <footer className="relative overflow-hidden bg-rtm-ground-footer text-rtm-fg text-rtm-body font-rtm-body">
      <div className="relative max-w-[1240px] mx-auto grid gap-[clamp(48px,6vw,80px)] px-[clamp(24px,5vw,72px)] pt-[clamp(64px,8vw,120px)] pb-8">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-[clamp(24px,3vw,40px)]">
          {headline && (
            <p className="m-0 max-w-[24ch] text-pretty text-[clamp(30px,4vw,56px)] italic leading-[1.1] font-rtm-serif font-normal text-rtm-umber">
              {headline}
            </p>
          )}
          {subhead && (
            <p className="m-0 max-w-[46ch] text-pretty text-rtm-body-lg font-rtm-serif text-rtm-fg">
              {subhead}
            </p>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[clamp(32px,4vw,56px)] border-t border-rtm-hairline pt-[clamp(32px,4vw,48px)]">
          <div className="grid gap-3.5 content-start">
            <Wordmark className="text-[19px]" variant="footer" />
            {missionLine && (
              <p className="m-0 max-w-[32ch] text-pretty text-rtm-body-sm font-rtm-body text-rtm-umber">
                {missionLine}
              </p>
            )}
            {signatureLine && (
              <p className="m-0 max-w-[32ch] text-rtm-caption font-rtm-mono-label tracking-caption uppercase text-rtm-accent">
                {signatureLine}
              </p>
            )}
          </div>

          {columns?.map((column, i) => (
            <nav className="grid gap-3 content-start" key={i}>
              <span className="text-rtm-label font-rtm-mono-label tracking-label uppercase text-rtm-accent">
                {column.heading}
              </span>
              {column.links?.map(({ link }, j) => (
                <CMSLink
                  appearance="inline"
                  className={`text-rtm-body-sm font-rtm-mono-label tracking-label uppercase text-rtm-fg ${linkClasses}`}
                  key={j}
                  {...link}
                />
              ))}
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-rtm-hairline pt-6">
          {copyrightText && (
            <span className="text-rtm-caption font-rtm-mono-label tracking-caption uppercase text-rtm-accent">
              {copyrightText}
            </span>
          )}
          {disclosure && (
            <span className="max-w-[64ch] text-pretty text-rtm-caption font-rtm-mono-label tracking-caption uppercase text-rtm-accent">
              {disclosure}
            </span>
          )}
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex gap-5">
              {legalLinks.map(({ link }, i) => (
                <CMSLink
                  appearance="inline"
                  className={`text-rtm-caption font-rtm-mono-label tracking-caption uppercase text-rtm-accent ${linkClasses}`}
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
