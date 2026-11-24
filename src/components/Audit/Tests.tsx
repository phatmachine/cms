import type { Post } from '@/payload-types'

import React from 'react'

import { CRITERIA, RESULT_LABEL } from '@/utilities/audit'

import { Cited } from './Cited'
import { RESULT_COLOR, RESULT_GLYPH } from './SovereigntyRing'

type AuditTests = NonNullable<NonNullable<Post['audit']>['tests']>

/**
 * The evidence: one row per test with its result, the finding (each sentence cites its
 * sources), and, for a flag, what a reader can do about it. The anchors (#test-N) are
 * the targets of the scorecard's segments and legend.
 */
export const Tests: React.FC<{ tests: AuditTests }> = ({ tests }) => {
  const byKey = new Map(tests.map((t) => [t.key, t]))

  return (
    <section aria-labelledby="tests-label" className="bg-rtm-bg px-[8vw] pb-24" id="tests">
      <div className="border-t border-rtm-accent pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase" id="tests-label">
        The Six Tests
      </div>

      <ol className="m-0 mt-10 list-none p-0">
        {CRITERIA.map((def, i) => {
          const t = byKey.get(def.key)
          if (!t) return null
          return (
            <li
              className="grid scroll-mt-32 grid-cols-12 gap-x-0 gap-y-3 border-b border-rtm-hairline py-9 first:pt-0 md:gap-x-6"
              id={`test-${i + 1}`}
              key={def.key}
            >
              <div className="col-span-12 md:col-span-4">
                <div className="font-rtm-mono-label text-[11px] tracking-[0.18em] text-rtm-accent uppercase">
                  Test {i + 1}
                </div>
                <h3 className="mt-1.5 mb-0 font-rtm-display text-[26px] leading-[1.1] font-black text-rtm-fg uppercase">
                  {def.long}
                </h3>
              </div>

              <div className="col-span-12 md:col-span-8">
                <span
                  className="inline-flex items-center gap-2 border px-2.5 py-1 font-rtm-mono-label text-[11px] tracking-[0.14em] text-rtm-fg uppercase"
                  style={{ borderColor: RESULT_COLOR[t.result] }}
                >
                  <span
                    aria-hidden
                    className="grid h-[18px] w-[18px] place-items-center text-[11px] font-bold text-rtm-bg"
                    style={{ background: RESULT_COLOR[t.result] }}
                  >
                    {RESULT_GLYPH[t.result]}
                  </span>
                  {RESULT_LABEL[t.result]}
                  {t.headline ? <span className="tracking-normal normal-case"> · {t.headline}</span> : null}
                </span>

                <p className="mt-4 mb-0 max-w-[62ch] font-rtm-body text-rtm-body-lg whitespace-pre-line text-rtm-fg">
                  <Cited text={t.finding} />
                </p>

                {t.readerCanDo && (
                  <div className="mt-5 max-w-[62ch] border-l-[3px] border-rtm-accent bg-rtm-ground-slab px-4 py-3">
                    <div className="font-rtm-mono-label text-[10px] tracking-[0.15em] text-rtm-accent uppercase">
                      What a reader can do
                    </div>
                    <p className="mt-1.5 mb-0 font-rtm-body text-rtm-body whitespace-pre-line text-rtm-fg">
                      <Cited text={t.readerCanDo} />
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
