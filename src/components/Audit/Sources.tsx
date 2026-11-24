import type { Post } from '@/payload-types'

import React from 'react'

type AuditSources = NonNullable<NonNullable<Post['audit']>['sources']>

const Cell: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
  <div className="min-w-0">
    <div className="font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase md:hidden">{label}</div>
    <div className="font-rtm-body text-[14px] leading-snug text-rtm-fg">{children}</div>
  </div>
)

/**
 * The sources table. Every [S#] citation in the findings links to a row here. Each row
 * says what the source is, who published it, the date it shows ("No date shown" when it
 * shows none), and whether we read it in full. Stacks into labelled blocks on a phone.
 */
export const Sources: React.FC<{ sources: AuditSources }> = ({ sources }) => {
  if (sources.length === 0) return null

  return (
    <section aria-labelledby="sources-label" className="bg-rtm-bg px-[8vw] pb-24" id="sources">
      <div className="border-t border-rtm-accent pt-3 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase" id="sources-label">
        Sources
      </div>

      <div
        aria-hidden
        className="mt-8 hidden grid-cols-[3rem_minmax(0,3fr)_minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] gap-x-4 border-b border-rtm-accent pb-2 font-rtm-mono-label text-[9px] tracking-[0.15em] text-rtm-accent uppercase md:grid"
      >
        <span>Id</span>
        <span>Source</span>
        <span>Publisher</span>
        <span>Type</span>
        <span>Published</span>
        <span>How read</span>
        <span>Status</span>
      </div>

      <ol className="m-0 list-none p-0">
        {sources.map((s, i) => (
          <li
            className="grid scroll-mt-32 grid-cols-2 gap-x-4 gap-y-2 border-b border-rtm-hairline py-4 md:grid-cols-[3rem_minmax(0,3fr)_minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)]"
            id={`source-${s.sid}`}
            key={s.id || i}
          >
            <div className="col-span-2 font-rtm-mono-label text-[13px] font-bold text-rtm-fg md:col-span-1">{s.sid}</div>
            <div className="col-span-2 min-w-0 md:col-span-1">
              {s.url ? (
                <a
                  className="font-rtm-body text-[14px] leading-snug text-rtm-umber underline decoration-rtm-accent underline-offset-4 [overflow-wrap:anywhere] hover:text-rtm-fg"
                  href={s.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.label}
                  <span aria-hidden> ↗</span>
                </a>
              ) : (
                <span className="font-rtm-body text-[14px] leading-snug text-rtm-fg">{s.label}</span>
              )}
            </div>
            <Cell label="Publisher">{s.publisher}</Cell>
            <Cell label="Type">{s.type}</Cell>
            <Cell label="Published">{s.published}</Cell>
            <Cell label="How read">{s.howRead}</Cell>
            <Cell label="Status">{s.status}</Cell>
          </li>
        ))}
      </ol>
    </section>
  )
}
