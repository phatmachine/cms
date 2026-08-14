'use client'

import React, { useState } from 'react'

import { cn } from '@/utilities/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type EmailCaptureProps = {
  buttonLabel?: string
  className?: string
  errorMessage?: string
  successMessage?: string
}

export const EmailCapture: React.FC<EmailCaptureProps> = ({
  buttonLabel = 'Notes by email',
  className,
  errorMessage = "That doesn't read as an email address. Try again.",
  successMessage = "Received. We write when there's something worth saying — not on a schedule.",
}) => {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(
      EMAIL_RE.test(email.trim())
        ? { ok: true, message: successMessage }
        : { ok: false, message: errorMessage },
    )
  }

  return (
    <form className={cn('grid gap-3', className)} onSubmit={submit}>
      <div className="flex flex-wrap items-end gap-4">
        <input
          aria-label="Email address"
          className="min-w-[260px] flex-1 bg-transparent border-0 border-b border-hairline text-rtm-body font-rtm-body text-ink placeholder:text-ink-muted px-0 py-3 outline-none focus-visible:border-[var(--focus-ring)] [transition:border-color_var(--duration-base)_var(--ease-standard)]"
          onChange={(e) => {
            setEmail(e.target.value)
            setResult(null)
          }}
          placeholder="name@example.com"
          type="email"
          value={email}
        />
        <button
          className="inline-flex items-center justify-center h-[52px] px-7 rounded-[var(--radius-pill)] bg-[var(--action-primary)] text-[var(--action-on-primary)] text-rtm-body-sm font-rtm-body font-medium whitespace-nowrap border-0 cursor-pointer hover:bg-[var(--action-primary-hover)] [transition:background-color_var(--duration-base)_var(--ease-standard)]"
          type="submit"
        >
          {buttonLabel}
        </button>
      </div>
      <p
        className={cn(
          'm-0 min-h-[21px] text-rtm-body-sm font-rtm-body',
          result == null && 'text-ink-secondary',
          result?.ok && 'text-gold-300',
          result && !result.ok && 'text-ink-secondary',
        )}
      >
        {result?.message ?? ''}
      </p>
    </form>
  )
}
