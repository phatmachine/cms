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
| reason.01.body | Human reviewers, including from service providers, read some collected data | Google, Gemini Apps Privacy Notice: https://support.google.com/gemini/answer/13594961 ("Human reviewers (including trained reviewers from our service providers) review some of the data we collect for these purposes.") | updated 2026-06-29 | 2026-09-13 |
| reason.01.body | Google asks users not to enter confidential information | Same notice ("Please don't enter confidential information that you wouldn't want a reviewer to see or Google to use to improve our services, including machine-learning technologies.") | updated 2026-06-29 | 2026-09-13 |
| reason.02.body | With Keep Activity off, Google still uses chats and still involves human reviewers | Same notice ("Even if your Keep Activity setting is off, Google still uses your chats to respond to you and help protect Google, our users, and the public, including with help from human reviewers.") | updated 2026-06-29 | 2026-09-13 |
| reason.02.body | Chats retained around 72 hours when activity is off | https://www.vaquill.ai/blog/is-gemini-private-legal; corroborated at https://www.phonearena.com/news/be-careful-what-you-ask-gemini_id155214 — **confirm the 72-hour figure in Google's current notice before publishing** | 2026-07 | 2026-09-13 |
| reason.03.body | Human-reviewed conversations are kept separately, not deleted with your activity, and retained up to three years | Google's Gemini privacy policy, quoted at https://gizmodo.com/googles-gemini-ai-keeps-your-conversations-three-years-1851253573 ("they are kept separately and are not connected to your Google Account. Instead, they are retained for up to three years") — **the Gizmodo piece is from 2024; re-confirm the three-year figure in the 29 June 2026 notice** | orig. 2024 | 2026-09-13 |
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

- **The three-year retention figure.** Load-bearing for reason 03, and the clean quotation traces to 2024 coverage. The current notice was updated 29 June 2026. Open it and confirm the three-year figure survives in the present wording. If it has changed, reason 03 changes with it.
- **The 72-hour figure** in reason 02 comes from secondary analyses rather than a direct quotation. Same fix: confirm in the live notice.
- **Jan's corporate jurisdiction.** Menlo Research's registered country was not established. This matters less than usual, because inference is local and there is no data controller — which is why the jurisdiction field says so plainly rather than guessing. But the ownership gate is only half-passed, and a reader may reasonably ask. Resolve it.
- **Jan's telemetry default** is sourced to a third-party framework guide. Verify in Jan's own documentation before printing it as fact.

## Goes stale

- **Google's Gemini Apps Privacy Notice.** All three reasons quote it directly, and Google updated it on 29 June 2026 — it has already been revised at least twice since launch, including renaming "Gemini Apps Activity" to "Keep Activity". Re-check on every notice update. This page is more exposed to a single document than any other in the series except issue 005.
- **Gemini's user count.** Went from 400 million (May 2025) to 1 billion (August 2026). It will be wrong within months. Re-check quarterly.
- **Android integration.** Gemini replaced Assistant and continues absorbing system functions, with expanded access to calls and messages rolling out in 2026. Exit route step three needs re-checking at each Android release.
- **Mistral's independence and pricing.** Carried from issue 006, with the same open question about its largest shareholder.
- **Jan's viability.** A volunteer-adjacent open-source project with a small company behind it. Confirm active releases before republication.
