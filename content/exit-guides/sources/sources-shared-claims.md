# Source ledger — claims shared across multiple guides

Researched: 2026-09-21 · Not for publication

Claims that appear verbatim on more than one guide live here rather than being
copied into every per-guide ledger. A change to one of these rows changes every
page listed in its "Appears on" column, so check the whole list before editing.

| Field | Claim as printed | Source | Published | Checked |
|---|---|---|---|---|
| `reason.03.body` (13 guides) | "According to the World Economic Forum, the majority of data in the Western world is stored on U.S.-owned servers." | World Economic Forum, *Where is the cloud, and who owns it?* — https://www.weforum.org/stories/industries-in-depth/where-is-the-cloud-and-who-owns-it/ — states that **"Worldwide, 70 percent of cloud computing infrastructure is American owned"**, with almost all the remaining 30% Chinese-owned. Corroborated for Europe specifically: Amazon, Microsoft and Google hold roughly **70% of the European cloud market**, and the three American hyperscalers accounted for nearly two-thirds in 2024 | current | 2026-09-21 |
| `reason.03.body` (13 guides) | "Even using a US based digital application in a foreign country is bound by US legislation - local legislation and privacy controls do not protect you" | The CLOUD Act (Clarifying Lawful Overseas Use of Data Act, 2018) permits US authorities to compel US-based providers to produce data regardless of where it is stored. This is the same statutory point already cited in the per-guide `alternative.NN.jurisdiction` fields | 2018 | 2026-09-21 |

**Appears on:** leave-amazon, leave-amazon-prime, leave-audible, leave-chatgpt,
leave-gemini, leave-grok, leave-netflix, leave-paypal, leave-uber, leave-x,
leave-xbox, leave-youtube, leaving-gmail.

**Not applied to:** leave-spotify (Spotify Technology S.A., Luxembourg),
leave-temu (PDD Holdings, China/Ireland), leave-tiktok (ByteDance Ltd.,
China/USA — see the note below).

## The figure that was cut

The original wording read **"over 92% of all data in the Western world is
stored on U.S.-owned servers"**, attributed to the World Economic Forum.

**That figure could not be verified and should not be restored.** Two searches
found nothing supporting 92%, and the findable numbers are materially lower:
the US hosts roughly a third of the world's data centres and about 39% of
hyperscale data centres. The nearest defensible WEF figure is the 70% cloud
*ownership* share in the row above — a claim about who owns the infrastructure,
not where the bytes sit, which is why the printed sentence says "U.S.-owned
servers" rather than "servers in the US".

"The majority" is deliberately conservative: it is comfortably true at 70% and
stays true if that share drifts. **Do not put a specific percentage back on the
page without a citation for that exact number.** An attributed statistic is the
most checkable sentence on any page, and a wrong one attributed to a named
institution is the easiest possible thing for a critic to discredit.

## TikTok — an open question for the editor

`leave-tiktok` was excluded because the subject is ByteDance Ltd., which is
Chinese-owned, and the page's jurisdiction field reads "CHINA / USA". But the
American joint venture means US user data is hosted by Oracle and therefore
does sit inside US legal process. A case can be made either way, and it is an
editorial call rather than a factual one.

## A note on repetition

This reason now appears word-for-word on thirteen of sixteen guides. That is a
deliberate drumbeat, not an oversight — but a reader who opens two guides in a
row will see it twice, and `rtm-exit-guide/SKILL.md` asks for three reasons
"mapped to the highest-weighted principles that actually apply to this
subject". Worth a periodic check that slot 03 is still earning its place on
every page rather than displacing something sharper.

## What slot 03 used to hold

Recorded so nothing is lost. Each of these was sourced in its own guide's
ledger and can be restored, moved into another slot, or reworked:

| Guide | Previous reason 03 |
|---|---|
| leave-amazon | Kept Until They Decide — no retention period in Amazon's privacy notice |
| leave-amazon-prime | I Paid, Ads Came — adverts added to Prime Video, extra charge to remove |
| leave-audible | I'm Only Renting — DRM, titles tied to the account |
| leave-chatgpt | Not As Independent — Microsoft's ~27% holding and model access to 2032 |
| leave-gemini | I Can't Delete It — review conversations kept up to three years |
| leave-grok | Not What I Joined — SpaceX bought xAI, then dissolved it |
| leave-netflix | My Tier Disappeared — cheaper ad-free tier withdrawn |
| leave-paypal | Opting Out Didn't Finish — partial opt-out, merchant policy governs |
| leave-uber | Four Fines, One Country — four Dutch penalties, 2018–2026 |
| leave-x | My Posts Fed It — posts trained Grok by default from July 2024 |
| leave-xbox | The Rollback Cost Me — price partly rolled back, day-one CoD removed |
| leave-youtube | I'm Not Told Why — the signal list has never been published |

**`leave-youtube` is the one to look at hardest.** Its three reasons were a
single argument in three beats — it guesses your age, the appeal costs you a
passport, and you are never told which signals decided it. Removing the third
beat leaves the page stating a problem and a remedy with no closing turn, and
the standfirst and `subject.statement` both still point at the secrecy that
reason 03 used to carry.
