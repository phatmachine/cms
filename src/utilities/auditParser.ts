import matter from 'gray-matter'

import {
  allowedVerdicts,
  CRITERIA,
  type CriterionKey,
  type CriterionResult,
  RESULTS,
  tally,
  VERDICT_LABEL,
  type Verdict,
  verdictFromSlug,
} from './audit'

/**
 * Parses the audit file written by the `rtm-sovereignty-audit` skill (its "The audit
 * file" section): a YAML summary block, then the body (summary, the six tests with
 * [S#] citations, strongest case against, …, a sources table, the disclaimer) into
 * structured data for a Post. Deterministic: no model is involved, so the same file
 * always produces the same post, and a file that doesn't match the format fails loudly
 * rather than importing something half-right.
 *
 * `errors` block an import. `warnings` don't, but they block --publish (the skill's own
 * `publication_ready` and `blocking` fields block it too).
 */

export type AuditSource = {
  howRead: string
  label: string
  publisher: string
  published: string
  sid: string
  status: string
  type: string
  url: string
}

export type ParsedTest = {
  finding: string
  headline: string
  key: CriterionKey
  readerCanDo: string
  result: CriterionResult
}

export type ParsedAudit = {
  alternativeTo: string[]
  blocking: string[]
  checkedAt: null | string
  companySays: string
  country: string
  disclaimer: string
  integrityRecord: string
  notesForReaders: string
  operator: string
  publicationReady: boolean
  recheckBy: null | string
  rightOfReply: string
  scope: string
  serviceCategory: string
  serviceDescriptor: string
  serviceName: string
  sourceStats: null | {
    needsConfirmation: number
    partial: number
    primary: number
    readInFull: number
    rtmResearch: number
    singleSource: number
    total: number
  }
  sources: AuditSource[]
  strongestCaseAgainst: string
  summary: string
  takeaway: string
  tests: ParsedTest[]
  unverified: boolean
  verdict: null | Verdict
  version: null | number
  whatWouldChange: string
}

export type ParseResult = { audit: ParsedAudit; errors: string[]; warnings: string[] }

const MONTHS: Record<string, number> = {
  apr: 4, april: 4, aug: 8, august: 8, dec: 12, december: 12, feb: 2, february: 2,
  jan: 1, january: 1, jul: 7, july: 7, jun: 6, june: 6, mar: 3, march: 3, may: 5,
  nov: 11, november: 11, oct: 10, october: 10, sep: 9, sept: 9, september: 9,
}

const pad = (n: number) => String(n).padStart(2, '0')

function isoDate(y: number, m: number, d: number): null | string {
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (dt.getUTCMonth() !== m - 1) return null
  return `${y}-${pad(m)}-${pad(d)}`
}

/** "2026-10-17", "17 October 2026", "17 Oct 2026", "October 17, 2026" -> "2026-10-17". */
export function parseDate(text: string): null | string {
  const s = text.replace(/\*\*/g, '').trim()
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (m) return isoDate(+m[1], +m[2], +m[3])
  m = s.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\.?,?\s+(\d{4})/)
  if (m && MONTHS[m[2].toLowerCase()]) return isoDate(+m[3], MONTHS[m[2].toLowerCase()], +m[1])
  m = s.match(/([A-Za-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/)
  if (m && MONTHS[m[1].toLowerCase()]) return isoDate(+m[3], MONTHS[m[1].toLowerCase()], +m[2])
  return null
}

// YAML parses an unquoted 2026-10-17 into a Date, a quoted one stays a string.
function fmDate(v: unknown): null | string {
  if (v instanceof Date) return isoDate(v.getUTCFullYear(), v.getUTCMonth() + 1, v.getUTCDate())
  if (typeof v === 'string') return parseDate(v)
  return null
}

export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

// Text for textarea fields. Links become their text, emphasis marks go, bullets keep a
// marker, blockquote and table-cell markup goes. [S#] citations are kept as written.
function block(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) =>
      line
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/^\s*>\s?/, '')
        .replace(/^\s*[-*]\s+/, '• ')
        .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1')
        .replace(/\*\*|__|`/g, '')
        .replace(/(^|\s)\*(\S[^*]*?)\*(?=\s|$)/g, '$1$2')
        .replace(/[ \t]+/g, ' ')
        .trim(),
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// One paragraph per blank-line-separated chunk, single newlines folded into spaces.
function paragraphs(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => block(p.replace(/\n/g, ' ')))
    .filter(Boolean)
    .join('\n\n')
}

function splitRow(line: string): string[] {
  const t = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return t.split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, '|').trim())
}

const isSeparator = (cells: string[]) => cells.every((c) => /^:?-{2,}:?$/.test(c.trim()))

function testKey(name: string): CriterionKey | null {
  const l = name.toLowerCase()
  if (/independen/.test(l)) return 'independence'
  if (/\bus\b|reach|jurisdiction/.test(l)) return 'usReach'
  if (/privacy/.test(l)) return 'privacy'
  if (/military|security/.test(l)) return 'military'
  if (/\blaw\b|legal|rights/.test(l)) return 'law'
  if (/leave|sovereign/.test(l)) return 'rightToLeave'
  return null
}

const asResult = (v: unknown): CriterionResult | null => {
  const s = String(v ?? '').trim().toLowerCase()
  return (RESULTS as readonly string[]).includes(s) ? (s as CriterionResult) : null
}

const num = (v: unknown): null | number =>
  typeof v === 'number' && Number.isFinite(v) ? v : null

// Splits "## Heading" sections. Keys are lower-cased headings with any trailing
// parenthetical note dropped ("Notes for readers (practical steps…)" -> "notes for readers").
function sections(body: string): { head: string; rest: Map<string, string> } {
  const parts = body.split(/^## +/m)
  const rest = new Map<string, string>()
  for (const part of parts.slice(1)) {
    const nl = part.indexOf('\n')
    const title = (nl === -1 ? part : part.slice(0, nl)).replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()
    rest.set(title, nl === -1 ? '' : part.slice(nl + 1))
  }
  return { head: parts[0], rest }
}

const CITE = /\[(S\d+(?:\s*,\s*S\d+)*)\]/g
const citedIds = (text: string) => [...text.matchAll(CITE)].flatMap((m) => m[1].split(/\s*,\s*/))

const PRIMARY_TYPES = /^(company|regulator or court|government|registry)$/i

export function parseAudit(markdown: string): ParseResult {
  const errors: string[] = []
  const warnings: string[] = []

  const audit: ParsedAudit = {
    alternativeTo: [],
    blocking: [],
    checkedAt: null,
    companySays: '',
    country: '',
    disclaimer: '',
    integrityRecord: '',
    notesForReaders: '',
    operator: '',
    publicationReady: false,
    recheckBy: null,
    rightOfReply: '',
    scope: '',
    serviceCategory: '',
    serviceDescriptor: '',
    serviceName: '',
    sourceStats: null,
    sources: [],
    strongestCaseAgainst: '',
    summary: '',
    takeaway: '',
    tests: [],
    unverified: false,
    verdict: null,
    version: null,
    whatWouldChange: '',
  }

  // --- The YAML summary block
  let fm: Record<string, unknown> = {}
  let body = ''
  try {
    const parsed = matter(markdown.replace(/\r\n/g, '\n'))
    fm = parsed.data
    body = parsed.content
  } catch (e) {
    errors.push(`The YAML summary block could not be read: ${(e as Error).message.split('\n')[0]}`)
    return { audit, errors, warnings }
  }
  if (fm.audit !== 'rtm-sovereignty-audit') {
    errors.push('Not an audit file: the YAML block must start with `audit: rtm-sovereignty-audit`.')
    return { audit, errors, warnings }
  }

  const service = String(fm.service ?? '').trim()
  const paren = service.match(/^(.*?)\s*\(([^()]+)\)\s*$/)
  audit.serviceName = (paren ? paren[1] : service).trim()
  audit.serviceDescriptor = paren ? paren[2].trim() : ''
  if (!audit.serviceName) errors.push('`service` is missing from the YAML block.')
  audit.operator = String(fm.operator ?? '').trim()
  audit.country = String(fm.country ?? '').trim()
  audit.serviceCategory = String(fm.category ?? '').trim()
  audit.alternativeTo = Array.isArray(fm.alternative_to)
    ? fm.alternative_to.map((a) => String(a).trim()).filter(Boolean)
    : []
  audit.version = num(fm.version)
  audit.takeaway = String(fm.takeaway ?? '').trim()
  audit.rightOfReply = String(fm.right_of_reply ?? '').trim()
  audit.publicationReady = fm.publication_ready === true
  audit.blocking = Array.isArray(fm.blocking) ? fm.blocking.map((b) => String(b)) : []

  const v = verdictFromSlug(String(fm.verdict ?? ''))
  audit.verdict = v.verdict
  audit.unverified = v.unverified
  if (!audit.verdict) {
    errors.push(
      `verdict "${String(fm.verdict ?? '')}" is not one of recommend | recommend-with-caveats | not-recommended | not-recommended-unverified | reject.`,
    )
  }

  audit.checkedAt = fmDate(fm.checked)
  audit.recheckBy = fmDate(fm.recheck_by)
  if (!audit.checkedAt) errors.push('`checked` is missing or not a recognisable date.')
  if (!audit.recheckBy) errors.push('`recheck_by` is missing or not a recognisable date.')
  if (audit.checkedAt && audit.recheckBy) {
    if (audit.recheckBy <= audit.checkedAt) errors.push('`recheck_by` is not after `checked`.')
    else {
      const limit = new Date(audit.checkedAt + 'T00:00:00Z')
      limit.setUTCMonth(limit.getUTCMonth() + 6)
      limit.setUTCDate(limit.getUTCDate() + 7)
      if (new Date(audit.recheckBy + 'T00:00:00Z') > limit) {
        warnings.push('`recheck_by` is more than six months after `checked`; verdicts expire after six.')
      }
    }
  }

  if (!audit.takeaway) warnings.push('`takeaway` is missing from the YAML block.')
  else if (words(audit.takeaway) > 12) warnings.push('`takeaway` is longer than twelve words.')

  // --- The six tests in the YAML block (what the scorecard is built from)
  const rawTests = Array.isArray(fm.tests) ? (fm.tests as Record<string, unknown>[]) : []
  if (rawTests.length !== CRITERIA.length) {
    errors.push(`The YAML block needs exactly ${CRITERIA.length} tests; it has ${rawTests.length}.`)
  }
  const seen = new Set<CriterionKey>()
  rawTests.forEach((t, i) => {
    const name = String(t.test ?? '')
    const key = testKey(name) ?? CRITERIA[i]?.key
    const result = asResult(t.result)
    if (!key) return void errors.push(`Test "${name}" could not be matched to one of the six tests.`)
    if (!result) return void errors.push(`Test "${name}" has result "${String(t.result)}"; expected pass | flag | fail | unverified.`)
    if (seen.has(key)) return void errors.push(`Test "${name}" duplicates another test.`)
    seen.add(key)
    const headline = String(t.headline ?? '').trim()
    if (!headline) warnings.push(`Test "${name}" has no headline.`)
    else if (words(headline) > 6) warnings.push(`Test "${name}" headline is longer than six words.`)
    audit.tests.push({ finding: '', headline, key, readerCanDo: '', result })
  })
  audit.tests.sort(
    (a, b) => CRITERIA.findIndex((c) => c.key === a.key) - CRITERIA.findIndex((c) => c.key === b.key),
  )

  // Tally in the block must agree with the tests (the skill's count check)
  const counted = tally(audit.tests)
  const stated = (fm.tally ?? {}) as Record<string, unknown>
  for (const k of ['pass', 'flag', 'fail', 'unverified'] as const) {
    const s = num(stated[k])
    if (s !== null && s !== counted[k]) {
      warnings.push(`tally.${k} says ${s} but the tests show ${counted[k]}.`)
    }
  }

  // --- The body
  const { head, rest } = sections(body)
  audit.scope = block(head.match(/^\s*Scope:\s*(.+)$/m)?.[1] ?? '')
  audit.summary = paragraphs(rest.get('summary') ?? '')
  if (!audit.summary) warnings.push('No "## Summary" section.')

  const testsText = rest.get('the six tests') ?? ''
  if (!testsText) errors.push('No "## The six tests" section.')
  for (const chunk of testsText.split(/^### +/m).slice(1)) {
    const nl = chunk.indexOf('\n')
    const header = (nl === -1 ? chunk : chunk.slice(0, nl)).trim()
    const text = nl === -1 ? '' : chunk.slice(nl + 1)
    const n = Number(header.match(/^(\d)\s*[.)]/)?.[1])
    const headerResult = asResult(header.match(/(pass|flag|fail|unverified)\s*$/i)?.[1])
    const test = audit.tests[n - 1]
    if (!test) {
      warnings.push(`Test section "${header}" does not match a test in the YAML block; skipped.`)
      continue
    }
    if (headerResult && headerResult !== test.result) {
      errors.push(`Test ${n}: the body says ${headerResult.toUpperCase()} but the YAML block says ${test.result.toUpperCase()}.`)
    }
    const m = text.match(/\*\*\s*What a reader can do\s*:?\s*\*\*\s*:?/i)
    const finding = m ? text.slice(0, m.index) : text
    const can = m ? text.slice((m.index ?? 0) + m[0].length) : ''
    test.finding = paragraphs(finding)
    test.readerCanDo = block(can)
    if (!test.finding) warnings.push(`Test ${n} has no finding text.`)
    else if (citedIds(test.finding).length === 0) warnings.push(`Test ${n}'s finding cites no source.`)
  }

  audit.strongestCaseAgainst = paragraphs(rest.get('strongest case against') ?? '')
  audit.companySays = paragraphs(rest.get('what the company says') ?? '')
  audit.notesForReaders = block(rest.get('notes for readers') ?? '')
  audit.whatWouldChange = paragraphs(rest.get('what would change this verdict') ?? '')
  audit.integrityRecord = block(rest.get('integrity record') ?? '')
  audit.disclaimer = block(rest.get('disclaimer') ?? '')
  if (!audit.strongestCaseAgainst) warnings.push('No "## Strongest case against" section.')
  if (!audit.whatWouldChange) warnings.push('No "## What would change this verdict" section.')
  if (!audit.disclaimer) warnings.push('No "## Disclaimer" section (it must be verbatim at the end of every audit).')
  else if (/\[CORRECTIONS CONTACT\]/i.test(audit.disclaimer)) {
    warnings.push('The disclaimer still has the [CORRECTIONS CONTACT] placeholder.')
  }

  // --- Sources table
  const lines = (rest.get('sources') ?? '').split('\n')
  const headerIdx = lines.findIndex((l) => /^\s*\|/.test(l) && /\bid\b/i.test(l) && /source/i.test(l))
  if (headerIdx === -1) errors.push('No sources table found under "## Sources".')
  else {
    const cols = splitRow(lines[headerIdx]).map((c) => c.toLowerCase())
    const at = (name: RegExp) => cols.findIndex((c) => name.test(c))
    const idx = {
      howRead: at(/how read/),
      id: at(/^id$/),
      published: at(/published/),
      publisher: at(/publisher/),
      source: at(/^source/),
      status: at(/status/),
      type: at(/^type/),
    }
    for (let i = headerIdx + 1; i < lines.length && /^\s*\|/.test(lines[i]); i++) {
      const cells = splitRow(lines[i])
      if (isSeparator(cells)) continue
      const get = (j: number) => (j >= 0 ? (cells[j] ?? '') : '')
      const sid = block(get(idx.id)).toUpperCase()
      if (!/^S\d+$/.test(sid)) {
        warnings.push(`Sources row "${sid}" has no S# id; skipped.`)
        continue
      }
      const sourceCell = get(idx.source)
      const link = sourceCell.match(/\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/)
      const bare = sourceCell.match(/https?:\/\/[^\s)|<>\]]+/)
      audit.sources.push({
        howRead: block(get(idx.howRead)),
        label: block(sourceCell) || sid,
        publisher: block(get(idx.publisher)),
        published: block(get(idx.published)),
        sid,
        status: block(get(idx.status)),
        type: block(get(idx.type)),
        url: (link?.[2] ?? bare?.[0] ?? '').replace(/[.,;]+$/, ''),
      })
    }
    if (audit.sources.length === 0) errors.push('The sources table has no rows.')
    for (const s of audit.sources) {
      if (!s.url) warnings.push(`Source ${s.sid} has no URL.`)
      if (!s.published) warnings.push(`Source ${s.sid} has no published date (write "No date shown").`)
    }
  }

  // --- Citations: every cited id exists, every source is cited
  const bodyText = [
    audit.summary,
    ...audit.tests.flatMap((t) => [t.finding, t.readerCanDo]),
    audit.strongestCaseAgainst,
    audit.companySays,
    audit.notesForReaders,
    audit.whatWouldChange,
  ].join('\n')
  const cited = new Set(citedIds(bodyText))
  const known = new Set(audit.sources.map((s) => s.sid))
  for (const id of cited) if (!known.has(id)) warnings.push(`${id} is cited but is not in the sources table.`)
  for (const id of known) if (!cited.has(id)) warnings.push(`${id} is in the sources table but never cited.`)

  // --- Source counts in the block must agree with the table (the skill's count check)
  const s = (fm.sources ?? null) as Record<string, unknown> | null
  if (s && typeof s === 'object') {
    audit.sourceStats = {
      needsConfirmation: num(s.needs_confirmation) ?? 0,
      partial: num(s.partial) ?? 0,
      primary: num(s.primary) ?? 0,
      readInFull: num(s.read_in_full) ?? 0,
      rtmResearch: num(s.rtm_research) ?? 0,
      singleSource: num(s.single_source) ?? 0,
      total: num(s.total) ?? 0,
    }
    const count = (f: (x: AuditSource) => boolean) => audit.sources.filter(f).length
    const actual = {
      needsConfirmation: count((x) => /needs confirmation/i.test(x.status)),
      partial: count((x) => /^partial/i.test(x.howRead)),
      primary: count((x) => PRIMARY_TYPES.test(x.type.trim())),
      readInFull: count((x) => /^in full/i.test(x.howRead)),
      rtmResearch: count((x) => /rtm research/i.test(x.type)),
      singleSource: count((x) => /single source/i.test(x.status)),
      total: audit.sources.length,
    }
    for (const k of Object.keys(actual) as (keyof typeof actual)[]) {
      if (audit.sourceStats[k] !== actual[k]) {
        warnings.push(`sources.${k} says ${audit.sourceStats[k]} but the sources table gives ${actual[k]}.`)
      }
    }
  } else warnings.push('The YAML block has no `sources` counts.')

  // --- The tier follows the rule; it is never rounded up
  if (audit.verdict && audit.tests.length === CRITERIA.length) {
    const allowed = allowedVerdicts(audit.tests)
    if (!allowed.includes(audit.verdict)) {
      errors.push(
        `Verdict "${VERDICT_LABEL[audit.verdict]}" does not match the tests (they allow: ${allowed.map((x) => VERDICT_LABEL[x]).join(' / ')}). The rule is applied mechanically.`,
      )
    }
    const needsUnverified = audit.tests.some((t) => t.result === 'unverified') && !audit.tests.some((t) => t.result === 'fail')
    if (needsUnverified && !audit.unverified) {
      errors.push('A test is UNVERIFIED, so the verdict must be not-recommended-unverified.')
    }
    if (audit.unverified && !needsUnverified) {
      warnings.push('Verdict is not-recommended-unverified but no test is UNVERIFIED.')
    }
  }

  if (audit.verdict === 'recommendWithCaveats' && !audit.tests.some((t) => t.readerCanDo)) {
    warnings.push('Recommend with caveats, but no test has a "What a reader can do" mitigation.')
  }

  // --- The skill's own gate
  if (!audit.publicationReady) warnings.push('`publication_ready` is false.')
  for (const b of audit.blocking) warnings.push(`Blocking: ${b}`)
  if (!audit.rightOfReply) warnings.push('`right_of_reply` is missing from the YAML block.')

  return { audit, errors, warnings }
}
