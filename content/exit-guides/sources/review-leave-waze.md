# Review — Leave Waze
Reviewed: 2026-10-09 · Verdict: PUBLISH WITH FIXES

## Verdict
The page rests on Waze's own policy and terms, quoted verbatim, plus a dated acquisition and merger. It makes no claim about government surveillance, because none can be sourced: Snopes rated that claim "Mixture" in July 2026 and no regulator action against Waze's privacy practices turned up. Three things must be closed before publishing: the user count is from December 2022, Magic Earth's price conflicts between its own announcement and the App Store, and Waze announced a 1 August 2026 policy update that may supersede the 8 July text I quoted.

Written by the same session that researched it. The Waze quotations were re-fetched from the live policy and terms pages before drafting. Where a row rests on a search summary or a forum post, the ledger says so.

## Findings
| ID | Field | Severity | Finding | Fix |
|---|---|---|---|---|
| F-01 | subject.users | FIX | "150 Million" traces only to Google's December 2022 figure (151m, via Globes). It is undated on the page and four years old. | Replace with a current Google or Waze figure, or cut the field to a dated one. |
| F-02 | alternative.01.price | FIX | Magic Earth's own July 2025 announcement says €0.99 a year; the US App Store shows a $19.99 premium plan. The page prints the conflict and tells the reader to check, which is honest but unfinished. | Confirm both stores and replace with one line. |
| F-03 | reasons 01–03, subject.statement | FIX | Every Waze quotation is from the text "last modified 8 July 2026". Waze's help page announces a Terms and Privacy update effective 1 August 2026. | Re-read both documents and re-check each quotation. |
| F-04 | alternative.01.catch | CHECK | The "five minutes" and "anonymised" traffic-provider claim comes from a forum summary of Magic Earth's privacy PDF, which returned 404 when fetched. | Find and read the current document. |
| F-05 | alternative.01.ownership | CHECK | App stores say "Magic Lane International BV"; Wikipedia says "Magic Lane Ltd."; no shareholder list was found. Hard gate 4: ownership established at entity level only. | Confirm in the Dutch company register. Editor decision on whether it clears the gate, as with Kinzoo in issue 023. |
| F-06 | subject.owner | CHECK | "Google (Alphabet Inc.)" is correct in substance, but which Google entity holds Waze Mobile Ltd. was not established. | Check Alphabet's subsidiary list if a legal name is wanted. |
| F-07 | subject.model | CHECK | "Location Ads" rests on the policy's advertising summary, not Waze's advertiser pages. | Read Waze Ads' own wording. |
| F-08 | reason.01.body | POLISH | "I found no retention period for it" describes my reading. The policy has a retention section for other data types. A reader who finds one will say the page is wrong. | Search the full policy again before publishing, or soften to "the policy gives no retention period for route history" only if confirmed. |
| F-09 | alternative.02.price | CHECK | "Free" not re-verified on comaps.app. | Check once. |
| F-10 | exitRoute.03.body | CHECK | "Waze has no subscription to cancel" is true to my knowledge but unsourced. | Confirm, or cut the clause. |

## Fact check
| Field | Claim as printed | Status | Evidence | Note |
|---|---|---|---|---|
| reason.01.body | may collect location "even when you are not using the app"; route history of every journey | Confirmed | Waze Privacy Policy, 8 July 2026, verbatim | See F-03 |
| reason.02.body | shares de-identified account settings, location and route data with other Google mapping and navigation products | Confirmed | Same page, verbatim | |
| reason.02.body | Google bought Waze in 2013; folded its team into Google Maps in 2022 | Confirmed | TechCrunch 11 June 2013 ($1.1bn); Globes 8 Dec 2022 | CNN page unavailable |
| reason.03.body | governed solely by Israeli law, Tel Aviv courts | Confirmed | Waze Terms, 8 July 2026, verbatim | |
| reason.03.body | will assist law enforcement where it believes the law requires | Confirmed (paraphrase) | Policy: "good faith belief that ... cooperation ... is legally mandated" | |
| subject.users | 150 Million | Confirmed-but-drifted | Globes, Dec 2022: 151m | F-01 |
| alt.01.blurb | OpenStreetMap-based; live traffic and speed cameras; says it does not track | Confirmed | OSM Wiki; App Store listing | Claim attributed on the page |
| alt.01.catch | closed source; position data to traffic provider five minutes | Closed source confirmed; five minutes unconfirmed | OSM Wiki; forum summary | F-04 |
| alt.02.blurb | free, open source, offline; fork of Organic Maps; no advertising or personal data collection | Confirmed | CoMaps privacy statement, 19 Sept 2026; Wikipedia | Attributed |
| alt.02.catch | no live traffic; first released June 2025; legal structure being formalised | Confirmed | Wikipedia | |
| exitRoute.02.body | waze.com/account > Download your Waze data | Confirmed | Waze Help | |
| exitRoute.05.body | delete under Account and login; unrecoverable | Confirmed | Waze Help | |

## Legal
**The Israel framing.** The page states the controller company, governing law and courts as facts, quoted from Waze's own terms. It does not mention the founders, military service, or any state involvement, and says nothing a reader could take as a claim that the Israeli government accesses user data. That claim is unsourced (Snopes, July 2026: no credible evidence either way; Google denies it), and printing it, hedged or implied, would be the single most reckless thing this page could do. It would also fail the series' rule on government and agency interests, which allows only contracts, statutes, rulings, regulator findings, transparency reports and on-record statements. Reason 03's "two legal systems I did not choose" is first-person opinion resting on two stated facts in the sentence before. Safe in all five markets. A lawyer is not needed for it.

**"Serious privacy concerns."** The concerns the evidence supports are in Waze's own policy: background location, route history, de-identified sharing with Google's mapping products, law-enforcement assistance. There is no regulator fine, finding or investigation of Waze that I could locate. The page does not imply one.

**Fairness.** Waze says it does not sell, rent or lease personal information. That sentence is not on the page and is in the ledger; the page says "shares" and never "sells".

**Alternatives.** No promise about safety or privacy is made in the guide's own voice. Magic Earth's and CoMaps' statements are attributed ("It says", "It states"). The catches are blunt: closed source and traffic-provider data for the first; no live traffic and an unformalised structure for the second. No affiliate relationship: both referral links are plain homepages.

**Named individuals.** None.

## Copy and structure
Template: all labels present and in order; three reasons; two alternatives with the full sub-field set; five steps in the series beats (claim, bring history, move the dashboard in place of "money first" since Waze has no bill, net, close); four archive links; issue number 024. One `<em>` in each block that takes one.

Counts, all within limits: description 135/150, standfirst 140/180, statement 170/220, reason bodies 243, 247 and 252/260, intro 170/200, blurbs 224 and 190/280, exit bodies 145–169/180. All titles are 2–4 words.

Notes: the catch on CoMaps ("the thing Waze does best") is the most honest line on the page. Difficulty ratings are for the reader: Magic Earth 2 (re-enter saved places, same kind of app), CoMaps 3 (lose live traffic, the reason most people use Waze). Step 3 departs from "start with money" because there is no payment to cancel, and says so. Step 5 exports before it deletes, in the right order.

## Ledger deltas
`sources-waze.md` is complete for the page. Dropped items are recorded there, including the Snopes finding, the unproven surveillance claim, the 2016 tracking research, Waze for Cities, the DSA designation and the 1 August 2026 update.

## Needs a human
- **Close F-01 to F-03**, in that order. They change what is printed.
- **Editor decision (gate 4):** Magic Lane's shareholders are not public; the page discloses it. Same as Kinzoo.
- **Media:** a hero image, video and logo are needed before it can publish. `meta.status` is `draft`.
- **No lawyer required** on the page as written. One would be needed if anything is added about government access, the founders, or Waze's police-reporting feature.
