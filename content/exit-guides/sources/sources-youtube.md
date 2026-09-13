# Source ledger — Leave YouTube
Researched: 2026-09-13
Not for publication.

**PUBLICATION BLOCKER: `subject.users` is a TK placeholder.** Fourth in the series. See the consolidated list below.

| Field | Claim as printed | Source | Published | Checked |
|---|---|---|---|---|
| subject.jurisdiction | USA | Google LLC, a subsidiary of Alphabet Inc. Same divergence treatment as issues 001 and 007. | — | 2026-09-13 |
| subject.owner | Google LLC (Alphabet Inc.) | As above | — | 2026-09-13 |
| subject.users | **TK** | Not established this session. YouTube's user figure is published by Google. Fill from Alphabet's own disclosure. | — | 2026-09-13 |
| subject.model | Ad Targeting | Alphabet's advertising-dominant model, established in issue 001. YouTube also sells Premium subscriptions. | — | 2026-09-13 |
| reason.01.body | AI age estimation began rolling out to US users on 13 August 2025, using YouTube activity and account longevity regardless of the stated birthday | YouTube's own blog post by James Beser, senior director of product management for youth products, quoted at https://au.variety.com/2025/digital/news/youtube-ai-age-verification-automatically-restrict-under-18-users-26503 ("This technology will allow us to infer a user's age and then use that signal, regardless of the birthday in the account"). Corroborated: https://www.androidauthority.com/youtube-age-estimation-us-rollout-3586621/; https://www.documentarytube.com/blog/youtubes-age-estimation-rollout-explained-what-changed-on-august-13-2025/ — **fetch Beser's original post on blog.youtube before publishing** | 2025-08-13 | 2026-09-13 |
| reason.01.body | Signals include watch history, search history and account age | https://www.androidauthority.com/youtube-age-estimation-us-rollout-3586621/ ("based on factors such as their viewing habits, YouTube search history, and how long their account has been active"); https://www.awesomecreatoracademy.com/blog/youtube-ai-age-verification-policy | 2025-08 | 2026-09-13 |
| reason.02.body | Appeal is by government ID, selfie or credit card | YouTube's own wording via Variety: users "have the option to verify your age (through government ID, selfie or a credit card) if you believe our age estimation model is incorrect" | 2025-08-13 | 2026-09-13 |
| reason.03.body | YouTube has not published the complete list of signals | https://www.documentarytube.com/blog/youtubes-age-estimation-rollout-explained-what-changed-on-august-13-2025/ ("The company describes the system as using a variety of signals, including YouTube activity and how long an account has existed. It has not published a complete list of every signal") | 2026-09-07 | 2026-09-13 |
| reason.03 (fairness) | **The same source cautions that claims about specific genres triggering the system are "too simplistic", and that YouTube says an account is not classified solely for watching Pokémon, Minecraft, Roblox or anime.** The page makes no genre claim, deliberately. Do not let a future edit add one. | Same source | 2026-09-07 | 2026-09-13 |
| reason.01 (scope) | **Most users are never asked for documentation** — the system is estimation-first, and the overwhelming majority of accounts never present an ID. https://xident.io/blog/youtube-ai-age-estimation-estimation-first-age-assurance-stack-2026/. **Not printed. The page says "if the estimate is wrong", which is accurate, but a reader could infer ID checks are routine. Consider a clause; this is the fairness-gap pattern flagged in issues 015, 016 and 018.** | 2026-08 | 2026-09-13 |
| reason.01 (context) | YouTube says it has used age estimation in other countries "for some time, where it is working well", and the driver is age-assurance legislation including the UK Online Safety Act and EU rules | Variety as above; https://cybernews.com/privacy/youtube-ai-age-verification-launch/ — **not printed, but relevant: this is partly a response to law, which a fair page might acknowledge** | 2025 | 2026-09-13 |
| alternative.01.ownership | Open-source project, no owning company, source on GitHub | https://github.com/freetubeapp/freetube/ (official repository) | current | 2026-09-13 |
| alternative.01.blurb | Fetches video without official APIs, cookies or JavaScript tracking; subscriptions and history stored locally; subscribe without an account | Official README: "FreeTube does not use any official APIs to obtain data. While YouTube can still see your video requests, it can no longer track you using cookies or JavaScript. Your subscriptions, playlists and history are stored locally on your computer and never sent out." | current | 2026-09-13 |
| alternative.01.catch | Still in beta; desktop only; YouTube can still see your IP | Official README: "FreeTube is currently in Beta... there are still bugs and missing features"; "Using a VPN or Tor is highly recommended to hide your IP while using FreeTube"; Windows 10+, macOS 12+, Linux | current | 2026-09-13 |
| alternative.01.catch | Blocks advertising, so creators earn nothing from you | Follows from the README's ad-blocking feature. **Reasoned rather than sourced, but it is the honest consequence and belongs on the page — see note below.** | — | 2026-09-13 |
| alternative.01 (licence) | The page says "open source" without naming a licence. FreeTube is generally distributed under the AGPL, but the licence was not confirmed in the material retrieved. **Verify before adding it.** | — | — | 2026-09-13 |
| alternative.02 (all fields) | Nebula | Carried from issue 018's ledger. https://en.wikipedia.org/wiki/Nebula_(streaming_service); pricing https://www.thepricer.org/how-much-does-nebula-cost/ (October 2025 — confirm on nebula.tv) | 2026 | 2026-09-13 |

## A note on the FreeTube catch

The catch says plainly that using FreeTube means the creators you watch earn nothing from you, and step four of the exit route tells readers to pay two creators directly. **That is deliberate and should survive editing.** A series arguing for treating people fairly cannot recommend an ad-blocker without saying who loses. It is also the honest reason the two alternatives are paired the way they are: FreeTube solves the tracking, Nebula solves the paying, and neither solves both.

## Dropped for lack of source

- **The 2019 FTC COPPA settlement** ($170m over children's data). Seven years old and remediated. Stale-scandal trap.
- **Radicalisation and the recommendation algorithm.** Heavily studied, genuinely contested, and impossible to state fairly in two sentences. Would need its own issue and a much deeper research pass.
- **The ad-block crackdown.** Real and irritating, but it is a fight about ad-blocking rather than about the reader's data, and it sits awkwardly beside recommending FreeTube.
- **YouTube Premium pricing.** Not researched this session.
- **Watch history feeding the wider Google advertising profile.** Almost certainly true and would tie neatly to issues 001 and 007, but no document was found this session stating it plainly. Reason 03 makes a narrower, sourced point instead. **Worth chasing — it would be a stronger third reason.**
- **AI slop and synthetic channels.** The parallel to issue 016 is tempting; the facts were not researched.

## Weak link — fix before publishing

1. **Fetch Beser's original post on blog.youtube.** Reasons 01 and 02 both quote it through Variety. It is YouTube's own announcement and it is public.
2. **Consider adding that most users are never asked for ID.** The page is accurate as written, but a reader could reasonably infer that documentation checks are routine, and they are not. Fourth issue in a row where the company's mitigating context sits in the ledger rather than on the page.
3. **Confirm FreeTube's licence** before describing it as anything more specific than open source.
4. **Confirm Nebula's pricing** — carried from issue 018 and reviewed October 2025.
5. **Fill `subject.users`.**

## Consolidated metadata blockers

Four issues now carry TK placeholders, and three more carry figures that need relabelling. Recommended single pass:

| Issue | Field state | Action |
|---|---|---|
| 004 Facebook | 2.28bn ad reach | Replace with a user count or relabel |
| 011 Amazon | 200m Prime, 2021 | Wrong measure for the page |
| 013 Temu | DSA threshold floor | Use Temu's DSA transparency figure |
| 014 PayPal | TK | Pull from latest results |
| 015 Uber | TK | Pull monthly active platform consumers |
| 017 Audible | TK | May not exist; consider market share |
| 018 Netflix | 325m milestone | Label as a floor |
| 019 YouTube | TK | Pull from Alphabet's disclosure |

## Goes stale

- **The age-estimation rollout.** Began in the US in August 2025 and expanding through 2026 to Australia, Canada and elsewhere. Reason 01's geography will date quickly. Re-check quarterly.
- **Age-assurance law.** The UK Online Safety Act, EU rules and the EU Digital Identity Wallet are all in motion. If ID checks become mandatory rather than an appeal route, this page's argument changes shape entirely.
- **FreeTube's viability.** It works by extraction rather than official APIs, so it breaks whenever YouTube changes things, and it has been in beta for years. Confirm it still functions before republication — this is the most fragile alternative in nineteen issues.
