# Commercial speech — disclosure and consumer law

The moment this platform earns money from a recommendation, a second body of law
switches on, and in four of the five markets it is a sharper risk than
defamation. Defamation requires a company with an appetite to sue. Consumer law
requires one annoyed reader and a regulator with a web form.

**Not legal advice.** A working reference. See `jurisdictions.md` for the
defamation picture and `rtm-leave-validation/references/legal.md` for UK/EU/US
detail.

---

## Why this is now the bigger exposure

Three things changed at once when referral revenue entered the picture:

1. **The pages became commercial communications**, at least in part. Editorial
   criticism enjoys the widest latitude in every market here. Advertising
   enjoys the least. An exit guide that earns commission on the alternative it
   recommends sits somewhere between, and regulators decide where.
2. **"Just my personal view" weakens.** The first-person voice is a genuine and
   defensible editorial choice, but a critic will point out that the view is
   monetised. Disclosure is what keeps that from being a gotcha — it turns a
   discovered fact into a declared one.
3. **The people protected are our readers**, not the companies we criticise. A
   Fair Trading Act or ACCC finding says we misled the people we set out to
   help. For a platform whose only asset is trust, that is worse than a letter
   from Amazon.

---

## What must be disclosed

A **material connection** — anything that might reasonably affect how much
weight a reader gives the recommendation:

- Affiliate or referral commission, including per-signup bounties
- Free or comped accounts, review units, press access
- Paid placement, sponsorship, or any payment for coverage
- An ownership or personal interest in a recommended service

The test is the reader's perspective, not ours. "It did not influence me" is
irrelevant — the question is whether a reader would want to know.

---

## The five markets

| Market | Instrument | What it requires |
|---|---|---|
| **US** | FTC Endorsement Guides | Clear and conspicuous disclosure of material connections, close to the claim. The most developed regime and the one to design against. |
| **Australia** | ACL ss.18, 29 + ACCC influencer guidance | No misleading conduct; endorsements must not misrepresent. ACCC runs active influencer sweeps. |
| **New Zealand** | Fair Trading Act 1986 s.9 + ASA Advertising Standards Code | No misleading conduct in trade; advertising must be identifiable as advertising. |
| **UK** | DMCCA 2024 Part 4 + CAP Code | No misleading actions or omissions; ads must be obviously identifiable. ASA rulings are published. |
| **EU** | Dir. 2005/29/EC as implemented | Misleading **omissions** are actionable — failing to disclose is itself a practice. |

Design to the strictest, which is the FTC's "clear and conspicuous", and the
other four are satisfied.

---

## How to disclose, concretely

**Near the recommendation, not in a footer.** Every regime in the table rejects
disclosure that a reader must go looking for. A line in the site footer, a
privacy policy, or an "about" page does not do it.

**In plain words.** "We may earn a commission if you sign up through this link."
Not "affiliate relationships may exist" and not a bare `#ad` hashtag buried in
tags.

**Before the click, not after.** The reader should know before they act.

**On every surface.** A TikTok script, a Mastodon post and an email each need
their own disclosure. The website's disclosure does not travel with a link
pasted elsewhere.

### What is already right on this platform

`referralUrl` renders with `rel="noopener sponsored"`. That is the correct
technical markup and it matters for search engines — **but it is invisible to a
reader and satisfies no regulator in the table.** It is necessary and nowhere
near sufficient. The visible line is the compliance.

---

## The two guardrails that protect the whole series

These are editorial commitments, not legal requirements, and they are what keep
the commercial and the editorial from contaminating each other. They come from
`rtm-exit-guide/references/criteria.md`, which says the mandatory catch is "the
difference between the series and an affiliate blog, and readers can tell
instantly".

1. **Commission never decides the ranking.** Slot one is won on the eight
   principles. Ten of the twenty-six alternatives currently recommended pay
   nothing at all — Mastodon, Bluesky, PeerTube, ARTE, Bandcamp, itch.io, Jan,
   Wero, Loops, The Drivers Cooperative — and several of those are the strongest
   recommendations in the series. **That is the proof the rankings are honest,
   and it is worth saying on the site.**
2. **Never soften a catch to protect a commission.** The catch is the disclosure
   that makes the recommendation credible. Weakening one because the company now
   pays us is the exact failure mode readers are alert to, and under EU and UK
   rules a misleading *omission* is actionable in its own right.

A useful test before publishing any change to a recommendation: **would I make
this edit if the link paid nothing?** If not, do not make it.

---

## Claims about someone else's product

A separate trap, and the one most likely to catch a careful writer off guard.
Consumer law reaches what we say about the alternatives we recommend, not just
about the companies we criticise.

- "Completely private", "they can never see your data", "totally secure" — these
  are promises about a third party's product that we cannot evidence. Banned by
  `rtm-exit-guide` already; they are also consumer-law exposure pointed at us.
- Prices go stale. A price stated without a "checked" date, on a page earning
  commission, is a misleading representation waiting to happen. The ledgers
  already carry check dates — keep them current and publish them.
- Never overstate an alternative's protection to make the switch look better.
  The honest framing — "a meaningful improvement, not disappearing" — is both
  the house style and the defensible one.

---

## The referral/affiliate distinction

Covered in full in `content/exit-guides/sources/referral-opportunities.md`, and
it is a terms-of-service issue rather than a consumer-law one, but it belongs in
the same habit of mind.

Personal refer-a-friend schemes are written for private use and several
explicitly forbid commercial use — MUBI restricts referrals to "personal and
non-commercial purposes", Tuta's is "only meant for inviting people you know".
Putting those codes on a monetised public page risks the account and, if
discovered, looks exactly like the behaviour this platform criticises. Where
both a referral scheme and an affiliate programme exist, take the affiliate
programme.
