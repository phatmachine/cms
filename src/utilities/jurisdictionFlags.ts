import { hasFlag } from 'country-flag-icons'

/**
 * Turns a free-text jurisdiction ("USA", "Luxembourg", "China / Ireland",
 * "European Union") into tokens the UI can put a flag beside. Jurisdiction is
 * an author-typed string, not a country picker, so this is deliberately
 * forgiving — and an unrecognised value is never an error: it just gets no
 * flag and renders as plain text.
 */

export type JurisdictionToken =
  | { separator: string }
  | { code: null | string; text: string }

// Names people type that aren't the CLDR English name Intl.DisplayNames
// returns (or that are ambiguous abbreviations).
const ALIASES: Record<string, string> = {
  america: 'US',
  britain: 'GB',
  'czech republic': 'CZ',
  eu: 'EU',
  'great britain': 'GB',
  holland: 'NL',
  'hong kong': 'HK',
  macau: 'MO',
  palestine: 'PS',
  turkey: 'TR',
  uae: 'AE',
  uk: 'GB',
  'united states of america': 'US',
  us: 'US',
  usa: 'US',
}

const normalise = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // strip diacritics: "Côte d'Ivoire" -> "Cote d'Ivoire"
    .toLowerCase()
    .replace(/\./g, '') // "U.S.A." -> "usa"
    .replace(/\s*&\s*/g, ' and ') // CLDR says "Trinidad & Tobago"; people type "and"
    .replace(/^the\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()

// English country name -> ISO 3166-1 alpha-2, built once from the runtime's
// own CLDR data rather than a hand-maintained table that would go stale.
let byName: Map<string, string> | undefined
const nameToCode = (): Map<string, string> => {
  if (byName) return byName
  byName = new Map()
  const names = new Intl.DisplayNames(['en'], { type: 'region' })
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b)
      // The data also holds reserved/legacy codes that reuse a real country's
      // name (UK -> "United Kingdom", FX -> "France"). Without this they
      // overwrite the real entry and the lookup ends up on a code with no flag.
      if (!hasFlag(code)) continue
      let name: string | undefined
      try {
        name = names.of(code)
      } catch {
        continue
      }
      if (name && name !== code && name !== 'Unknown Region') byName.set(normalise(name), code)
    }
  }
  return byName
}

/** ISO code for a single country/territory name, or null if it has no flag. */
export const resolveFlagCode = (text: string): null | string => {
  const key = normalise(text)
  if (!key) return null

  const code =
    ALIASES[key] ??
    nameToCode().get(key) ??
    // A bare two-letter ISO code someone typed directly ("IE").
    (/^[a-z]{2}$/.test(key) ? key.toUpperCase() : null)

  return code && hasFlag(code) ? code : null
}

/** True if at least one country in the value has a flag — lets callers skip
 *  rendering (and any spacing around it) for empty or unrecognised values. */
export const hasJurisdictionFlag = (value: null | string | undefined): boolean =>
  Boolean(value) && tokeniseJurisdiction(value as string).some((t) => 'code' in t && t.code)

type WithSpecs = {
  exitGuide?: {
    subject?: { specs?: { key: string; value: string }[] | null } | null
  } | null
}

/**
 * A post's Jurisdiction spec value ("USA", "China / Ireland"…) — the same
 * field the exit-guide Subject strip shows — or null for a post without one
 * (regular blog posts, or search-index docs which don't carry exit-guide data).
 */
export const getJurisdiction = (doc: null | undefined | WithSpecs): null | string =>
  doc?.exitGuide?.subject?.specs?.find((spec) => /^jurisdiction$/i.test(spec.key))?.value?.trim() ||
  null

// Separators that join several jurisdictions in one value.
const SEPARATOR = /(\s*(?:\/|&|\+|;|,|\band\b)\s*)/i

/**
 * "CHINA / IRELAND" -> [{China, CN}, {separator " / "}, {Ireland, IE}], so each
 * country can carry its own flag. The whole string is tried first, so a single
 * name that happens to contain a separator word ("Trinidad and Tobago") isn't
 * torn apart.
 */
export const tokeniseJurisdiction = (value: string): JurisdictionToken[] => {
  const whole = resolveFlagCode(value)
  if (whole) return [{ code: whole, text: value.trim() }]

  return value
    .split(SEPARATOR)
    .map((part, i): JurisdictionToken =>
      // split() with a capture group puts separators at the odd indexes, so
      // classify by position first and only then drop empty text pieces.
      i % 2 === 1 ? { separator: part } : { code: resolveFlagCode(part), text: part.trim() },
    )
    .filter((token) => 'separator' in token || token.text !== '')
}
