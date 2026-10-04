import type { Post } from '@/payload-types'

import React from 'react'

import { Reveal } from '@/components/Reveal'

type SourcesProps = {
  sources: NonNullable<NonNullable<Post['exitGuide']>['sources']>
  sourcesLabel?: null | string
}

/**
 * The receipts, at the foot of the guide and collapsed by default.
 *
 * Deliberately not footnotes in the body copy: the house rule is that the
 * reader only ever meets the advice (rtm-exit-guide/references/criteria.md).
 * But honest opinion is only defensible where its factual basis is visible —
 * the UK Defamation Act 2013 s.3 requires the statement to indicate that
 * basis, and the other markets take the same view in substance. So the
 * citations live one scroll away rather than in a private ledger.
 */
export const Sources: React.FC<SourcesProps> = ({ sources, sourcesLabel }) => {
  if (!sources || sources.length === 0) return null

  return (
    <section className="border-t border-rtm-hairline bg-rtm-ground-footer px-[8vw] py-[100px]">
      {/* Just the always-visible summary line gets the scroll reveal — the
          rows below are display:none while <details> is closed, so
          ScrollTrigger has nothing to observe until a reader opens it. */}
      <Reveal as="details" className="mx-auto max-w-[1100px] group">
        <summary className="flex cursor-pointer list-none items-baseline gap-6 border-t border-rtm-hairline pt-3">
          <span className="font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase">
            {sourcesLabel || 'The Receipts [05]'}
          </span>
          <span className="font-rtm-mono-label text-[13px] text-rtm-fg/60">
            {sources.length} {sources.length === 1 ? 'source' : 'sources'} — every factual claim on
            this page, with a link
          </span>
          <span
            aria-hidden="true"
            className="ml-auto font-rtm-mono-label text-[13px] text-rtm-accent group-open:hidden"
          >
            [ SHOW ]
          </span>
          <span
            aria-hidden="true"
            className="ml-auto hidden font-rtm-mono-label text-[13px] text-rtm-accent group-open:inline"
          >
            [ HIDE ]
          </span>
        </summary>

        <ol className="mt-10 flex flex-col">
          {sources.map((source, i) => (
            <li
              className="grid grid-cols-[60px_1fr] items-baseline gap-6 border-t border-rtm-hairline py-6 last:border-b max-sm:grid-cols-1 max-sm:gap-2"
              key={source.id || i}
            >
              <span className="font-rtm-mono-label text-[13px] text-rtm-accent">
                [{String(i + 1).padStart(2, '0')}]
              </span>
              <div>
                <p className="mb-2 text-base leading-snug text-rtm-fg">{source.claim}</p>
                <p className="font-rtm-mono-label text-[12px] text-rtm-fg/60">
                  {source.publisher && <span>{source.publisher} · </span>}
                  <a
                    className="text-rtm-accent underline decoration-rtm-hairline underline-offset-4 hover:decoration-rtm-accent"
                    href={source.url}
                    rel="noopener nofollow"
                    target="_blank"
                  >
                    View source
                  </a>
                  {source.archiveUrl && (
                    <>
                      {' · '}
                      <a
                        className="text-rtm-accent underline decoration-rtm-hairline underline-offset-4 hover:decoration-rtm-accent"
                        href={source.archiveUrl}
                        rel="noopener nofollow"
                        target="_blank"
                      >
                        Archived copy
                      </a>
                    </>
                  )}
                  {source.checked && <span> · Checked {source.checked}</span>}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
