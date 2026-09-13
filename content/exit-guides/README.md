# Exit Guide markdown source

Drop a `.md` file in this directory for every "Exit Big Tech" post, then run:

```
npm run import:exit-guides
```

This upserts a Post (`postType: exitGuide`) per file, matched by `slug` — safe
to re-run any time you add or edit a file. It only **creates and updates**
posts; it never deletes one, even if you remove its `.md` file.

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
