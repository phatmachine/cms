import type { Post } from '@/payload-types'

import React from 'react'

import { JurisdictionValue } from '@/components/ExitGuide/JurisdictionValue'
import { type Verdict } from '@/utilities/audit'

import { Cited } from './Cited'
import { EvidenceStrip, Scorecard } from './Scorecard'
import { Sources } from './Sources'
import { Tests } from './Tests'

const fmt = (iso?: null | string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', timeZone: 'UTC', year: 'numeric' })
    : null

const DAY = 86_400_000

// Kept outside the component: it reads the clock. The post page is force-dynamic, so
// "now" is the real request time, not a build-time snapshot.
function recheckState(iso?: null | string): 'due-soon' | 'expired' | null {
  if (!iso) return null
  const ms = new Date(iso).getTime() - Date.now()
  if (ms < 0) return 'expired'
  return ms < 30 * DAY ? 'due-soon' : null
}

function Note({ label, text }: { label: string; text?: null | string }) {
  if (!text) return null
  return (
    <div className="grid grid-cols-12 gap-x-0 gap-y-2 border-t border-rtm-accent pt-3 md:gap-x-6">
      <div className="col-span-12 font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase md:col-span-4">
        {label}
      </div>
      <p className="col-span-12 m-0 max-w-[62ch] font-rtm-body text-rtm-body-lg whitespace-pre-line text-rtm-fg md:col-span-8">
        <Cited text={text} />
      </p>
    </div>
  )
}

/**
 * The "Sovereignty audit" post template: a typographic header, the scorecard (ring +
 * verdict + scale + one line per test), the strength of the evidence, the six tests with
 * linked citations, the red-team ("strongest case against"), the company's position,
 * what would change the verdict, the sources table, the integrity record and the
 * verbatim disclaimer. Everything reads off `post.audit`. `blocking` (open checklist
 * items) is internal and never rendered.
 */
export const AuditTemplate: React.FC<{ post: Post }> = ({ post }) => {
  const { audit } = post
  if (!audit || !audit.verdict || !audit.tests?.length) return null

  const serviceName = audit.serviceName || post.title
  const checked = fmt(audit.checkedAt)
  const recheck = fmt(audit.recheckBy)
  const verdict = audit.verdict as Verdict

  const state = recheckState(audit.recheckBy)
  const expired = state === 'expired'
  const dueSoon = state === 'due-soon'

  const kicker = ['Sovereignty audit', audit.serviceCategory].filter(Boolean).join(' // ')
  const hasWho = audit.serviceDescriptor || audit.operator || audit.country

  return (
    <>
      <header className="bg-rtm-bg px-[8vw] pt-40 pb-16">
        <div className="mb-[2.5vw] font-rtm-mono-label text-[11px] tracking-[0.22em] text-rtm-accent uppercase max-sm:mb-6">
          {kicker}
          {checked ? ` // Checked ${checked}` : ''}
          {audit.version && audit.version > 1 ? ` // Version ${audit.version}` : ''}
        </div>

        <h1 className="m-0 font-rtm-display text-[clamp(48px,11vw,168px)] leading-[0.85] font-black tracking-[-0.045em] text-rtm-fg uppercase [overflow-wrap:anywhere]">
          {serviceName}
        </h1>

        {hasWho && (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-rtm-mono-label text-[13px] tracking-[0.08em] text-rtm-umber uppercase">
            {audit.serviceDescriptor && <span>{audit.serviceDescriptor}</span>}
            {audit.serviceDescriptor && (audit.operator || audit.country) && <span aria-hidden>·</span>}
            {audit.operator && <span>{audit.operator}</span>}
            {audit.operator && audit.country && <span aria-hidden>·</span>}
            {audit.country && <JurisdictionValue value={audit.country} />}
          </div>
        )}

        {audit.alternativeTo && audit.alternativeTo.length > 0 && (
          <div className="mt-3 font-rtm-mono-label text-[12px] tracking-[0.08em] text-rtm-accent uppercase">
            Alternative to {audit.alternativeTo.join(', ')}
          </div>
        )}

        {audit.takeaway && (
          <p className="mt-10 mb-0 max-w-[760px] font-rtm-meshed text-[clamp(22px,2.6vw,36px)] leading-[1.25] font-black tracking-[0.01em] text-rtm-fg">
            {audit.takeaway}
          </p>
        )}

        {audit.summary && (
          <p className="mt-6 mb-0 max-w-[62ch] font-rtm-body text-rtm-body-lg whitespace-pre-line text-rtm-fg">
            <Cited text={audit.summary} />
          </p>
        )}

        {audit.scope && (
          <p className="mt-4 mb-0 max-w-[62ch] font-rtm-body text-[14px] text-rtm-umber italic">
            Scope: {audit.scope}
          </p>
        )}
      </header>

      {(expired || dueSoon) && (
        <div className="px-[8vw] pb-12" role="note">
          <div className="border-l-[6px] border-rtm-magenta bg-rtm-ground-slab px-5 py-4 font-rtm-body text-rtm-body text-rtm-fg">
            {expired ? (
              <>
                <strong>This verdict is out of date.</strong> It passed its re-check date on {recheck} and has not been
                re-verified. Treat it as unverified until it is.
              </>
            ) : (
              <>
                <strong>Re-check due.</strong> This verdict is due to be re-verified by {recheck}.
              </>
            )}
          </div>
        </div>
      )}

      <Scorecard
        serviceName={serviceName}
        tests={audit.tests.map((t) => ({ headline: t.headline, key: t.key, result: t.result }))}
        unverified={audit.unverified}
        verdict={verdict}
      />

      <EvidenceStrip rightOfReply={audit.rightOfReply} stats={audit.sourceStats} />

      <Tests tests={audit.tests} />

      {(audit.strongestCaseAgainst || audit.companySays || audit.notesForReaders || audit.whatWouldChange) && (
        <section className="flex flex-col gap-14 bg-rtm-bg px-[8vw] pb-24">
          <Note label="Strongest case against" text={audit.strongestCaseAgainst} />
          <Note label="What the company says" text={audit.companySays} />
          <Note label="Notes for readers" text={audit.notesForReaders} />
          <Note label="What would change this verdict" text={audit.whatWouldChange} />
        </section>
      )}

      {audit.sources && audit.sources.length > 0 && <Sources sources={audit.sources} />}

      {audit.integrityRecord && (
        <section className="bg-rtm-bg px-[8vw] pb-16">
          <details className="border-t border-rtm-accent pt-3">
            <summary className="cursor-pointer font-rtm-mono-label text-rtm-label tracking-label text-rtm-accent uppercase">
              Integrity record
            </summary>
            <p className="mt-6 mb-0 max-w-[70ch] font-rtm-body text-[14px] whitespace-pre-line text-rtm-fg">
              {audit.integrityRecord}
            </p>
          </details>
        </section>
      )}

      {audit.disclaimer && (
        <footer className="bg-rtm-bg px-[8vw]">
          <p className="m-0 max-w-[70ch] border-t border-rtm-hairline pt-6 font-rtm-body text-[13px] text-rtm-umber">
            {audit.disclaimer}
          </p>
        </footer>
      )}
    </>
  )
}
