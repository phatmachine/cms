import Link from 'next/link'
import React from 'react'

type WordmarkProps = {
  className?: string
  href?: string
  /**
   * "nav" — bracketed, uppercase, mono-tracked: `[ Rethink the Machine ]`.
   * "footer" — mixed case with a full stop, the one place lowercase runs:
   * `Rethink the Machine.` This is the brand's only exception to uppercase.
   */
  variant?: 'footer' | 'nav'
}

export const Wordmark: React.FC<WordmarkProps> = ({ className, href, variant = 'nav' }) => {
  const mark =
    variant === 'footer' ? (
      <span
        className={`inline-block whitespace-nowrap font-rtm-display font-black leading-none normal-case text-rtm-fg ${className ?? ''}`}
      >
        Rethink the Machine.
      </span>
    ) : (
      <span
        className={`inline-block whitespace-nowrap font-rtm-mono-label uppercase leading-none tracking-label text-rtm-fg ${className ?? ''}`}
      >
        <span className="opacity-50">[ </span>
        Rethink the Machine
        <span className="opacity-50"> ]</span>
      </span>
    )

  if (!href) return mark

  return (
    <Link className="inline-flex" href={href}>
      {mark}
    </Link>
  )
}
