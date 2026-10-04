# Exit Guide markdown source

Drop a `.md` file in this directory for every "Exit Big Tech" post, then run:

```
npm run import:exit-guides
```

This upserts a Post (`postType: exitGuide`) per file, matched by `slug` — safe
to re-run any time you add or edit a file. It only **creates and updates**
posts; it never deletes one, even if you remove its `.md` file.

## Media, referral links and status

Structured markdown carries everything needed to publish. All of these are
optional; media fields name a file already in the Media collection, exactly as
the YAML format does.

```
## meta.status
published

## meta.heroImage
hdr-rethink-youtube.jpg

## meta.video
vid-server-slave.mp4

## alternative.01.image
hdr-rethink-profiling.jpg

## alternative.01.referralUrl
https://curiositystream.com/

## alternative.01.learnMoreUrl
https://curiositystream.com/about
```

`learnMoreUrl` is optional and puts a second, outlined button next to the
referral one. Leave it out and only the referral button shows. Unlike
`referralUrl`, it opens without `rel="sponsored"` — point it at something
non-commercial (the service's own about/privacy page, a review, Wikipedia),
not another affiliate link. `learnMoreLabel` defaults to "Learn More".

## SEO description

Every guide carries a `## meta.description` (in the YAML format: `meta:` →
`description:`). It fills the post's SEO tab description, which is what search
results and link previews show. Keep it **100–150 characters** — the SEO tab
warns outside that range.

House rules, so the entry can't outrun the page it advertises:

- Lead with the search phrase ("Leaving X?" / "How to leave X:"), then name the
  alternatives the guide actually recommends and what the five steps do.
- State no fact the page does not itself source. Most guides keep their ledger
  off-page, so descriptions stay neutral: no fines, figures, accusations or
  "they sell your data". See `rethinkthemachine-defensible-content`.
- No promises about an alternative's privacy or security, and no superlatives
  ("best", "safest").
- Plain text only, one per guide — never reuse a description across guides.

### Pushing descriptions to the database

Edit the entry, then:

```
DRY_RUN=1 npm run import:seo-descriptions   # preview: what would change
npm run import:seo-descriptions             # write it
```

This is deliberately **not** the full importer above. It writes only
`meta.description` on posts that already exist, so it can't demote a published
post, doesn't need any media uploaded, and doesn't rebuild arrays. It also
never changes a post's published/draft status:

- published, nothing pending → written live;
- published **with a newer unpublished draft** → saved to that draft only, the
  live page is untouched until you publish the draft in the admin;
- draft → saved to its draft (the SEO tab shows it).

`SKIP_SLUGS=leave-spotify,leave-youtube` leaves those posts' descriptions
alone. A description already in the database is replaced by the file's, so the
`.md` is the source — use `SKIP_SLUGS` (or edit the file) to keep a different one.

If the entry is omitted, the import leaves the SEO tab description untouched.

`referralUrl` is required by the schema, so a file that does not carry one for
**every** alternative can only be saved as a draft, and `meta.status:
published` is ignored until it does. That is the difference between the three
published guides and the thirteen drafts — the drafts have no referral links
yet, not anything wrong with them.

## Published posts are protected

The script refuses to overwrite a **published** post with a file that would
import as a draft, because that demotes the live post. It names what is missing
and stops.

What is actually at risk in an import is narrower than it looks. Payload merges
the update, so scalar fields and media relationships — `heroImage`,
`whyExit.video` — survive being left out of the file. **Arrays do not.**
`alternatives` is rebuilt from the file every time, so any `referralUrl` or
`image` the file does not carry is lost even though the hero image beside it
survives.

A complete file updating a published post is the normal path and runs
unimpeded. Pass `--force-published` to demote one deliberately.

## Dry runs

```
DRY_RUN=1 npm run import:exit-guides
```

Use the environment variable, not the flag. `payload run` eats a bare
`--dry-run` (it only arrives as `payload run <script> -- --dry-run`), and a
swallowed flag means a real import when you asked for a preview.

## Media

This script does not touch media. Upload images/video through the admin
panel first (Media collection), then reference them **by filename** in
frontmatter (e.g. `heroImage: post-exist-gmail.jpg`) — the script looks the
file up by its `filename` field. If a referenced filename doesn't exist yet,
that file's import fails with a clear error and the script moves on to the
next file.

## Categories

`categories` is a list of category titles. Any that don't already exist are
created automatically. Omit it and the post defaults to `I'm Leaving You`.

## Bold emphasis

`hero.standfirst` and `subject.statement` support **one** bolded phrase,
written with `**double asterisks**`, e.g.:

```yaml
statement: "Gmail is not a mail client. It is a surveillance surface — **free** because you are the product."
```

Only the first `**...**` pair is treated as emphasis; don't use more than one
per field (the design only ever marks one phrase per statement).

## Frontmatter reference

See `_example.md` in this directory for a complete, working file (the "Leave
Gmail" post already live on the site). Required fields are marked below;
everything else is optional and falls back to the template's built-in
placeholder text if omitted.

```yaml
---
slug: leaving-gmail          # required — also the URL: /posts/<slug>
title: Leave Gmail           # required — internal/admin title, also default meta title
status: published            # draft | published (default: published)
appName: Gmail               # required
guideNumber: "007"
categories: ["I'm Leaving You"]
heroImage: post-exist-gmail.jpg   # required — media filename

hero:
  kicker: "Exit Big Tech // Guide No. 007 // Email"
  titleLine1: Leave
  titleLine2: Gmail           # required
  standfirst: "... waits on the **other side**."

subject:
  label: "The Subject [01]"
  statement: "... because you are **free**."   # required
  specs:                       # up to 4
    - key: Jurisdiction
      value: United States
    - key: Owner
      value: Alphabet Inc.

whyExit:
  label: "Why Exit [02]"
  video: slide-1.mp4           # required — media filename
  reasons:                     # 1–5
    - number: "01"
      title: They Read The Room
      body: "..."

altsLabel: "The Alternatives [03]"
altsIntro: "..."
alternatives:                  # required, at least 1, up to 4
  - name: Proton Mail
    tagline: "Encrypted Mail · Geneva"
    rank: "[001] Recommended First Move"
    description: "..."
    image: proton-slab.jpg     # optional — omit for a typographic slab
    difficulty: 2               # 2–5
    ctaLabel: Make The Switch
    referralUrl: "https://proton.me/mail"   # required

migrationLabel: "The Exit Route [04]"
migrationHeading: "Five Steps Out The Door"
migrationSteps:                # required, at least 1, up to 8
  - title: Claim Your New Address
    body: "..."

carouselHeading: "Next On The Way Out"
carouselCategoryOverride: null  # optional category title; defaults to `categories`
carouselLimit: 6

meta:
  description: "..."           # optional — defaults to the standfirst/statement text
---
```

The markdown body below the frontmatter (if any) is ignored — this template
has no free-form prose section, it's entirely structured fields.
