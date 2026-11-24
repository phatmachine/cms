import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

import { allowedVerdicts, isUnverified, meetsStandard, tally, verdictFromSlug } from '@/utilities/audit'
import { parseAudit, parseDate, slugify } from '@/utilities/auditParser'

const fixture = fs.readFileSync(path.join(__dirname, '../fixtures/audit-examplemail.md'), 'utf8')
const swap = (from: string, to: string) => {
  expect(fixture).toContain(from) // a typo here would make a test pass for the wrong reason
  return fixture.replace(from, to)
}

describe('parseDate', () => {
  it('reads the common date spellings', () => {
    expect(parseDate('2026-10-17')).toBe('2026-10-17')
    expect(parseDate('17 October 2026')).toBe('2026-10-17')
    expect(parseDate('October 17, 2026')).toBe('2026-10-17')
    expect(parseDate('1st Sept 2026')).toBe('2026-09-01')
  })
  it('rejects impossible dates', () => {
    expect(parseDate('31 February 2026')).toBeNull()
    expect(parseDate('sometime soon')).toBeNull()
  })
})

describe('slugify', () => {
  it('makes a url-safe slug', () => {
    expect(slugify('Proton Mail')).toBe('proton-mail')
    expect(slugify('Tuta & Co.')).toBe('tuta-and-co')
  })
})

describe('parseAudit (fixture)', () => {
  const { audit, errors, warnings } = parseAudit(fixture)

  it('has no errors or warnings', () => {
    expect(errors).toEqual([])
    expect(warnings).toEqual([])
  })

  it('reads the summary block', () => {
    expect(audit.serviceName).toBe('ExampleMail')
    expect(audit.serviceDescriptor).toBe('encrypted email')
    expect(audit.operator).toBe('ExampleMail AG')
    expect(audit.country).toBe('Switzerland')
    expect(audit.alternativeTo).toEqual(['Gmail', 'Outlook'])
    expect(audit.verdict).toBe('recommendWithCaveats')
    expect(audit.unverified).toBe(false)
    expect(audit.checkedAt).toBe('2026-10-17')
    expect(audit.recheckBy).toBe('2027-04-17')
    expect(audit.takeaway).toMatch(/^Strong encryption/)
    expect(audit.publicationReady).toBe(true)
    expect(audit.rightOfReply).toBe('replied')
    expect(audit.sourceStats).toMatchObject({ primary: 4, readInFull: 5, singleSource: 1, total: 5 })
  })

  it('reads the six tests in canonical order, with body text', () => {
    expect(audit.tests.map((t) => t.key)).toEqual([
      'independence',
      'usReach',
      'privacy',
      'military',
      'law',
      'rightToLeave',
    ])
    expect(audit.tests.map((t) => t.result)).toEqual(['pass', 'flag', 'pass', 'pass', 'pass', 'flag'])
    expect(audit.tests[1].headline).toBe('US card processor handles payments')
    expect(audit.tests[1].finding).toMatch(/^No US entity .*\[S1\]\. A US card processor .*\[S2\]\.$/)
    expect(audit.tests[1].readerCanDo).toMatch(/^Pay by bank transfer/)
    expect(audit.tests[0].readerCanDo).toBe('')
    // The flag's mitigation must not leak into the next test's finding
    expect(audit.tests[2].finding).not.toMatch(/bank transfer/)
  })

  it('reads the prose sections', () => {
    expect(audit.scope).toMatch(/consumer email product/)
    expect(audit.summary).toMatch(/^ExampleMail AG is owned by its founders/)
    expect(audit.strongestCaseAgainst).toMatch(/^The closed-source apps/)
    expect(audit.companySays).toMatch(/cannot read it/)
    expect(audit.notesForReaders).toMatch(/^• Use a mail client/)
    expect(audit.whatWouldChange).toMatch(/acquisition/)
    expect(audit.integrityRecord).toMatch(/Right of reply: replied/)
    expect(audit.disclaimer).toMatch(/^This audit is Rethink the Machine's assessment/)
    expect(audit.disclaimer).not.toMatch(/^>/)
  })

  it('reads the sources table', () => {
    expect(audit.sources).toHaveLength(5)
    expect(audit.sources[0]).toMatchObject({
      howRead: 'In full',
      publisher: 'Zefix',
      published: 'No date shown',
      sid: 'S1',
      status: 'Confirmed',
      type: 'Registry',
      url: 'https://example.com/zefix/examplemail',
    })
    expect(audit.sources[4].status).toBe('Single source')
  })
})

describe('the audit must agree with itself', () => {
  it('errors on a file that is not an audit', () => {
    expect(parseAudit('# Just a post\n\nHello').errors.join(' ')).toMatch(/Not an audit file/)
  })

  it('errors when the verdict is more favourable than the tests allow', () => {
    const md = swap('verdict: recommend-with-caveats', 'verdict: recommend')
    expect(parseAudit(md).errors.join(' ')).toMatch(/does not match the tests/)
  })

  it('errors on a FAIL that is not Reject, and accepts Reject', () => {
    const asFail = swap(
      '  - { test: Military ties,     result: pass,',
      '  - { test: Military ties,     result: fail,',
    ).replace('### 4. Military and security state — PASS', '### 4. Military and security state — FAIL')
    expect(parseAudit(asFail).errors.join(' ')).toMatch(/does not match the tests \(they allow: Reject\)/)
    const rejected = asFail.replace('verdict: recommend-with-caveats', 'verdict: reject')
    expect(parseAudit(rejected).errors).toEqual([])
    expect(parseAudit(rejected).audit.verdict).toBe('reject')
  })

  it('requires not-recommended-unverified when a test is UNVERIFIED', () => {
    const md = swap(
      '  - { test: Privacy model,     result: pass,',
      '  - { test: Privacy model,     result: unverified,',
    ).replace('### 3. Privacy and business model — PASS', '### 3. Privacy and business model — UNVERIFIED')
    expect(parseAudit(md).errors.join(' ')).toMatch(/does not match the tests/)
    const ok = md.replace('verdict: recommend-with-caveats', 'verdict: not-recommended-unverified')
    const r = parseAudit(ok)
    expect(r.errors).toEqual([])
    expect(r.audit.verdict).toBe('notRecommended')
    expect(r.audit.unverified).toBe(true)
  })

  it('errors when the body and the YAML block disagree on a result', () => {
    const md = swap('### 3. Privacy and business model — PASS', '### 3. Privacy and business model — FLAG')
    expect(parseAudit(md).errors.join(' ')).toMatch(/Test 3: the body says FLAG but the YAML block says PASS/)
  })

  it('errors on an unknown verdict, a missing date, or a missing test', () => {
    expect(parseAudit(swap('verdict: recommend-with-caveats', 'verdict: pretty-good')).errors.join(' ')).toMatch(/not one of/)
    expect(parseAudit(swap('checked: 2026-10-17', 'checked: soon')).errors.join(' ')).toMatch(/`checked`/)
    const fewer = fixture.replace(/  - \{ test: Right to leave.*\n/, '')
    expect(parseAudit(fewer).errors.join(' ')).toMatch(/needs exactly 6 tests/)
  })

  it('warns (without erroring) on count mismatches and citation gaps', () => {
    const tallyOff = parseAudit(swap('tally: { pass: 4,', 'tally: { pass: 5,'))
    expect(tallyOff.errors).toEqual([])
    expect(tallyOff.warnings.join(' ')).toMatch(/tally\.pass says 5 but the tests show 4/)

    const srcOff = parseAudit(swap('primary: 4,', 'primary: 3,'))
    expect(srcOff.warnings.join(' ')).toMatch(/sources\.primary says 3 but the sources table gives 4/)

    const unknownCite = parseAudit(swap('with no Big Tech shareholder [S1]', 'with no Big Tech shareholder [S9]'))
    expect(unknownCite.warnings.join(' ')).toMatch(/S9 is cited but is not in the sources table/)

    const uncited = parseAudit(
      swap(
        '| S5 | [Independent security review]',
        '| S6 | [Unused source](https://example.com/unused) | Example | Company | No date shown | In full | Confirmed |\n| S5 | [Independent security review]',
      ),
    )
    expect(uncited.warnings.join(' ')).toMatch(/S6 is in the sources table but never cited/)
  })

  it('warns when the audit is not publication-ready, or the disclaimer placeholder is left in', () => {
    const notReady = parseAudit(
      swap('publication_ready: true', 'publication_ready: false').replace(
        'blocking: []',
        'blocking: ["Right of reply not yet sent"]',
      ),
    )
    expect(notReady.errors).toEqual([])
    expect(notReady.warnings.join(' ')).toMatch(/publication_ready.*false/)
    expect(notReady.warnings.join(' ')).toMatch(/Blocking: Right of reply not yet sent/)

    const placeholder = parseAudit(swap('contact corrections@example.com', 'contact [CORRECTIONS CONTACT]'))
    expect(placeholder.warnings.join(' ')).toMatch(/CORRECTIONS CONTACT/)
  })
})

describe('verdict rule', () => {
  const row = (key: any, result: any) => ({ key, result })
  const base = [
    row('independence', 'pass'),
    row('usReach', 'pass'),
    row('privacy', 'pass'),
    row('military', 'pass'),
    row('law', 'pass'),
    row('rightToLeave', 'pass'),
  ]
  const set = (key: string, result: string) => base.map((c) => (c.key === key ? row(key, result) : c))

  it('maps the tests to the tiers they allow', () => {
    expect(allowedVerdicts(base)).toEqual(['recommend'])
    expect(allowedVerdicts(set('law', 'flag'))).toEqual(['recommendWithCaveats'])
    expect(allowedVerdicts(set('military', 'flag'))).toEqual(['recommendWithCaveats', 'notRecommended'])
    expect(allowedVerdicts(set('usReach', 'flag'))).toEqual(['recommendWithCaveats', 'notRecommended'])
    expect(allowedVerdicts(base.map((c) => row(c.key, 'flag')))).toEqual(['notRecommended'])
    expect(allowedVerdicts(set('privacy', 'fail'))).toEqual(['reject'])
    expect(allowedVerdicts(set('privacy', 'unverified'))).toEqual(['notRecommended'])
    // A FAIL outranks an UNVERIFIED
    expect(allowedVerdicts(set('privacy', 'fail').map((c) => (c.key === 'law' ? row('law', 'unverified') : c)))).toEqual(['reject'])
  })

  it('tallies, flags unverified, and knows what meets the standard', () => {
    expect(tally(base)).toEqual({ fail: 0, flag: 0, pass: 6, unverified: 0 })
    expect(isUnverified(set('law', 'unverified'))).toBe(true)
    expect(isUnverified(set('law', 'pass'))).toBe(false)
    expect(meetsStandard('recommend')).toBe(true)
    expect(meetsStandard('recommendWithCaveats')).toBe(true)
    expect(meetsStandard('notRecommended')).toBe(false)
    expect(meetsStandard('reject')).toBe(false)
  })

  it('maps the skill’s verdict values', () => {
    expect(verdictFromSlug('recommend')).toEqual({ unverified: false, verdict: 'recommend' })
    expect(verdictFromSlug('not-recommended-unverified')).toEqual({ unverified: true, verdict: 'notRecommended' })
    expect(verdictFromSlug('nope').verdict).toBeNull()
  })
})
