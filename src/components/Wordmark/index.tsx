import Link from 'next/link'
import React from 'react'

const spans = [
  { text: 'RET', className: 'tracking-[0.02em] text-star-100' },
  { text: 'HIN', className: 'tracking-[0.10em] text-star-200' },
  { text: 'K TH', className: 'tracking-[0.18em] text-gold-400' },
  { text: 'E MA', className: 'tracking-[0.26em] text-gold-600' },
  { text: 'CHI', className: 'tracking-[0.36em] text-gold-700' },
  { text: 'N', className: 'tracking-[0.44em] text-drift-brass' },
  { text: 'E', className: 'text-drift-bronze' },
]

type WordmarkProps = {
  className?: string
  href?: string
}

export const Wordmark: React.FC<WordmarkProps> = ({ className, href }) => {
  const mark = (
    <span
      role="img"
      aria-label="Rethink the Machine"
      className={`inline-block whitespace-nowrap font-rtm-display leading-none ${className ?? ''}`}
    >
      {spans.map(({ text, className: spanClassName }, i) => (
        <span aria-hidden="true" className={spanClassName} key={i}>
          {text}
        </span>
      ))}
    </span>
  )

  if (!href) return mark

  return (
    <Link className="inline-flex" href={href}>
      {mark}
    </Link>
  )
}
