import React from 'react'

import {
  CRITERIA,
  type CriterionResult,
  meetsStandard,
  RESULT_LABEL,
  STANDARD_LABEL,
  tally,
  VERDICT_LABEL,
  VERDICTS,
  type Verdict,
} from '@/utilities/audit'

import { RESULT_COLOR, RESULT_GLYPH, type RingCriterion, SovereigntyRing } from './SovereigntyRing'

// Tier colours: teal for a service that meets the standard, brass for caveats, umber for
// "not recommended", magenta for reject.
const TIER_COLOR: Record<Verdict, string> = {
  notRecommended: 'var(--rtm-umber)',
  recommend: 'var(--rtm-teal-dark)',
  recommendWithCaveats: 'var(--rtm-accent)',
  reject: 'var(--rtm-magenta)',
}

export type ScorecardTest = RingCriterion & { headline?: null | string }

export const Scorecard: React.FC<{
  serviceName: string
  tests: ScorecardTest[]
  unverified?: boolean | null
  verdict: Verdict
}> = ({ serviceName, tests, unverified, verdict }) => {
  const counts = tally(tests)
  const byKey = new Map(tests.map((t) => [t.key, t]))
  const meets = meetsStandard(verdict)
  const tail = [`${counts.pass} pass`, `${counts.flag} flag`, `${counts.fail} fail`]
  if (counts.unverified) tail.push(`${counts.unverified} unverified`)

  return (
    <section aria-labelledby="scorecard-label" className="bg-rtm-bg px-[8vw] pb-24" id="scorecard">
      <div className="border-t border-rtm-accent pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase" id="scorecard-label">
        The Scorecard
      </div>

      {/* Column gap on large screens only: 11 gaps of 40px don't fit a phone, and the
          sitewide overflow-x: clip would hide the resulting overflow instead of showing it. */}
      <div className="mt-10 grid grid-cols-12 items-center gap-x-0 gap-y-12 lg:gap-x-10">
        <div className="col-span-12 lg:col-span-5">
          <SovereigntyRing criteria={tests} serviceName={serviceName} />
        </div>

        <div className="col-span-12 lg:col-span-7">
          {/* The one-glance answer */}
          <div
            className="flex items-center gap-5 px-6 py-5 text-rtm-bg"
            style={{ background: TIER_COLOR[verdict] }}
          >
            <span aria-hidden className="font-rtm-display text-[44px] leading-none font-black">
              {meets ? '✓' : verdict === 'reject' ? '✕' : unverified ? '?' : '!'}
            </span>
            <div>
              <div className="font-rtm-mono-label text-[11px] tracking-[0.2em] uppercase opacity-90">
                Rethink the Machine standard
              </div>
              <div className="font-rtm-display text-[clamp(24px,3.4vw,40px)] leading-[1.05] font-black uppercase">
                {STANDARD_LABEL[verdict]}
              </div>
            </div>
          </div>

          {/* Where the verdict sits on the four-step scale */}
          <ol
            aria-label="Verdict scale, worst to best"
            className="m-0 mt-5 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4"
          >
            {VERDICTS.map((v) => {
              const active = v === verdict
              return (
                <li
                  aria-current={active ? 'true' : undefined}
                  className={
                    active
                      ? 'border border-rtm-fg bg-rtm-ground-slab px-3 pb-3'
                      : 'border border-rtm-hairline px-3 pb-3 opacity-55'
                  }
                  key={v}
                >
                  <div className="-mx-3 mb-2.5 h-[6px]" style={{ background: active ? TIER_COLOR[v] : 'var(--rtm-hairline)' }} />
                  <div className="font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase">
                    {active ? 'Our verdict' : ' '}
                  </div>
                  <div className={`font-rtm-mono-label text-[12px] text-rtm-fg uppercase ${active ? 'font-bold' : ''}`}>
                    {VERDICT_LABEL[v]}
                    {active && unverified ? ' (unverified)' : ''}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* Legend: the same six results as text, so nothing depends on colour */}
          <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
            {CRITERIA.map((c, i) => {
              const t = byKey.get(c.key)
              const result: CriterionResult = t?.result ?? 'unverified'
              return (
                <li key={c.key}>
                  <a
                    className="group flex items-start gap-3 border-b border-rtm-hairline pb-3 text-rtm-fg no-underline"
                    href={`#test-${i + 1}`}
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center font-rtm-mono-label text-[13px] font-bold text-rtm-bg"
                      style={{ background: RESULT_COLOR[result] }}
                    >
                      {RESULT_GLYPH[result]}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-rtm-body text-[15px] font-semibold group-hover:underline">{c.label}</span>
                      {t?.headline && (
                        <span className="block font-rtm-body text-[14px] leading-snug text-rtm-umber">{t.headline}</span>
                      )}
                    </span>
                    <span className="ml-auto shrink-0 pt-1 font-rtm-mono-label text-[11px] tracking-[0.12em] text-rtm-accent uppercase">
                      {RESULT_LABEL[result]}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          <p className="mt-5 mb-0 font-rtm-mono-label text-[11px] tracking-[0.12em] text-rtm-accent uppercase">
            {tail.join(' · ')}
          </p>
        </div>
      </div>
    </section>
  )
}

const RIGHT_OF_REPLY: Record<string, string> = {
  declined: 'declined to reply',
  'no-reply': 'no reply received',
  'not-yet-sent': 'not yet sent',
  replied: 'replied',
  sent: 'sent, awaiting reply',
}

export type SourceStats = {
  partial?: null | number
  primary?: null | number
  readInFull?: null | number
  singleSource?: null | number
  total?: null | number
}

/** How well the verdict is evidenced: counts of sources, and the company's right of reply. */
export const EvidenceStrip: React.FC<{ rightOfReply?: null | string; stats?: null | SourceStats }> = ({
  rightOfReply,
  stats,
}) => {
  const items: { label: string; value: number | string }[] = []
  if (stats?.total != null) items.push({ label: 'Sources', value: stats.total })
  if (stats?.primary != null) items.push({ label: 'Primary', value: stats.primary })
  if (stats?.readInFull != null) items.push({ label: 'Read in full', value: stats.readInFull })
  if (stats?.singleSource) items.push({ label: 'Single source', value: stats.singleSource })
  if (rightOfReply) items.push({ label: 'Right of reply', value: RIGHT_OF_REPLY[rightOfReply] ?? rightOfReply })
  if (items.length === 0) return null

  return (
    <section aria-label="Strength of evidence" className="bg-rtm-bg px-[8vw] pb-24">
      <dl className="m-0 grid grid-cols-2 gap-6 border-t border-rtm-accent pt-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <div key={it.label}>
            <dt className="font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase">{it.label}</dt>
            <dd className="m-0 mt-1.5 font-rtm-mono-label text-[13px] text-rtm-fg uppercase">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
