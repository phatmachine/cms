# Source ledger — Leave Gemini
Researched: 2026-09-13
Not for publication.

Subject is the consumer Gemini app on a personal Google account. Gemini for Workspace and Vertex AI operate under a data processing agreement and a different posture; the page does not describe them, and any future edit must keep that distinction.

| Field | Claim as printed | Source | Published | Checked |
|---|---|---|---|---|
| subject.jurisdiction | USA | Google LLC, Delaware/California. Same divergence as issue 001: Google Ireland Limited contracts with EEA/UK/Swiss users. | — | 2026-09-13 |
| subject.owner | Google LLC (Alphabet Inc.) | https://policies.google.com/terms/information-requests?hl=en-US | current page | 2026-09-13 |
| subject.users | 1 Billion | Sundar Pichai, 11–12 August 2026, announcing the Gemini app passed 1 billion monthly active users. https://www.deccanchronicle.com/technology/googles-gemini-app-surpasses-1-billion-monthly-active-users-1978625 | 2026-08-12 | 2026-09-13 |
| subject.users (caveat) | The count covers people opening the Gemini app or its web interface, and excludes Gemini encounters inside Search and Workspace. Google also auto-routed Assistant queries to Gemini on dual-installed devices from late 2025, which inflates raw counts. | https://www.implicator.ai/google-puts-gemini-at-1-billion-monthly-users-without-naming-paying-subscribers/; routing reported by PPC Land, December 2025 | 2026-08 | 2026-09-13 |
| subject.model | Ad Targeting | Alphabet's advertising-dominant model, as established in issue 001. Gemini itself is sold via AI Plus/Ultra subscriptions ($7.99 and $100 a month as of August 2026), but the parent business is advertising. | 2026-08 | 2026-09-13 |
| hero.standfirst | Human reviewers, including from service providers, read some collected data | Google, Gemini Apps Privacy Notice: https://support.google.com/gemini/answer/13594961 ("Human reviewers (including trained reviewers from our service providers) review some of the data we collect for these purposes.") | updated 2026-09-24 | 2026-09-27 |
| hero.standfirst | Google asks users not to enter confidential information | Same notice ("Please don't enter confidential information that you wouldn't want a reviewer to see or Google to use to improve our services, including machine-learning technologies.") | updated 2026-09-24 | 2026-09-27 |
| reason.02.body | With Keep Activity off, Google still uses your chats, with help from human reviewers | Same notice ("Even if your Keep Activity setting is off or you use temporary chats, Google still uses your chats to respond to you and help protect Google, our users, and the public, including with help from human reviewers."). The stated purpose — to respond to you and to protect Google, its users and the public — is not repeated in the printed line; a reader who opens the notice will see it, so do not word this as if there were no stated purpose. | updated 2026-09-24 | 2026-09-27 |
| reason.02.body | Chats are held for 72 hours when Keep Activity is off | Same notice ("Temporary chats and chats you have when Keep Activity is off are retained with your account for 72 hours."). Confirmed in Google's own words — no longer dependent on the secondary analyses (vaquill.ai, PhoneArena) it was first sourced to. | updated 2026-09-24 | 2026-09-27 |
| reason.01.body | Chats read by human reviewers are not deleted when you delete your activity; they are kept for up to three years | Same notice ("Chats reviewed by human reviewers (and related data like your language, device type, location info, or feedback) are not deleted when you delete your activity. Instead, they are retained for up to three years."). Confirmed in the current notice; the 2024 Gizmodo piece is no longer needed. The older "kept separately, not connected to your Google Account" wording does NOT appear in the current notice and is not printed. | updated 2026-09-24 | 2026-09-27 |
| reason.03.body | The World Economic Forum says most cloud infrastructure is American-owned; the CLOUD Act lets US authorities compel a US provider to produce data wherever it's stored | See sources-shared-claims.md — WEF ("Worldwide, 70 percent of cloud computing infrastructure is American owned"); CLOUD Act (2018) permits US authorities to compel US-based providers to produce data regardless of where it is stored. This guide's wording is deliberately tighter than the sentence shared across 13 guides and drops that line's absolute ("local legislation and privacy controls do not protect you"), which the CLOUD Act row does not support. | current | 2026-09-27 |
| (retention default) | Keep Activity auto-delete defaults to 18 months, adjustable to 3, 36 months or indefinite | https://support.google.com/gemini/answer/13594961 | updated 2026-06-29 | 2026-09-13 |
| alternative.01 (all fields) | Mistral AI SAS, Paris; EU hosting; free tier and ~$14.99 Pro | Carried from issue 006's ledger. https://guptadeepak.com/geo-compass/engines/mistral-le-chat/; https://costbench.com/software/ai-chatbots/mistral/ | 2026 | 2026-09-13 |
| alternative.02.ownership | Maintained by Menlo Research; AGPL-3.0; source on GitHub | https://flathub.org/apps/details/ai.jan.Jan ("actively maintained by Menlo Research"); repository github.com/menloresearch/jan, licence AGPL-3.0 | current | 2026-09-13 |
| alternative.02.blurb | Runs entirely offline on the user's own machine | https://flathub.org/apps/details/ai.jan.Jan ("runs 100% offline on your computer"); inference via Cortex/llama.cpp locally | current | 2026-09-13 |
| alternative.02.funding | Free, open source; telemetry off by default; remote providers opt-in | https://learn.engineering.vips.edu/frameworks/jan-ai ("Telemetry is off by default and remote providers are opt-in per model") — **secondary; verify against Jan's own docs before publishing** | 2026-04-20 | 2026-09-13 |
| alternative.02.catch | Locally runnable models are weaker; older hardware is slow | Consistent across comparisons, e.g. https://toolhalla.ai/tool/jan | 2026 | 2026-09-13 |

## Dropped for lack of source

- **"Google trains Gemini on your Gmail."** Same claim dropped in issue 001, same reason: Google denies it on the record and no document was found permitting it. Gemini's notice covers Gemini Apps conversations, which is a narrower thing, and that is all the page says.
- **"Gemini records you when you think it is off."** A university IT advisory referenced Gemini continuing to summarise meeting content after apparently being turned off. Single secondary source, no primary incident report found. Not printed — it would be the strongest reason on the page if it could be verified, so it is worth chasing.
- **Paid tiers being exempt from human review.** At least one source asserts review applies to paying subscribers too. Plausible from the notice's wording but not explicitly confirmed. Left out rather than guessed.
- **Specific Gemini ad-targeting mechanics.** Unlike ChatGPT in issue 006, no evidence was found that Gemini conversations feed ad targeting directly. The model field reflects Alphabet's business, not a claim about Gemini chats. Do not let a future edit blur those.

## Weak link — fix before publishing

- ~~The three-year retention figure~~ — **resolved 2026-09-27.** Confirmed in the current notice (updated 2026-09-24); reason 01 now quotes it directly.
- ~~The 72-hour figure~~ — **resolved 2026-09-27.** Google's own notice states it; reason 02 no longer depends on secondary analyses.
- **Jan's corporate jurisdiction.** Menlo Research's registered country was not established. This matters less than usual, because inference is local and there is no data controller — which is why the jurisdiction field says so plainly rather than guessing. But the ownership gate is only half-passed, and a reader may reasonably ask. Resolve it.
- **Jan's telemetry default** is sourced to a third-party framework guide. Verify in Jan's own documentation before printing it as fact.

## Goes stale

- **Google's Gemini Apps Privacy Notice.** The standfirst and reasons 01 and 02 quote it directly. It was last updated 24 September 2026 (previously 29 June) and has been revised repeatedly since launch, including renaming "Gemini Apps Activity" to "Keep Activity" and adding "or you use temporary chats" to the Keep Activity sentence. Re-check on every update. This page is more exposed to a single document than any other in the series except issue 005.
- **Gemini's user count.** Went from 400 million (May 2025) to 1 billion (August 2026). It will be wrong within months. Re-check quarterly.
- **Android integration.** Gemini replaced Assistant and continues absorbing system functions, with expanded access to calls and messages rolling out in 2026. Exit route step three needs re-checking at each Android release.
- **Mistral's independence and pricing.** Carried from issue 006, with the same open question about its largest shareholder.
- **Jan's viability.** A volunteer-adjacent open-source project with a small company behind it. Confirm active releases before republication.
