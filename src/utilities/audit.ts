/**
 * Shared vocabulary for "Sovereignty audit" posts (postType: audit). Used by the
 * Payload field config, the markdown importer, and the front-end template, so the six
 * tests, the verdict tiers and the verdict rule live in exactly one place.
 *
 * The rule mirrors the `rtm-sovereignty-audit` skill's verdict table, which says to
 * apply it mechanically. The tier follows the tests; it is never rounded up.
 * See .claude/skills/rtm-audit-post/SKILL.md.
 */

// Order is the order of the skill's "six tests" and of the segments on the scorecard.
export const CRITERIA = [
  { key: 'independence', label: 'Independence', long: 'Independence (non-Big Tech)' },
  { key: 'usReach', label: 'US reach', long: 'US reach' },
  { key: 'privacy', label: 'Privacy model', long: 'Privacy and business model' },
  { key: 'military', label: 'Military ties', long: 'Military and security state' },
  { key: 'law', label: 'Law & user rights', long: 'Law and user rights' },
  { key: 'rightToLeave', label: 'Right to leave', long: 'Right to leave' },
] as const

export type CriterionKey = (typeof CRITERIA)[number]['key']
export type CriterionResult = 'pass' | 'flag' | 'fail' | 'unverified'

export const RESULTS = ['pass', 'flag', 'fail', 'unverified'] as const

export const RESULT_LABEL: Record<CriterionResult, string> = {
  fail: 'Fail',
  flag: 'Flag',
  pass: 'Pass',
  unverified: 'Unverified',
}

// Ordered worst to best: the position is the step on the verdict ladder. The skill's
// fifth value, "not-recommended-unverified", is `notRecommended` plus the `unverified`
// flag, so the ladder keeps four steps.
export const VERDICTS = ['reject', 'notRecommended', 'recommendWithCaveats', 'recommend'] as const
export type Verdict = (typeof VERDICTS)[number]

export const VERDICT_LABEL: Record<Verdict, string> = {
  notRecommended: 'Not recommended',
  recommend: 'Recommend',
  recommendWithCaveats: 'Recommend with caveats',
  reject: 'Reject',
}

// Wording for the "does it meet our standard" line. These describe our own criteria,
// not the service's character.
export const STANDARD_LABEL: Record<Verdict, string> = {
  notRecommended: 'Does not meet our standard',
  recommend: 'Meets our standard',
  recommendWithCaveats: 'Meets our standard, with caveats',
  reject: 'Fails our standard',
}

export const meetsStandard = (v: Verdict): boolean =>
  v === 'recommend' || v === 'recommendWithCaveats'

export type CriterionLike = { key: CriterionKey; result: CriterionResult }

export function tally(criteria: { result: CriterionResult }[]) {
  const count = (r: CriterionResult) => criteria.filter((c) => c.result === r).length
  return { fail: count('fail'), flag: count('flag'), pass: count('pass'), unverified: count('unverified') }
}

/** The skill's front-matter verdict values, mapped onto the stored tier + flag. */
export function verdictFromSlug(slug: string): { unverified: boolean; verdict: null | Verdict } {
  switch (slug.trim().toLowerCase()) {
    case 'recommend':
      return { unverified: false, verdict: 'recommend' }
    case 'recommend-with-caveats':
      return { unverified: false, verdict: 'recommendWithCaveats' }
    case 'not-recommended':
      return { unverified: false, verdict: 'notRecommended' }
    case 'not-recommended-unverified':
      return { unverified: true, verdict: 'notRecommended' }
    case 'reject':
      return { unverified: false, verdict: 'reject' }
    default:
      return { unverified: false, verdict: null }
  }
}

/**
 * The verdict the tests require. The skill's table:
 *  - any FAIL                       -> Reject
 *  - any UNVERIFIED (and no FAIL)   -> Not recommended (unverified)
 *  - four or more FLAGs             -> Not recommended
 *  - a FLAG on test 2 or 4          -> Not recommended if the reader cannot mitigate it,
 *                                      which a table can't judge, so both tiers are allowed
 *  - one to three other FLAGs       -> Recommend with caveats
 *  - all PASS                       -> Recommend
 */
export function allowedVerdicts(criteria: CriterionLike[]): Verdict[] {
  const t = tally(criteria)
  if (t.fail > 0) return ['reject']
  if (t.unverified > 0 || t.flag >= 4) return ['notRecommended']
  if (t.flag > 0) {
    const sensitive = criteria.some(
      (c) => c.result === 'flag' && (c.key === 'usReach' || c.key === 'military'),
    )
    return sensitive ? ['recommendWithCaveats', 'notRecommended'] : ['recommendWithCaveats']
  }
  return ['recommend']
}

/** True when the tests alone make the verdict "not recommended (unverified)". */
export const isUnverified = (criteria: { result: CriterionResult }[]) =>
  criteria.some((c) => c.result === 'unverified') && !criteria.some((c) => c.result === 'fail')
