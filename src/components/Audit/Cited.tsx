import React from 'react'

const CITE = /\[(S\d+(?:\s*,\s*S\d+)*)\]/g

/**
 * Renders audit text with its [S#] / [S2, S4] citations as links to the matching row of
 * the sources table. Plain text in, plain text out: nothing here is trusted as markup.
 */
export const Cited: React.FC<{ text: string }> = ({ text }) => {
  const out: React.ReactNode[] = []
  let last = 0
  let n = 0
  for (const m of text.matchAll(CITE)) {
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    const ids = m[1].split(/\s*,\s*/)
    out.push(
      <sup className="font-rtm-mono-label text-[0.62em] tracking-normal" key={`c${n++}`}>
        [
        {ids.map((id, i) => (
          <React.Fragment key={id}>
            {i > 0 && ', '}
            <a
              className="text-rtm-umber underline decoration-rtm-accent underline-offset-2 hover:text-rtm-fg"
              href={`#source-${id}`}
            >
              {id}
            </a>
          </React.Fragment>
        ))}
        ]
      </sup>,
    )
    last = at + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}
