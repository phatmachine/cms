import React from 'react'

import { CRITERIA, type CriterionKey, type CriterionResult, RESULT_LABEL, tally } from '@/utilities/audit'

export type RingCriterion = { key: CriterionKey; result: CriterionResult }

// One CSS variable per result. Brand rule: the Paper register has no semantic green or
// red, so pass is the brand teal, flag is the olive-brass accent, fail is the magenta,
// and unverified is the umber. Colour is never the only signal: each result also has its
// own glyph, and flag is hatched.
export const RESULT_COLOR: Record<CriterionResult, string> = {
  fail: 'var(--rtm-magenta)',
  flag: 'var(--rtm-accent)',
  pass: 'var(--rtm-teal-dark)',
  unverified: 'var(--rtm-umber)',
}

export const RESULT_GLYPH: Record<CriterionResult, string> = {
  fail: '✕',
  flag: '!',
  pass: '✓',
  unverified: '?',
}

const CX = 180
const CY = 180
const R_OUT = 140
const R_IN = 90
const GAP = 5 // degrees between segments
const START = -90 // twelve o'clock; segments run clockwise

const r2 = (n: number) => Math.round(n * 100) / 100
const polar = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [r2(CX + r * Math.cos(a)), r2(CY + r * Math.sin(a))]
}

function segmentPath(a0: number, a1: number) {
  const [x0, y0] = polar(R_OUT, a0)
  const [x1, y1] = polar(R_OUT, a1)
  const [x2, y2] = polar(R_IN, a1)
  const [x3, y3] = polar(R_IN, a0)
  return `M${x0} ${y0} A${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 0 0 ${x3} ${y3}Z`
}

// Glyphs are drawn, not typed, so they look the same in every font.
function Glyph({ result, x, y }: { result: CriterionResult; x: number; y: number }) {
  const line = {
    fill: 'none',
    stroke: 'var(--rtm-bg)',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 5,
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      {result === 'pass' && <path d="M-11 0 L-3.5 8 L12 -9" {...line} />}
      {result === 'fail' && <path d="M-9 -9 L9 9 M9 -9 L-9 9" {...line} />}
      {result === 'flag' && (
        <>
          <path d="M0 -12 L0 3" {...line} />
          <circle cx="0" cy="11" fill="var(--rtm-bg)" r="3.4" />
        </>
      )}
      {result === 'unverified' && (
        <>
          <path d="M-7 -7 C-7 -16 7 -16 7 -7 C7 -1 0 0 0 6" {...line} />
          <circle cx="0" cy="13" fill="var(--rtm-bg)" r="3.4" />
        </>
      )}
    </g>
  )
}

/**
 * The scorecard graphic: six segments, one per test, clockwise from the top. Reads in
 * under a second: a ring of teal ticks is a service that meets the standard, brass
 * hatching is a flag to read, any magenta cross is a fail, a umber question mark is
 * something that could not be verified. The centre shows how many of the six pass. Each
 * segment links to that test's evidence further down the page.
 */
export const SovereigntyRing: React.FC<{
  criteria: RingCriterion[]
  serviceName: string
}> = ({ criteria, serviceName }) => {
  const byKey = new Map(criteria.map((c) => [c.key, c.result]))
  const counts = tally(criteria)
  const step = 360 / CRITERIA.length

  const parts = [`${counts.pass} of ${CRITERIA.length} tests pass`]
  if (counts.flag) parts.push(`${counts.flag} flagged`)
  if (counts.fail) parts.push(`${counts.fail} fail`)
  if (counts.unverified) parts.push(`${counts.unverified} unverified`)
  const title = `${serviceName}: ${parts.join(', ')}`
  const desc = CRITERIA.map((c, i) => `${i + 1}. ${c.label}: ${RESULT_LABEL[byKey.get(c.key) ?? 'unverified']}`).join('. ')

  return (
    <svg
      aria-describedby="audit-ring-desc"
      aria-labelledby="audit-ring-title"
      className="mx-auto h-auto w-full max-w-[420px]"
      role="img"
      viewBox="0 0 360 360"
    >
      <title id="audit-ring-title">{title}</title>
      <desc id="audit-ring-desc">{desc}</desc>
      <defs>
        <pattern height="9" id="audit-hatch" patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="9">
          <rect fill={RESULT_COLOR.flag} height="9" width="9" />
          <rect fill="var(--rtm-bg)" height="9" opacity="0.32" width="3.5" />
        </pattern>
      </defs>

      {CRITERIA.map((c, i) => {
        const result = byKey.get(c.key) ?? 'unverified'
        const a0 = START + i * step + GAP / 2
        const a1 = START + (i + 1) * step - GAP / 2
        const mid = (a0 + a1) / 2
        const [gx, gy] = polar((R_OUT + R_IN) / 2, mid)
        const [bx, by] = polar(R_OUT + 20, mid)
        return (
          <a href={`#test-${i + 1}`} key={c.key}>
            <title>{`${i + 1}. ${c.long}: ${RESULT_LABEL[result]}`}</title>
            <path
              d={segmentPath(a0, a1)}
              fill={result === 'flag' ? 'url(#audit-hatch)' : RESULT_COLOR[result]}
            />
            <Glyph result={result} x={gx} y={gy} />
            <circle cx={bx} cy={by} fill="var(--rtm-bg)" r="12" stroke="var(--rtm-accent)" strokeWidth="1.2" />
            <text
              className="font-rtm-mono-label"
              dominantBaseline="central"
              fill="var(--rtm-fg)"
              fontSize="12"
              textAnchor="middle"
              x={bx}
              y={by}
            >
              {i + 1}
            </text>
          </a>
        )
      })}

      <text
        className="font-rtm-display"
        dominantBaseline="central"
        fill="var(--rtm-fg)"
        fontSize="64"
        fontWeight="900"
        textAnchor="middle"
        x={CX}
        y={CY - 8}
      >
        {counts.pass}
        <tspan dy="-4" fill="var(--rtm-accent)" fontSize="30">/{CRITERIA.length}</tspan>
      </text>
      <text
        className="font-rtm-mono-label"
        dominantBaseline="central"
        fill="var(--rtm-accent)"
        fontSize="11"
        letterSpacing="2.2"
        textAnchor="middle"
        x={CX}
        y={CY + 34}
      >
        TESTS PASSED
      </text>
    </svg>
  )
}
