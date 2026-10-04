import * as Flags from 'country-flag-icons/react/3x2'
import React from 'react'

import { tokeniseJurisdiction } from '@/utilities/jurisdictionFlags'

type FlagComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

/**
 * Just the flags for a jurisdiction value — no text — for tight spots like a
 * post card's header row. With no country name beside them the flags carry the
 * meaning on their own, so each is labelled (tooltip + screen readers) with
 * the country as written. Renders nothing if no country is recognised, and
 * collapses a country named twice ("USA / United States") to one flag.
 *
 * Server component, for the same reason as JurisdictionValue: the client-side
 * Card receives the rendered result as a prop instead of bundling every flag.
 */
export const JurisdictionFlags: React.FC<{ className?: string; value: string }> = ({
  className,
  value,
}) => {
  const seen = new Set<string>()

  const flags = tokeniseJurisdiction(value).flatMap((token) => {
    if ('separator' in token || !token.code || seen.has(token.code)) return []
    seen.add(token.code)
    const Flag = (Flags as Record<string, FlagComponent>)[token.code]
    return Flag ? [{ Flag, label: token.text }] : []
  })

  if (flags.length === 0) return null

  return (
    <>
      {flags.map(({ Flag, label }, i) => (
        <span aria-label={label} className="inline-flex" key={i} role="img" title={label}>
          <Flag
            aria-hidden="true"
            className={
              className ??
              'h-[0.95em] w-[1.425em] shrink-0 rounded-[1.5px] shadow-[0_0_0_1px_rgba(61,61,51,0.18)]'
            }
            focusable="false"
          />
        </span>
      ))}
    </>
  )
}

/**
 * A jurisdiction spec value with a flag beside each country it names, e.g.
 * "CHINA / IRELAND" -> [CN] CHINA / [IE] IRELAND. Anything it can't recognise
 * renders as plain text, so a free-text value is never broken by this.
 *
 * SVG flags rather than flag emoji on purpose: Windows ships no flag glyphs,
 * so emoji flags show up there as bare two-letter codes ("US").
 *
 * Server component — the flag set is only ever in the server bundle; the page
 * just receives the small inline <svg> for the flags actually used.
 */
export const JurisdictionValue: React.FC<{ value: string }> = ({ value }) => (
  <>
    {tokeniseJurisdiction(value).map((token, i) => {
      if ('separator' in token) return <React.Fragment key={i}>{token.separator}</React.Fragment>

      const Flag = token.code ? (Flags as Record<string, FlagComponent>)[token.code] : undefined
      if (!Flag) return <React.Fragment key={i}>{token.text}</React.Fragment>

      return (
        // nowrap keeps a flag from being stranded on a different line from
        // the country it belongs to when a two-country value wraps.
        <span className="inline-flex items-center gap-2 whitespace-nowrap" key={i}>
          {/* Decorative: the country name right beside it carries the meaning.
              The hairline ring stops white-heavy flags (Japan, Finland...)
              dissolving into the cream page. */}
          <Flag
            aria-hidden="true"
            className="h-[0.95em] w-[1.425em] shrink-0 rounded-[1.5px] shadow-[0_0_0_1px_rgba(61,61,51,0.18)]"
            focusable="false"
          />
          {token.text}
        </span>
      )
    })}
  </>
)
