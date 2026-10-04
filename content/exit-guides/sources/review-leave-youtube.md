# Review — Leave YouTube

Reviewed: 2026-09-20 · Verdict: HOLD
Scope: the alternative 01 swap (FreeTube → CuriosityStream) and every field it touched.
Not for publication.

## Verdict

The swap is sound and the page is now accurate, but it cannot ship yet for two
reasons — one old, one new. The old one is `subject.users`, still carrying the
literal string "TK — Verify Before Publishing". The new one is an editorial call
no reviewer can make: **the two alternatives on this page now share a
shareholder**, because CuriosityStream owns 16.875% of Nebula and sells a bundle
that includes it.

Validation caught one false claim in the draft. It said neither alternative
sells advertising. CuriosityStream does — Curiosity Now is a free ad-supported
channel running on Prime Video, Samsung, Vizio, Fubo, DirecTV, Xfinity, Xumo
Play and Truth+. The paid subscription is genuinely ad-free; the company is not.
That has been fixed in four fields.

Removing FreeTube was the right call on its own terms and it also removes the
only real legal exposure the page had.

## Findings

| ID | Field | Severity | Finding | Fix |
|---|---|---|---|---|
| V1 | `alternatives.intro` | STOP | Draft said "Neither sells advertising." False. CuriosityStream runs Curiosity Now, a free ad-supported channel across eight platforms. | **Applied** — now "Neither runs ads in the part you pay for". |
| V2 | `alternative.01.blurb` | FIX | "no advertising anywhere in it" — an absolute, and wrong at company level. | **Applied** — "no advertising in the subscription". |
| V3 | `alternative.01.funding` | FIX | Named subscriptions and licensing but omitted advertising, which is a real revenue line. | **Applied** — advertising named. |
| V4 | `alternative.01.price` | FIX | "No free tier" reads as an error to any reader who finds Curiosity Now free on Prime Video. | **Applied** — the free ad-supported channel is disclosed. |
| V5 | `subject.users` | STOP | Still the literal placeholder "TK — Verify Before Publishing". Pre-existing; the ledger lists it as one of four issues carrying a TK. | Pull from Alphabet's own disclosure. Cannot be fixed in review. |
| V6 | `alternative.01` + `.02` | FIX (editorial) | The two alternatives are not independent. CuriosityStream holds 16.875% of Nebula (10-Q, 30 June 2026) and its $9.99 bundle includes Nebula outright. `criteria.md` asks for two alternatives "genuinely different from each other". | Disclosed in both catches, which is the minimum. **The editor decides whether slot two becomes an unrelated third party.** |
| V7 | `alternative.01.price` | CHECK | $4.99/$39.99 corroborated three ways with no 2026 increase found, but never confirmed against curiositystream.com, which is JavaScript-rendered and would not fetch. A discounted lifetime subscription ($149.99, list $399.99) is what many readers will see first. | Confirm on the site. |
| V8 | `alternative.02.price` | CHECK | "Around $6 a month, or $60 a year" is carried from issue 018 and was last reviewed October 2025. Never confirmed on nebula.tv. Pre-existing. | Confirm on nebula.tv. |
| V9 | whole page | CHECK | `referralUrl` is required by the Payload schema, and the markdown importer never sets it — so this post imports as a draft, and any FreeTube URL on the existing record is not what the new copy describes. | Set `https://curiositystream.com/` on alternative 01 in the admin panel. |
| V10 | `alternative.01.difficulty` | POLISH | Both alternatives now read "1 — Easy", so the meter gives the reader no signal. Defensible — both are just sign-ups, and the importer maps both to 2/5 regardless of the ordinal — but nothing distinguishes them. | Optional: rate Nebula 2, or let the catch carry the difficulty. |
| V11 | `alternative.01.catch` | STOP (avoided) | Trade coverage widely reports CuriosityStream licenses to "nine LLMs, including Google Gemini". **The CEO's own transcript names no partner and neither do the SEC filings.** It would have been the sharpest line available — leaving a Google product for a Google supplier. | **Not printed.** Cut and logged in the ledger's dropped list. |

## Fact check

| Field | Claim as printed | Status | Evidence | Note |
|---|---|---|---|---|
| `alternative.01.ownership` | CuriosityStream Inc., NASDAQ CURI, founded by John Hendricks of Discovery | Confirmed | Company boilerplate, Sept 2025: "CuriosityStream Inc. is the entertainment brand for people who want to know more" (Nasdaq: CURI) | Marketing increasingly says just "Curiosity"; the SEC filer name is unchanged. |
| `alternative.01.jurisdiction` | US, Maryland company, CLOUD Act | Confirmed | Silver Spring, MD; SEC filer CIK 0001776909 | Five Eyes is a disclosed catch, not a gate. |
| `alternative.01.funding` | Licensing out-earns subscriptions since early 2026 | Confirmed | Form 10-Q, Q2 2026: licensing $14,059k (61%) v subscription $8,869k (38%); H1 52% v 46% | Primary source, unarguable. |
| `alternative.01.catch` | Sells footage to companies training AI models | Confirmed | Same 10-Q: "...for sublicensing to technology companies to train artificial intelligence (AI) models" | The company's own words. |
| `alternative.01.catch` | None of your channels are there, nothing imports | Unsupported (by construction) | No YouTube integration and no importer exists | Proving an absence. Must be revisited if an importer ships. |
| `alternative.01.price` | $4.99/mo, $39.99/yr | Confirmed-but-undated | Three independent sources; rose from $2.99/$19.99 in 2022, no later rise found | Never confirmed on the company's own page — see V7. |
| `alternative.01` ad-free | No advertising in the subscription | Confirmed | "The service is ad-free regardless of which plan you select" | Scoped to the subscription after V1/V2. |
| Company advertising | Curiosity Now is free and ad-supported | Confirmed | Company press release, 16 Sept 2025 | This is what contradicted the draft. |
| `alternative.02.ownership` | CuriosityStream holds 16.875% | Confirmed | Form 10-Q: "bringing its total ownership interest in Nebula to 16.875% as of June 30, 2026" | Stake opened 2021 at 12%; board seat removed Dec 2023; bundle unbundled 2024. |
| Hard gate 1 | No Big Five controlling stake | Confirmed | Insiders ~31%, Hendricks ~22% (largest), institutions ~12%, rest retail | Gate re-run because the slot changed hands. |
| `subject.users` | TK | Contradicted by its own placeholder | — | See V5. |

## Legal

**V11 — "including Google Gemini" (cut).** The risk was not defamation, it was
being wrong in public about a named third party's commercial relationships,
sourced to a paraphrase of an interview. The documentary standard in
`SKILL.md` covers exactly this: on-record statements qualify, trade summaries of
them do not. Cut entirely rather than hedged, because a hedge ("reportedly",
"among them said to be") carries the same imputation and the same correction.

**The FreeTube removal.** The instruction was a positioning decision, and it is
also the correct legal read. Recommending a tool that retrieves video outside
YouTube's terms put the page closest to inducement of a terms breach of anything
in the archive, and it sat awkwardly against a series that argues for paying
people fairly. Nothing in the research contradicts the call, and the page is
less exposed without it.

**The AI-licensing line, as printed.** Sourced to the company's own 10-Q and
stated flatly, with no imputation of wrongdoing. This is the safest kind of
sentence available: a documented fact, in the company's own words, left for the
reader to judge. No change needed.

**Not printed, deliberately: CuriosityStream's ad-network sharing.** Its privacy
policy says it works with "advertising and analytics partners, ad networks, and
social media sites", that these "may be considered a 'sale' or 'sharing' under
some U.S. laws, even when no money exchanges hands", and that what may be shared
includes "online activity information ... and other personal information or
sensitive personal information". Sourced and quotable — but it describes
marketing the service, not profiling what you watch inside it, and printing it
beside YouTube's age-inference model would imply an equivalence the evidence
does not support. Logged in the ledger for any future re-ranking of this slot.

No claim on the page needs a lawyer before publication.

## Copy and structure

Template compliance: **clean.** Three reasons, two alternatives, five steps,
four archive links, exactly one `<em>` in each block that takes one, every field
label unchanged and in order. All thirteen length-limited fields are inside
their bounds:

| Field | Chars | Limit |
|---|---|---|
| `hero.standfirst` | 129 | 120–180 |
| `subject.statement` | 167 | 140–220 |
| `alternatives.intro` | 183 | 100–200 |
| `alternative.01.blurb` | 232 | 160–280 |
| `alternative.02.blurb` | 192 | 160–280 |
| `reason.01–03.body` | 206 / 188 / 191 | 140–260 |
| `exitRoute.01–05.body` | 137 / 138 / 142 / 153 / 120 | 90–180 |

Verified against the importer with `--dry-run`: the file parses, both
alternatives resolve, `1 — Easy` maps correctly to the schema's 2/5 (the
importer reads the label word, not the ordinal). The post imports as a draft,
which is expected for every markdown-sourced guide — see V9.

Two notes, neither a breach:

- `references/template.md` specifies `subject.released`, but this page and all
  fifteen others use `subject.jurisdiction`, which is what the importer maps.
  The template doc is the thing that is out of date, not the page.
- The template asks for one `<em>` per block, but the importer strips emphasis
  from everything except `hero.standfirst` and `subject.statement`. The markup
  is harmless and consistent with the rest of the series.

Three fields needed rewriting because they had been written around FreeTube and
quietly became false when it left:

- `exitRoute.03.body` claimed "every alternative player can import it" —
  untrue of both remaining alternatives, which was the single most likely thing
  to strand a reader at step three.
- `exitRoute.04.body` ended "Watching without ads while paying nobody is not a
  principled position", a line aimed squarely at FreeTube's ad-blocking. With
  both alternatives now paid, the jab had no target.
- `exitRoute.05.body` said "a different player", which no longer describes
  anything on the page.

One line worth keeping as written: **`alternative.01.catch`.** It opens by
saying the recommendation is not a replacement for the thing the reader is
leaving, which is a genuinely uncomfortable thing for a first slot to admit, and
it is the reason the rest of the page can be trusted.

## Ledger deltas

Already applied to `sources-youtube.md` — listed here so the change is
reviewable:

- **Replaced** five FreeTube rows with nine CuriosityStream rows (ownership,
  jurisdiction, blurb, funding, catch, catch-scale, price, no-import, plus the
  Nebula stake row).
- **Added** four validation rows: the Curiosity Now ad-supported finding, the
  free-channel price note, the hard-gate-1 ownership re-run, and the legal-name
  check.
- **Replaced** "A note on the FreeTube catch" with "A note on replacing FreeTube
  with CuriosityStream", recording that this is not a like-for-like swap and why.
- **Added** to the dropped list: the Gemini claim, and CuriosityStream's
  ad-network sharing.
- **Amended** weak-link item 3 (FreeTube licence → CuriosityStream price) and
  the goes-stale section (FreeTube viability → revenue mix, price, Nebula stake,
  advertising).

## Needs a human

1. **V6 — the shared shareholder.** Two alternatives, one of which owns a sixth
   of the other and sells a bundle containing it. Disclosed on the page, but
   whether that is enough is an editorial judgement. The clean fix is an
   unrelated third party in one slot.
2. **V5 — `subject.users`.** Still TK. Pull from Alphabet's disclosure.
3. **V7 / V8 — both prices.** Neither has been confirmed on the company's own
   site; CuriosityStream's would not fetch, and Nebula's is carried from issue
   018.
4. **V9 — `referralUrl`.** Set `https://curiositystream.com/` on alternative 01
   in the admin panel. The importer cannot do it, and the post stays a draft
   until it is set.
5. **Slot order.** CuriosityStream now holds "Recommended First Move", but
   Nebula is the one with actual YouTube creators on it. Worth considering
   whether it should lead.
